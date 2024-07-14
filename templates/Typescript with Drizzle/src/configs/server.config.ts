import { config } from "dotenv";
config();

export const httpPort = parseInt(process.env.PORT || "3000");
export const httpsPort = (process.env.HTTPS_PORT != undefined) ? parseInt(process.env.HTTPS_PORT) : undefined;

export const corsURLS = (process.env.CORS_URLS) ? process.env.CORS_URLS.split(" ") : [];
corsURLS.push("http://localhost:" + httpPort);
if (httpsPort) corsURLS.push("https://localhost:" + httpsPort);

export default {
    httpPort,
    httpsPort,
    corsURLS
}