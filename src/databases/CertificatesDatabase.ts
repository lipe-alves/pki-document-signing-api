import { Database } from "../services";
import { Certificate } from "../models";

class CertificatesDatabase extends Database<Certificate> {
    constructor() {
        super("certificates");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new Certificate(data));
    }

    public override watch(listener: (certificates: Certificate[]) => void) {
        return super.watch((list) => {
            const certificates = list.map((data) => new Certificate(data));
            listener(certificates);
        });
    }
}

export default CertificatesDatabase;
export { CertificatesDatabase };
