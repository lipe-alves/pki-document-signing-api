import env from "../env.json";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const FIREBASE_CREDENTIALS = {
    type: "service_account",
    projectId: env.PROJECT_ID,
    privateKeyId: env.PRIVATE_KEY_ID,
    privateKey: env.PRIVATE_KEY,
    clientEmail: env.CLIENT_EMAIL,
    clientId: env.CLIENT_ID,
    authUri: env.AUTH_URI,
    tokenUri: env.TOKEN_URI,
    authProviderX509CertUrl: env.AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: env.CLIENT_X509_CERT_URL,
    universeDomain: env.UNIVERSE_DOMAIN,
};
