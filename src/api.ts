import { signaturesRouter, certificatesRouter, tokensRouter } from "./routes";
import { logRequestsMiddleware } from "./middlewares";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const api = express();

const corsOptions = {
    origin: [/^http:\/\/localhost/, /^https:\/\//],
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": true,
    "Access-Control-Expose-Headers": true,
};

const jsonOptions = {
    limit: "100mb",
    type: "application/json",
};

const urlencodedOptions = {
    limit: "100mb",
    extended: true,
    type: "multipart/form-data",
};

api.use(cors(corsOptions));
api.use(express.json(jsonOptions));
api.use(bodyParser.json(jsonOptions));
api.use(express.urlencoded(urlencodedOptions));
api.use(logRequestsMiddleware);

api.get("/ping", (req, res) => res.status(200).send("Ping!"));
signaturesRouter(api);
certificatesRouter(api);
tokensRouter(api);

export default api;
