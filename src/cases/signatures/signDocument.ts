import responseCodes from "../../constants/responseCodes";
import { ClientError } from "../../errors";
import { SignedDocument } from "../../models";
import { SignedDocumentsDatabase } from "../../databases";
import { Signer, Storage, PlaceholderParams } from "../../services";
//import fs from "fs";

interface DocumentSignatureParams extends PlaceholderParams {
    document: {
        name: string;
        size: number;
        type: string;
        buffer: Buffer;
        url?: string;
        metadata?: {
            [key: string]: any;
        };
    };
    certificate: {
        uid?: string;
        name: string;
        size: number;
        type: string;
        buffer: Buffer;
        url?: string;
        metadata?: {
            [key: string]: any;
        };
    };
    password: string;
    signingTime?: Date;
}

interface DocumentSignatureReturn {
    data: SignedDocument;
    buffer: Buffer;
}

async function signDocument(
    params: DocumentSignatureParams
): Promise<DocumentSignatureReturn> {
    const {
        document,
        certificate,
        password,
        signingTime,
        ...placeholderParams
    } = params;

    const passwordIsValid = Signer.checkCertificatePassword(
        certificate.buffer,
        password
    );

    if (!passwordIsValid) {
        throw new ClientError(
            "Invalid password",
            responseCodes.WRONG_CERT_PASSWORD
        );
    }

    const documentWithPlaceholder = await Signer.plainAddPlaceholder(
        document.buffer,
        placeholderParams
    );

    const signedDocumentBuffer = await Signer.signDocument(
        documentWithPlaceholder,
        certificate.buffer,
        { password, signingTime }
    );

    if (!certificate.uid) {
        certificate.uid = "default-certificate";
    }

    const docsDb = new SignedDocumentsDatabase();

    const signedDocumentDb = new SignedDocument({
        filename: document.name,
        size: document.size,
        type: document.type,
        certificate: certificate.uid,
        metadata: document.metadata || {},
        signedAt: signingTime,
        signatureParams: {
            document: {
                name: document.name,
                size: document.size,
                type: document.type,
                url: document.url || "",
                metadata: document.metadata || {},
            },
            certificate: {
                uid: certificate.uid,
                name: certificate.name,
                size: certificate.size,
                type: certificate.type,
                url: certificate.url || "",
                metadata: certificate.metadata || {},
            },
            password,
            signingTime,
            placeholderParams,
        },
    });

    const path = `signed-documents/${certificate.uid}/${signedDocumentDb.uid}/${document.name}`;
    await Storage.uploadFile(path, signedDocumentBuffer);
    const url = await Storage.getDownloadUrl(path);

    signedDocumentDb.url = url;
    signedDocumentDb.path = path;

    await docsDb.uid(signedDocumentDb.uid).create(signedDocumentDb);

    return {
        data: signedDocumentDb,
        buffer: signedDocumentBuffer,
    };
}

export default signDocument;
export { signDocument, DocumentSignatureParams, DocumentSignatureReturn };
