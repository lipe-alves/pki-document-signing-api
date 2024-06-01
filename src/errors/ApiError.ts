import { ResponseCode } from "../types";
import responseCodes from "../constants/responseCodes";

class ApiError extends Error {
    public status: number;
    public code: ResponseCode;

    constructor(status?: number, message?: string, code?: ResponseCode) {
        super(message);
        this.status = status || 500;
        this.code = code || responseCodes.INTERNAL_SERVER_ERROR;
    }
}

export default ApiError;
export { ApiError };
