import { Response } from "express";

export function sendResponse (res: Response, status = 200, response: any = undefined, success = status == 200) {
    return res.status(status).json({ success: success, message: success ? response : undefined, error: success ? undefined : response });
};

export function sendErrorResponse(res: Response, error: { code: number, message: string } | Error | any) {
    if (error && typeof (error) == "object" && "message" in error) {
        if ("code" in error) {
            if (typeof (error.code) == "number") {
                return sendResponse(res, error.code, error.message);
            }
        }
        return sendResponse(res, 500, error.message);
    }
    return sendResponse(res, 500, "INTERNAL_SERVER_ERROR");
}

export default sendResponse;