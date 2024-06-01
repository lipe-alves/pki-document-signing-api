import env from "../env.json";
import * as os from "os";

export const __tmpdir = os.tmpdir();
export const SYSTEM_PASSWORD = env.SYSTEM_PASSWORD;
