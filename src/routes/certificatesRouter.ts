import { Router } from "../types";
import {
    validateCertificateController,
    saveCertificateController,
    updateCertificateController,
    listCertificatesController,
    decryptCertificateController,
} from "../controllers/certificates";

const certificatesRouter: Router = (api) => {
    api.post("/certificates/validate", validateCertificateController);
    api.post("/certificates/save", saveCertificateController);
    api.post("/certificates/decrypt", decryptCertificateController);
    api.post(
        "/certificates/:certificateUid/update",
        updateCertificateController
    );
    api.get("/certificates/list", listCertificatesController);
};

export default certificatesRouter;
export { certificatesRouter };
