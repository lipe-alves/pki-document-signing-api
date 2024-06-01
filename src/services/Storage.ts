import { bucket } from "./firebase";
import { MAX_TIMESTAMP } from "../constants/time";

class Storage {
    public static async uploadFile(path: string, data: Buffer): Promise<void> {
        const ref = bucket.file(path);
        await ref.save(data, {
            public: true,
        });
    }

    public static async getDownloadUrl(path: string): Promise<string> {
        const ref = bucket.file(path);
        const [url] = await ref.getSignedUrl({
            action: "read",
            version: "v2",
            expires: MAX_TIMESTAMP,
        });
        return url;
    }

    public static async downloadFile(path: string): Promise<Buffer> {
        const ref = bucket.file(path);
        const [buffer] = await ref.download();
        return buffer;
    }

    public static async deleteFile(path: string): Promise<void> {
        const ref = bucket.file(path);
        await ref.delete();
    }
}

export { Storage };
export default Storage;
