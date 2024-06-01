import responseCodes from "../constants/responseCodes";
import ApiError from "./ApiError";

class InvalidParam extends ApiError {
    constructor(paramName: string) {
        super(
            400,
            `Invalid ${paramName} param value`,
            responseCodes.INVALID_PARAM_ERROR
        );
    }
}

export default InvalidParam;
export { InvalidParam };
