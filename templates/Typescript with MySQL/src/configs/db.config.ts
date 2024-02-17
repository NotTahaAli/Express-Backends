import {config} from "dotenv";
config();

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    console.log("Database Credentials Not Configured, Exiting Program, Please Configure Database Credentials in .env File.");
    process.exit(1);
}

export const host = process.env.DB_HOST || "localhost";
export const port = parseInt(process.env.DB_PORT || "3306");
export const user = process.env.DB_USER;
export const password = process.env.DB_PASSWORD;
export const database = process.env.DB_NAME;