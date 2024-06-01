import { signDocument } from "../../cases/signatures";
import { saveCertificate } from "../../cases/certificates";
import { getCertificateToken } from "../../cases/tokens";

import { toDate, convertPDFToBuffer } from "../../utils";
import { MissingParam } from "../../errors";
import { CertificatesDatabase } from "../../databases";
import { Storage } from "../../services";

import createController from "../createController";

const signDocumentController = createController<{
    query: {};
    params: {};
    body: {
        document: {
            name: string;
            size: number;
            type: string;
            buffer: Buffer;
            url?: string;
            metadata?: {
                [key: string]: any;
            };
        };
        certificate?: {
            uid?: string;
            name?: string;
            size?: number;
            type?: string;
            buffer?: Buffer;
            url?: string;
            token?: string;
            metadata?: {
                [key: string]: any;
            };
        };
        signatory: {
            name: string;
            location: string;
            email: string;
            phone: string;
        };
        reason: string;
        password: string;
        signingTime?: string;
    };
    headers: {
        "system-password"?: string;
    };
}>(async (req, res) => {
    let { document, certificate = {}, signatory, reason, password } = req.body;
    const signingTime = toDate(req.body.signingTime);
    const systemPassword = req.headers["system-password"];

    if (!signatory) {
        throw new MissingParam("signatory");
    }

    if (!password) {
        throw new MissingParam("password");
    }

    if (!reason) {
        throw new MissingParam("reason");
    }

    if (document?.url) {
        document.buffer = await convertPDFToBuffer(document.url);
    } else if (document?.buffer) {
        document.buffer = Buffer.from(document.buffer);
    } else {
        throw new MissingParam("document.buffer");
    }

    const parsedCertificate = {
        uid: certificate.uid || "",
        name: certificate.name || "",
        size: certificate.size || 0,
        type: certificate.type || "",
        buffer: certificate.buffer as Buffer,
    };

    // Will use saved certificate
    if (certificate?.uid) {
        const certsDb = new CertificatesDatabase();
        const [certInDb] = await certsDb.uid(certificate.uid).get();
        parsedCertificate.buffer = await Storage.downloadFile(certInDb.path);
    }
    // Will use anonymous certificate
    else if (certificate?.buffer) {
        parsedCertificate.buffer = Buffer.from(certificate.buffer);

        if (!parsedCertificate.name) {
            throw new MissingParam("certificate.name");
        }

        if (!parsedCertificate.size) {
            throw new MissingParam("certificate.size");
        }

        if (!parsedCertificate.type) {
            throw new MissingParam("certificate.type");
        }

        await saveCertificate({
            certificate: parsedCertificate,
            password,
        });
    }
    // Will use an external url
    else if (certificate?.url) {
        parsedCertificate.buffer = await convertPDFToBuffer(certificate.url);
    }
    // Will use token
    else if (certificate?.token) {
        const tokenData = await getCertificateToken({
            token: certificate.token,
            systemPassword,
        });

        parsedCertificate.buffer = await convertPDFToBuffer(tokenData.url);
        password = tokenData.password;
    } else {
        throw new MissingParam("certificate.buffer");
    }

    let contactInfo = `Email: ${signatory.email}`;
    if (signatory.phone) contactInfo += ` | Tel: ${signatory.phone}`;

    const { data } = await signDocument({
        document,
        certificate: parsedCertificate,
        password,
        reason,
        name: signatory.name,
        contactInfo,
        location: signatory.location,
        signingTime,
    });

    res.status(200).send(data);
});

export { signDocumentController };
export default signDocumentController;
