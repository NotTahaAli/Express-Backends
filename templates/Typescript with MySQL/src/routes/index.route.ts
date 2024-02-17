import express from "express";
import sendResponse from "../utils/response.util";

const indexRoute = express.Router();

indexRoute.get("/", (_req, res) => {
    sendResponse(res, 200);
});

export default indexRoute;