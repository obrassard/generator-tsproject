import { BaseRouter } from './base.router';
import { Request, Response } from "express";

class ApiRouter extends BaseRouter {

    /**
     * GET /api/v1/hello
     */
    public getHello(req: any, res: Response) {
        res.json({
            message: 'Hello World'
        })
    }

    public init(): void {
        this.router.get('/hello', this.getHello.bind(this));
    }
}

export const apiRouter = new ApiRouter();