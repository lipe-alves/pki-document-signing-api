import responseCodes from "../constants/responseCodes";
import ApiError from "./ApiError";

class MissingParam extends ApiError {
    constructor(paramName: string) {
        super(
            400,
            `Missing ${paramName} param`,
            responseCodes.MISSING_PARAM_ERROR
        );
    }
}

export default MissingParam;
export { MissingParam };
