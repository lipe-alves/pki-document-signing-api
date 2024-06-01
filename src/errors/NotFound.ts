import { ResponseCode } from "../types";
import ApiError from "./ApiError";

class NotFound extends ApiError {
    constructor(message: string, code: ResponseCode) {
        super(
            404,
            message,
            code
        );
    }
}

export default NotFound;
export { NotFound };
