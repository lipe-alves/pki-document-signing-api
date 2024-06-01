import { CertificatesDatabase } from "../../databases";
import { Operator } from "../../types";
import { operators } from "../../constants/queries";

type Value = string;

interface ListCertificatesParams {
    queries: {
        [field: string]: `${Operator}${Value}`;
    };
    limit: number;
}

async function listCertificates(params: ListCertificatesParams) {
    const { limit, queries } = params;

    let query = new CertificatesDatabase();

    for (const [field, operatorAndValue] of Object.entries(queries)) {
        const pattern = new RegExp(operators.join("|"));
        const value = operatorAndValue.replace(pattern, "");
        const operator = operatorAndValue.replace(value, "") as Operator;

        query = query.where(field, operator, value);
    }

    if (limit !== Infinity) {
        query.limit(limit);
    }

    const certificates = await query.get();

    return certificates;
}

export default listCertificates;
export { listCertificates, ListCertificatesParams };
