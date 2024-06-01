import { getCertificateToken } from "../../cases/tokens";
import createController from "../createController";

const getCertificateTokenController = createController<{
    query: {};
    params: {
        tokenContent?: string;
    };
    body: {};
    headers: {
        "system-password"?: string;
    };
}>(async (req, res) => {
    const { tokenContent = "" } = req.params;
    const systemPassword = req.headers["system-password"];

    const tokenData = await getCertificateToken({
        token: tokenContent,
        systemPassword,
    });

    res.status(200).send(tokenData);
});

export { getCertificateTokenController };
export default getCertificateTokenController;
