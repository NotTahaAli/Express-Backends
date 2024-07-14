import fs from "fs";
import cors from 'cors';
import express from "express";
import https from "https";
import http from "http";
import helmet from 'helmet';
import indexRoute from "./routes/index.route";
import { corsURLS, httpPort, httpsPort } from "./configs/server.config";
import errorMiddleware from './middleware/error.middleware';
import notfoundMiddleware from './middleware/notfound.middleware';
import { migrateDB } from './db/db.service';

// deepcode ignore UseCsurfForExpress: Program does not use cookies or sessions
const app = express();

// Setting up for JSON Data
app.use(express.json({ limit: "50mb" }));
app.use(helmet());

// Setting up for URL Encoded Payloads
app.use(
    express.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);

app.use(cors({
    origin: corsURLS,
    credentials: true
}))

// Express Routes Start Here

app.use('/', indexRoute);

// Express Routes End Here

//Page Not Found
app.use(notfoundMiddleware);

//Error Handler
app.use(errorMiddleware);

(async () => {
    await migrateDB();

    // deepcode ignore HttpToHttps: Program has option for Https as
    http.createServer(app).listen(httpPort, () => {
        console.log(`Http Server is running on port ${httpPort}`);
    });
    if (httpsPort) {
        if (!fs.existsSync('./keys/key.pem') || !fs.existsSync('./keys/cert.pem') || !fs.existsSync('./keys/ca.pem')) {
            console.log("Https Keys are not present. Https Server will not run.");
        } else {
            var options = {
                key: fs.readFileSync('./keys/key.pem'),
                cert: fs.readFileSync('./keys/cert.pem'),
                ca: fs.readFileSync('./keys/ca.pem')
            };
            try {
                https.createServer(options, app).listen(httpsPort, () => {
                    console.log(`Https Server is running on port ${httpsPort}`);
                });
            } catch (err) {
                console.log("Https Server will not run.");
                console.log((err instanceof Error) ? err.stack : "Error: " + err);
            }
        }
    }
})();