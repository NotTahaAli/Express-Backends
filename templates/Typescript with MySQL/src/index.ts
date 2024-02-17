import cors from 'cors';
import express, { Request, Response } from "express";
import https from "https";
import http from "http";
import fs from "fs";
import indexRoute from "./routes/index.route";
import { corsURLS, httpPort, httpsPort } from "./configs/server.config";
import errorMiddleware from './middleware/error.middleware';
import notfoundMiddleware from './middleware/notfound.middleware';
import { createTable as createItemsTable } from './services/items.db.service';
const app = express();

// Setting up for JSON Data
app.use(express.json({ limit: "50mb" }));

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

    await createItemsTable();

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