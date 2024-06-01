import { Router } from "../types";
import {
    listDocumentsController,
    signDocumentController,
} from "../controllers/signatures";

const signaturesRouter: Router = (api) => {
    api.get("/signatures/list", listDocumentsController);
    api.post("/signatures/sign", signDocumentController);
};

export default signaturesRouter;
export { signaturesRouter };
