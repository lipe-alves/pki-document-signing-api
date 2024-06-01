import { generateUid, toDate } from "../utils";
import { IDDocumentType } from "../types";
import { DecryptedCertificate } from "../services/Signer";
import BaseModel from "./BaseModel";

class Certificate extends BaseModel implements DecryptedCertificate {
    public uid: string;
    public name: string;
    public email: string;
    public serialNumber: string;
    public signatureOid: string;
    public validity: {
        notBefore: Date;
        notAfter: Date;
    };
    public issuer: {
        countryName: string;
        organizationName: string;
        organizationalUnitName: string;
        commonName: string;
        hash: string;
    } & { [unknownAttribute: string]: string };
    public subject: {
        countryName: string;
        organizationName: string;
        organizationalUnitName: string;
        commonName: string;
        hash: string;
    } & { [unknownAttribute: string]: string };
    public document: {
        number: string;
        type: IDDocumentType;
    };
    public filename: string;
    public url: string;
    public path: string;
    public size: number;
    public type: string;
    public metadata: {
        [key: string]: any;
    };
    public decrypted: boolean;
    public decryptedAt?: Date;

    constructor(data: Partial<Certificate>) {
        const {
            uid = generateUid("crt-"),
            name = "",
            email = "",
            serialNumber = "",
            signatureOid = "",
            validity = {
                notBefore: new Date(),
                notAfter: new Date(),
            },
            issuer = {
                countryName: "",
                organizationName: "",
                organizationalUnitName: "",
                commonName: "",
                hash: "",
            },
            subject = {
                countryName: "",
                organizationName: "",
                organizationalUnitName: "",
                commonName: "",
                hash: "",
            },
            document = {
                number: "",
                type: "cpf",
            },
            filename = "",
            url = "",
            path = "",
            size = 0,
            type = "",
            metadata = {},
            decrypted = false,
            decryptedAt,
        } = data;

        super(data);

        this.uid = uid;
        this.name = name;
        this.email = email;
        this.serialNumber = serialNumber;
        this.signatureOid = signatureOid;
        this.validity = {
            notBefore: toDate(validity.notBefore),
            notAfter: toDate(validity.notAfter),
        };
        this.issuer = issuer;
        this.subject = subject;
        this.document = document;
        this.filename = filename;
        this.url = url;
        this.path = path;
        this.size = size;
        this.type = type;
        this.metadata = metadata;
        this.decrypted = !!decrypted;
        if (decryptedAt) this.decryptedAt = toDate(decryptedAt);
    }
}

export default Certificate;
export { Certificate };
