import { validateCertificate, decryptCertificate } from "../certificates";
import { TokensDatabase } from "../../databases";
import { ClientError } from "../../errors";
import { generateToken } from "../../utils";
import { Token } from "../../models";
import { DecryptedCertificate, Storage } from "../../services";
import responseCodes from "../../constants/responseCodes";

interface CertificateTokenCreationParams {
    certificate: {
        name: string;
        size: number;
        type: string;
        metadata?: {
            [key: string]: any;
        };
        buffer: Buffer;
    };
    password: string;
}

async function createCertificateToken(params: CertificateTokenCreationParams) {
    const { certificate, password } = params;

    const passwordIsValid = await validateCertificate({
        certificate,
        password,
    });
    if (!passwordIsValid) {
        throw new ClientError(
            "Invalid password",
            responseCodes.WRONG_CERT_PASSWORD
        );
    }

    const decryptedCertificate = await decryptCertificate({
        certificate,
        password,
    });

    const path = generateCertificatePath(params, decryptedCertificate);
    await Storage.uploadFile(path, certificate.buffer);
    const url = await Storage.getDownloadUrl(path);

    const token = new Token({
        certificate: decryptedCertificate,
        content: generateToken(500),
        password,
        url,
    });

    const tokensDb = new TokensDatabase();
    await tokensDb.uid(token.uid).create(token);

    return token.content;
}

export default createCertificateToken;
export { createCertificateToken, CertificateTokenCreationParams };

function generateCertificatePath(
    params: CertificateTokenCreationParams,
    decryptedCert: Partial<DecryptedCertificate>
) {
    const { certificate } = params;
    let path = "tokens/certificates";

    if (decryptedCert.document || decryptedCert.name) {
        path += "/" + (decryptedCert.document?.number || decryptedCert.name);
    }

    path += "/" + certificate.name;

    return path;
}
