import { createCertificateToken } from "../../cases/tokens";
import { CertificatesDatabase } from "../../databases";
import { MissingParam, NotFound } from "../../errors";
import { convertPDFToBuffer } from "../../utils";
import responseCodes from "../../constants/responseCodes";
import createController from "../createController";

const createCertificateTokenController = createController<{
    query: {};
    params: {};
    body: {
        certificate?: {
            uid?: string;
            name: string;
            size: number;
            type: string;
            metadata?: {
                [key: string]: any;
            };
            url?: string;
            buffer?: Buffer;
        };
        password?: string;
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

        certificate.name = certInDb.name;
        certificate.size = certInDb.size;
        certificate.type = certInDb.type;
        certificate.metadata = certInDb.metadata;
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

    const token = await createCertificateToken({
        certificate: {
            ...certificate,
            buffer: certificate.buffer as Buffer,
        },
        password,
    });

    res.status(200).send(token);
});

export { createCertificateTokenController };
export default createCertificateTokenController;
