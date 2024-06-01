import { Router } from "../types";
import {
    getCertificateTokenController,
    createCertificateTokenController,
} from "../controllers/tokens";

const tokensRouter: Router = (api) => {
    api.get("/tokens/:tokenContent", getCertificateTokenController);
    api.post("/tokens/save", createCertificateTokenController);
};

export default tokensRouter;
export { tokensRouter };
