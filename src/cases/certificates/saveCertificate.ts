import { ClientError } from "../../errors";
import { DecryptedCertificate, Signer, Storage } from "../../services";
import { CertificatesDatabase } from "../../databases";
import { Certificate } from "../../models";
import responseCodes from "../../constants/responseCodes";

interface CertificateSaveParams {
    certificate: {
        uid?: string;
        name: string;
        size: number;
        type: string;
        metadata?: {
            [key: string]: any;
        };
        buffer: Buffer;
    };
    password?: string;
}

async function saveCertificate(params: CertificateSaveParams) {
    const { certificate, password } = params;
    let decryptedCert: Partial<DecryptedCertificate> = {};

    // Needs to be decrypted before saving...
    if (password) {
        const passwordIsValid = Signer.checkCertificatePassword(
            certificate.buffer,
            password
        );

        if (!passwordIsValid) {
            throw new ClientError(
                "Invalid password",
                responseCodes.WRONG_CERT_PASSWORD
            );
        }

        [decryptedCert] = Signer.decryptCertificate(
            certificate.buffer,
            password
        );
    }

    const wasDecrypted = Object.keys(decryptedCert).length > 0;

    const path = generateCertificatePath(params, decryptedCert);
    await Storage.uploadFile(path, certificate.buffer);
    const url = await Storage.getDownloadUrl(path);

    const certsDb = new CertificatesDatabase();
    let dbCertificate: Certificate;
    const baseProps: Partial<Certificate> = {
        filename: certificate.name,
        path,
        url,
        type: certificate.type,
        size: certificate.size,
        metadata: certificate.metadata || {},
        ...decryptedCert,
    };

    if (wasDecrypted) {
        baseProps.decrypted = true;
        baseProps.decryptedAt = new Date();
    }

    if (certificate.uid) {
        await certsDb.uid(certificate.uid).update(baseProps);
        [dbCertificate] = await certsDb.uid(certificate.uid).get();
    } else {
        dbCertificate = new Certificate(baseProps);
        await certsDb.uid(dbCertificate.uid).create(dbCertificate);
    }

    return dbCertificate;
}

export default saveCertificate;
export { saveCertificate, CertificateSaveParams };

function generateCertificatePath(
    params: CertificateSaveParams,
    decryptedCert: Partial<DecryptedCertificate>
) {
    const { certificate } = params;
    let path = "certificates";

    if (decryptedCert.document || decryptedCert.name) {
        path += "/" + (decryptedCert.document?.number || decryptedCert.name);
    }

    path += "/" + certificate.name;

    return path;
}
