import * as functions from "firebase-functions";
import api from "./api";

const runtimeOptions = {
    timeoutSeconds: 540,
    memory: "8GB" as "8GB",
};

export const pkiDocumentSigning = functions
    .runWith(runtimeOptions)
    .https.onRequest(api);
