import axios from "axios";

async function convertPDFToBuffer(url: string) {
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
        });

        const buffer = Buffer.from(response.data, "binary");
        return buffer;
    } catch (error) {
        console.log("Error while converting PDF url to buffer");
        console.log("URL:", url);
        console.error("Error:", error);
        throw error;
    }
}

export { convertPDFToBuffer };
