import * as admin from "firebase-admin";
import { FIREBASE_CREDENTIALS } from "../constants/credentials";

// Initialize Firebase
const app = admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_CREDENTIALS),
    storageBucket: `${FIREBASE_CREDENTIALS.projectId}.appspot.com`,
});
const firestore = app.firestore();
firestore.settings({
    ignoreUndefinedProperties: true,
    merge: true,
});
const storage = app.storage();
const bucket = storage.bucket();

bucket.setCorsConfiguration([
    {
        origin: ["*"],
        responseHeader: ["Content-Type"],
        method: ["GET", "HEAD", "DELETE"],
        maxAgeSeconds: 3600,
    },
]);

export { app, firestore, storage, bucket };
