import { config } from "dotenv";
config();

if (!process.env.POSTGRES_URL) {
    console.log("Database Credentials Not Configured, Exiting Program, Please Configure Database Credentials in .env File.");
    process.exit(1);
}

export const postgresURL = process.env.POSTGRES_URL

export default {
    postgresURL
}