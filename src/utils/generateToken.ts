import crypto from "crypto";

function generateToken(size: number) {
    return crypto.randomBytes(size).toString("hex");
}

export { generateToken };
export default generateToken;
