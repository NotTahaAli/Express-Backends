import { Response } from "express";

export default (res: Response, status = 200, response: any = undefined, success = status == 200) => {
    return res.status(status).json({ success: success, message: success ? response : undefined, error: success ? undefined : response });
};