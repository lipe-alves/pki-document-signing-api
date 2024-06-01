import { listCertificates } from "../../cases/certificates";
import { Operator } from "../../types";
import createController from "../createController";

type Value = string;

const listCertificatesController = createController<{
    query: {
        [field: string]: `${Operator}${Value}`;
    } & {
        limit?: `${number}` | "Infinity";
    };
    params: {};
    body: {};
    headers: {};
}>(async (req, res) => {
    const { limit: limitQuery = "Infinity", ...queries } = req.query;
    const limit =
        limitQuery === "Infinity" ? Infinity : Number(limitQuery);

    const certificates = await listCertificates({
        queries,
        limit,
    });

    res.status(200).send(certificates);
});

export { listCertificatesController };
export default listCertificatesController;
