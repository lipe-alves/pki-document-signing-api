import signPdf from "@signpdf/signpdf";
import pdftk from "pdftk-firebase";
import { P12Signer } from "@signpdf/signer-p12";
import { plainAddPlaceholder } from "@signpdf/placeholder-plain";

import { IDDocumentType } from "../types";
import { generateUid, toDate } from "../utils";
import { __tmpdir } from "../constants/general";

import * as forge from "node-forge";
import * as fs from "fs";

interface PlaceholderParams {
    reason: string;
    contactInfo: string;
    name: string;
    location: string;
}

interface DecryptedCertificate {
    name: string;
    email: string;
    serialNumber: string;
    signatureOid: string;
    validity: {
        notBefore: Date;
        notAfter: Date;
    };
    issuer: {
        countryName: string;
        organizationName: string;
        organizationalUnitName: string;
        commonName: string;
        hash: string;
    } & { [unknownAttribute: string]: string };
    subject: {
        countryName: string;
        organizationName: string;
        organizationalUnitName: string;
        commonName: string;
        hash: string;
    } & { [unknownAttribute: string]: string };
    document: {
        number: string;
        type: IDDocumentType;
    };
}

class Signer {
    private static async fixCorruptPdf(pdfBuffer: Buffer): Promise<Buffer> {
        const uid = generateUid();
        const inputPath = `${__tmpdir}/${uid}-input.pdf`;
        const outputPath = `${__tmpdir}/${uid}-output.pdf`;

        await pdftk("--version");

        fs.writeFileSync(inputPath, pdfBuffer);

        await pdftk(`${inputPath} output ${outputPath}`);

        const fixedBuffer = fs.readFileSync(outputPath);

        return fixedBuffer;
    }

    public static async plainAddPlaceholder(
        documentBuffer: Buffer,
        params: PlaceholderParams
    ): Promise<Buffer> {
        const addPlaceholder = (buffer: Buffer) => {
            return plainAddPlaceholder({
                pdfBuffer: buffer,
                ...params,
            });
        };

        try {
            return addPlaceholder(documentBuffer);
        } catch (error) {
            try {
                console.error("Error adding placeholder", error);
                console.log("Trying to fix it by itself...");
                documentBuffer = await Signer.fixCorruptPdf(documentBuffer);
                const buffer = addPlaceholder(documentBuffer);
                console.log("PDF fixed!");
                return buffer;
            } catch (error) {
                console.error("Error adding placeholder", error);
                throw error;
            }
        }
    }

    public static checkCertificatePassword(
        certificateBuffer: Buffer,
        password: string
    ): boolean {
        try {
            Signer.decryptCertificate(certificateBuffer, password);
            return true;
        } catch (err) {
            console.error("Error validating password", err);
            console.log("certificateBuffer.length", certificateBuffer.length);
            console.log("password", password);
            return false;
        }
    }

    private static getUserIDDocument(cn: string): {
        name: string;
        document: {
            number: string;
            type: IDDocumentType;
        };
    } {
        let [name, document = ""] = cn.split(":");
        let documentType: IDDocumentType = "cpf";

        if (document) {
            document = document.replace(/\D/g, "");
            const isCPF = document.length === 11;
            const isCNPJ = document.length === 14;
            documentType = isCNPJ ? "cnpj" : "cpf";

            if (!isCPF && !isCNPJ) {
                name = `${name}: ${document}`;
                documentType = "cpf";
            }
        }

        return {
            name,
            document: {
                type: documentType,
                number: document,
            },
        };
    }

    private static getCertificateData(
        forgeCert: forge.pki.Certificate
    ): DecryptedCertificate {
        const decryptedCert: DecryptedCertificate = {
            name: "",
            email: "",
            serialNumber: forgeCert.serialNumber,
            signatureOid: forgeCert.signatureOid,
            validity: {
                notBefore: toDate(forgeCert.validity.notBefore),
                notAfter: toDate(forgeCert.validity.notAfter),
            },
            issuer: {
                countryName: "",
                organizationName: "",
                organizationalUnitName: "",
                commonName: "",
                hash: forgeCert.issuer.hash,
            },
            subject: {
                countryName: "",
                organizationName: "",
                organizationalUnitName: "",
                commonName: "",
                hash: forgeCert.subject.hash,
            },
            document: {
                number: "",
                type: "cpf",
            },
        };

        for (const issuerAttribute of forgeCert.issuer.attributes) {
            const key = issuerAttribute.name;
            const value = Array.isArray(issuerAttribute.value)
                ? issuerAttribute.value.map(String).join(", ")
                : issuerAttribute.value;
            if (!key || !value) continue;

            const existingValue = decryptedCert.issuer[key];
            const alreadyFilled = !!existingValue;
            decryptedCert.issuer[key] = alreadyFilled
                ? `${existingValue} ${value}`
                : value;
        }

        for (const subjectAttribute of forgeCert.subject.attributes) {
            const key = subjectAttribute.name;
            const value = Array.isArray(subjectAttribute.value)
                ? subjectAttribute.value.map(String).join(", ")
                : subjectAttribute.value;
            if (!key || !value) continue;

            const existingValue = decryptedCert.subject[key];
            const alreadyFilled = !!existingValue;
            decryptedCert.subject[key] = alreadyFilled
                ? `${existingValue} ${value}`
                : value;

            if (subjectAttribute.shortName === "CN") {
                const { name, document } = Signer.getUserIDDocument(value);
                decryptedCert.name = name;
                decryptedCert.document = document;
            }
        }

        try {
            const extension: any = forgeCert.getExtension("subjectAltName");

            if (extension && extension.altNames?.length > 0) {
                const [email] = extension.altNames
                    .filter((altName: any) => altName.type === 1)
                    .map((altName: any) => altName.value);
                decryptedCert.email = email;
            }
        } catch {}

        return decryptedCert;
    }

    public static decryptCertificate(
        certificateBuffer: Buffer,
        password: string
    ): DecryptedCertificate[] {
        const certBase64 = certificateBuffer.toString("base64");
        // Decoding certificate data as base64
        const pfxString = forge.util.decode64(certBase64);
        // Converting data from PFX to ASN.1
        const pfxAsn1 = forge.asn1.fromDer(pfxString);

        const decryptedData = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password);
        const decryptedCertificates: DecryptedCertificate[] = [];

        for (const safeContent of decryptedData.safeContents) {
            for (const safeBag of safeContent.safeBags) {
                if (!safeBag.cert) continue;

                decryptedCertificates.push(
                    Signer.getCertificateData(safeBag.cert)
                );
            }
        }

        return decryptedCertificates;
    }

    public static async signDocument(
        documentBuffer: Buffer,
        certificateBuffer: Buffer,
        params: {
            password: string;
            signingTime?: Date;
        }
    ): Promise<Buffer> {
        const { password, signingTime = new Date() } = params;

        const signer = new P12Signer(certificateBuffer, {
            passphrase: password,
        });
        const signedDocument = await signPdf.sign(
            documentBuffer,
            signer,
            signingTime
        );

        return signedDocument;
    }
}

export default Signer;
export { Signer, PlaceholderParams, DecryptedCertificate };
