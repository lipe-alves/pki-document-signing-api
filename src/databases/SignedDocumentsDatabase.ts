import { Database } from "../services";
import { SignedDocument } from "../models";

class SignedDocumentsDatabase extends Database<SignedDocument> {
    constructor() {
        super("signedDocuments");
    }

    public override async get() {
        const results = await super.get();
        return results.map((data) => new SignedDocument(data));
    }

    public override watch(
        listener: (signedDocuments: SignedDocument[]) => void
    ) {
        return super.watch((list) => {
            const signedDocuments = list.map(
                (data) => new SignedDocument(data)
            );
            listener(signedDocuments);
        });
    }
}

export default SignedDocumentsDatabase;
export { SignedDocumentsDatabase };
