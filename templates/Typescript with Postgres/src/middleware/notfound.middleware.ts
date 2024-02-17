import sendResponse from "../utils/response.util";
import { Request, Response } from "express";

export default (_req: Request, res: Response) => {
    sendResponse(res, 404, "NOT_FOUND_API");
    return;
};