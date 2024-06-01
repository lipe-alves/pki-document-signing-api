import ApiError from "./ApiError";
import responseCodes from "../constants/responseCodes";

class InternalServerError extends ApiError {
    constructor() {
        super(
            500,
            "Internal Server Error",
            responseCodes.INTERNAL_SERVER_ERROR
        );
    }
}

export default InternalServerError;
export { InternalServerError };
