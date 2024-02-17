import sendResponse from "../utils/response.util";
import { Request, Response } from "express";

type ResponseError = Error & {
    status?: number;
}

export default (err: ResponseError, _req: Request, res: Response, _next: Function) => {
    const statusCode = err.status || 500;
    console.error(err.message, err.stack);
    sendResponse(res, statusCode, err.message);
    return;
};