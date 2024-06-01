import { SignedDocumentsDatabase } from "../../databases";
import { Operator } from "../../types";
import { operators } from "../../constants/queries";

type Value = string;

interface ListDocumentsParams {
    queries: {
        [field: string]: `${Operator}${Value}`;
    };
    limit: number;
}

async function listDocuments(params: ListDocumentsParams) {
    const { limit, queries } = params;

    let query = new SignedDocumentsDatabase();

    for (const [field, operatorAndValue] of Object.entries(queries)) {
        const pattern = new RegExp(operators.join("|"));
        const value = operatorAndValue.replace(pattern, "");
        const operator = operatorAndValue.replace(value, "") as Operator;

        query = query.where(field, operator, value);
    }

    if (limit !== Infinity) {
        query.limit(limit);
    }

    const documents = await query.get();

    return documents;
}

export default listDocuments;
export { listDocuments, ListDocumentsParams };
