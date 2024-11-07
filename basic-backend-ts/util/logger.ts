import {Request, Response, NextFunction} from "express";

export function logRequest(req: Request, _res: Response, next: NextFunction): void {
    console.log(`${req.method} Request on ${req.url}`);
    next();
}
