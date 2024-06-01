import { Signer } from "../../services";
import { CertificatesDatabase } from "../../databases";
import { Certificate } from "../../models";
import { ClientError } from "../../errors";
import responseCodes from "../../constants/responseCodes";

interface CertificateDecryptionParams {
    certificate: {
        uid?: string;
        buffer: Buffer;
    };
    password: string;
}

async function decryptCertificate(params: CertificateDecryptionParams) {
    const { certificate, password } = params;

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

    const [decryptedCert] = Signer.decryptCertificate(
        certificate.buffer,
        password
    );

    const certsDb = new CertificatesDatabase();

    if (certificate.uid) {
        const [certDb] = await certsDb.uid(certificate.uid).get();

        const alreadyDecrypted = !!certDb.decrypted;
        const updates: Partial<Certificate> = {
            ...decryptedCert,
        };

        if (!alreadyDecrypted) {
            updates.decrypted = true;
            updates.decryptedAt = new Date();
        }

        await certsDb.uid(certificate.uid).update(updates);
    }

    return decryptedCert;
}

export default decryptCertificate;
export { decryptCertificate, CertificateDecryptionParams };
