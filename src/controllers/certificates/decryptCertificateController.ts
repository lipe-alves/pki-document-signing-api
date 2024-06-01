import { decryptCertificate } from "../../cases/certificates";
import { MissingParam, NotFound } from "../../errors";
import { convertPDFToBuffer } from "../../utils";
import { CertificatesDatabase } from "../../databases";

import createController from "../createController";
import responseCodes from "../../constants/responseCodes";

const decryptCertificateController = createController<{
    query: {};
    params: {};
    body: {
        certificate: {
            uid?: string;
            url?: string;
            buffer?: Buffer;
        };
        password: string;
    };
    headers: {};
}>(async (req, res) => {
    const { certificate, password } = req.body;

    if (certificate?.uid) {
        const certsDb = new CertificatesDatabase();
        const certInDb = await certsDb.getByUid(certificate.uid);

        if (!certInDb) {
            throw new NotFound(
                "Certificate not found",
                responseCodes.CERTIFICATE_NOT_FOUND
            );
        }

        certificate.buffer = await convertPDFToBuffer(certInDb.url);
    } else if (certificate?.url) {
        certificate.buffer = await convertPDFToBuffer(certificate.url);
    } else if (certificate?.buffer) {
        certificate.buffer = Buffer.from(certificate.buffer);
    } else {
        throw new MissingParam("certificate.buffer");
    }

    if (!password) {
        throw new MissingParam("password");
    }

    const decryptedCert = await decryptCertificate({
        certificate: {
            ...certificate,
            buffer: certificate.buffer as Buffer,
        },
        password,
    });

    res.status(200).send(decryptedCert);
});

export { decryptCertificateController };
export default decryptCertificateController;
