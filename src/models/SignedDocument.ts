import { PlaceholderParams } from "../services";
import { generateUid, toDate } from "../utils";
import BaseModel from "./BaseModel";

class SignedDocument extends BaseModel {
    public uid: string;
    public certificate: string | "default-certificate";
    public filename: string;
    public url: string;
    public path: string;
    public size: number;
    public type: string;
    public signedAt: Date;
    public metadata: {
        [key: string]: any;
    };
    public signatureParams?: {
        document: {
            name: string;
            size: number;
            type: string;
            url?: string;
            metadata: {
                [key: string]: any;
            };
        };
        certificate: {
            uid?: string;
            name: string;
            size: number;
            type: string;
            url?: string;
            metadata: {
                [key: string]: any;
            };
        };
        password: string;
        signingTime?: Date;
        placeholderParams: PlaceholderParams;
    };

    constructor(data: Partial<SignedDocument>) {
        const {
            uid = generateUid("doc-"),
            certificate = "default-certificate",
            filename = "",
            url = "",
            path = "",
            size = 0,
            type = "",
            signedAt = new Date(),
            metadata = {},
            signatureParams,
        } = data;

        super(data);

        this.uid = uid;
        this.certificate = certificate;
        this.filename = filename;
        this.url = url;
        this.path = path;
        this.size = size;
        this.type = type;
        this.signedAt = toDate(signedAt);
        this.metadata = metadata;
        if (signatureParams) this.signatureParams = signatureParams;
    }
}

export default SignedDocument;
export { SignedDocument };
