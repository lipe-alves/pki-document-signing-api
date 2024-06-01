import { TokensDatabase } from "../../databases";
import { NotFound, TokenExpired } from "../../errors";
import { SYSTEM_PASSWORD } from "../../constants/general";
import responseCodes from "../../constants/responseCodes";

interface GetCertificateTokenParams {
    token: string;
    systemPassword?: string;
}

async function getCertificateToken(params: GetCertificateTokenParams) {
    const { token, systemPassword } = params;
    const isSystem = systemPassword === SYSTEM_PASSWORD;

    const tokensDb = new TokensDatabase();
    const [tokenInDb] = await tokensDb.where("content", "==", token).get();

    if (!tokenInDb) {
        throw new NotFound("Token not found", responseCodes.TOKEN_NOT_FOUND);
    }

    if (!isSystem && tokenInDb.deleted) {
        throw new TokenExpired();
    }

    if (!isSystem) {
        await tokensDb.uid(tokenInDb.uid).update({
            deleted: true,
            deletedAt: new Date(),
            deletedBy: "system",
        });
    }

    return tokenInDb;
}

export default getCertificateToken;
export { getCertificateToken, GetCertificateTokenParams };
