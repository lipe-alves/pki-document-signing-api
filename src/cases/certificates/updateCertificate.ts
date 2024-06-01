import { DecryptedCertificate } from "../../services";
import { CertificatesDatabase } from "../../databases";
import { Certificate } from "../../models";

type SafeKeysToUpdate = Partial<
    Omit<
        Certificate,
        | keyof DecryptedCertificate
        | "uid"
        | "filename"
        | "url"
        | "path"
        | "size"
        | "type"
        | "createdAt"
        | "createdBy"
        | "decrypted"
        | "decryptedAt"
    >
>;

async function updateCertificate(uid: string, updates: SafeKeysToUpdate) {
    const certsDb = new CertificatesDatabase();
    await certsDb.uid(uid).update(updates);

    const [updatedCertificate] = await certsDb.uid(uid).get();
    return updatedCertificate;
}

export default updateCertificate;
export { updateCertificate, SafeKeysToUpdate };
