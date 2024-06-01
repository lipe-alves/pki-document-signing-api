import { updateCertificate, SafeKeysToUpdate } from "../../cases/certificates";
import { MissingParam } from "../../errors";
import createController from "../createController";

const updateCertificateController = createController<{
    query: {};
    params: {
        certificateUid: string;
    };
    body: {
        updates: SafeKeysToUpdate;
    };
    headers: {};
}>(async (req, res) => {
    const { certificateUid } = req.params;
    const { updates = {} } = req.body;

    if (!certificateUid) {
        throw new MissingParam("certificateUid");
    }

    if (Object.keys(updates).length === 0) {
        throw new MissingParam("updates");
    }

    const updatedCertificate = await updateCertificate(certificateUid, updates);

    res.status(200).send({ ...updatedCertificate });
});

export { updateCertificateController };
export default updateCertificateController;
