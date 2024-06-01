import { Controller, Request, Response } from "../types";
import { ApiError, InternalServerError } from "../errors";
import responseCodes from "../constants/responseCodes";

function createController<RouteParams extends Request>(
    controller: Controller<RouteParams>
) {
    return async (req: Request & RouteParams, res: Response) => {
        const originalReq = {
            params: JSON.parse(JSON.stringify(req.params)),
            query: JSON.parse(JSON.stringify(req.query)),
            body: JSON.parse(JSON.stringify(req.body)),
            headers: JSON.parse(JSON.stringify(req.headers)),
        };

        try {
            if (!req.params) req.params = {};
            if (!req.query) req.query = {};
            if (!req.body) req.body = {};
            if (!req.headers) req.headers = {};

            await controller(req, res);
        } catch (err) {
            let error: ApiError = new InternalServerError();

            if (err instanceof ApiError) {
                error = err;
            } else if (err instanceof Error) {
                error = new ApiError(
                    500,
                    err?.message,
                    responseCodes.INTERNAL_SERVER_ERROR
                );
            }

            console.log(
                "QUERY:",
                JSON.stringify(originalReq.query || {}, null, 2)
            );
            console.log(
                "BODY:",
                JSON.stringify(originalReq.body || {}, null, 2)
            );
            console.log(
                "PARAMS:",
                JSON.stringify(originalReq.params || {}, null, 2)
            );
            console.log(
                "HEADERS:",
                JSON.stringify(originalReq.headers || {}, null, 2)
            );
            console.log("Error:", error);
            console.log("Date:", new Date());

            res.status(error.status).send({
                status: error.status,
                message: error.message,
                code: error.code,
            });
        }
    };
}

export default createController;
