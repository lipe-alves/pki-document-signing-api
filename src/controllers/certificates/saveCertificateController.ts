import { saveCertificate } from "../../cases/certificates";
import { MissingParam } from "../../errors";
import { convertPDFToBuffer } from "../../utils";
import createController from "../createController";

const saveCertificateController = createController<{
    query: {};
    params: {};
    body: {
        certificate: {
            uid?: string;
            name: string;
            size: number;
            type: string;
            url?: string;
            buffer?: Buffer;
            metadata?: {
                [key: string]: any;
            };
        };
        password?: string;
    };
    headers: {};
}>(async (req, res) => {
    const { certificate, password } = req.body;

    if (!certificate?.name) {
        throw new MissingParam("certificate.name");
    }

    if (!certificate?.size) {
        throw new MissingParam("certificate.size");
    }

    if (!certificate?.type) {
        throw new MissingParam("certificate.type");
    }

    if (certificate?.url) {
        certificate.buffer = await convertPDFToBuffer(certificate.url);
    } else if (certificate?.buffer) {
        certificate.buffer = Buffer.from(certificate.buffer);
    } else {
        throw new MissingParam("certificate.buffer");
    }

    const savedCertificate = await saveCertificate({
        certificate: {
            ...certificate,
            buffer: certificate.buffer as Buffer,
        },
        password,
    });

    res.status(200).send({ ...savedCertificate });
});

export { saveCertificateController };
export default saveCertificateController;
