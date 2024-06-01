import ApiError from "./ApiError";
import responseCodes from "../constants/responseCodes";

class TokenExpired extends ApiError {
    constructor() {
        super(400, "Token expired", responseCodes.EXPIRED_TOKEN);
    }
}

export default TokenExpired;
export { TokenExpired };
