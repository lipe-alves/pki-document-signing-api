import { Signer } from "../../services";
import { CertificatesDatabase } from "../../databases";
import { Certificate } from "../../models";

interface CertificateValidationParams {
    certificate: {
        uid?: string;
        buffer: Buffer;
    };
    password: string;
}

async function validateCertificate(params: CertificateValidationParams) {
    const { certificate, password } = params;

    const passwordIsValid = Signer.checkCertificatePassword(
        certificate.buffer,
        password
    );

    if (passwordIsValid) {
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
    }

    return passwordIsValid;
}

export default validateCertificate;
export { validateCertificate, CertificateValidationParams };
