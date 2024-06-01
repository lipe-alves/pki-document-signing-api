import { DecryptedCertificate } from "../services";
import { generateUid } from "../utils";
import BaseModel from "./BaseModel";
import Certificate from "./Certificate";

class Token extends BaseModel {
    public uid: string;
    public certificate: DecryptedCertificate;
    public content: string;
    public password: string;
    public url: string;

    constructor(data: Partial<Token>) {
        const {
            uid = generateUid("tkn-"),
            certificate = new Certificate({}),
            content = "",
            password = "",
            url = "",
        } = data;
        super(data);

        this.uid = uid;
        this.certificate = certificate;
        this.content = content;
        this.password = password;
        this.url = url;
    }
}

export default Token;
export { Token };
