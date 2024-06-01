import { Middleware } from "../types";

// Middleware for console.logging requests
const logRequestsMiddleware: Middleware = (req, _, next) => {
    const { originalUrl } = req;
    const { origin } = req.headers;

    console.log("Request Origin -", origin);
    console.log("URL -", originalUrl);
    console.log("Date -", new Date());
    console.log("");
    console.log("QUERY:", JSON.stringify(req.query || {}, null, 2));
    console.log("BODY:", JSON.stringify(req.body || {}, null, 2));
    console.log("PARAMS:", JSON.stringify(req.params || {}, null, 2));
    console.log("HEADERS:", JSON.stringify(req.headers || {}, null, 2));

    next();
};

export { logRequestsMiddleware };
export default logRequestsMiddleware;
