import { NextFunction, Request, Response } from 'express';

export function demoMiddleware(req: any, res: Response, next: NextFunction): void {
    req.requestTime = Date.now()
    console.log(req.requestTime)
    next();
}