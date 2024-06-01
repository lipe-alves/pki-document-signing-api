import { listDocuments } from "../../cases/signatures";
import { Operator } from "../../types";
import createController from "../createController";

type Value = string;

const listDocumentsController = createController<{
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
    const limit = limitQuery === "Infinity" ? Infinity : Number(limitQuery);

    const signedDocuments = await listDocuments({
        queries,
        limit,
    });

    res.status(200).send(signedDocuments);
});

export { listDocumentsController };
export default listDocumentsController;
