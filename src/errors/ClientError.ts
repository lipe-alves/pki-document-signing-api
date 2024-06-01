import ApiError from "./ApiError";
import responseCodes from "../constants/responseCodes";
import { ResponseCode } from "../types";

class ClientError extends ApiError {
    constructor(
        message: string,
        code: ResponseCode = responseCodes.CLIENT_ERROR
    ) {
        super(400, message, code);
    }
}

export default ClientError;
export { ClientError };
