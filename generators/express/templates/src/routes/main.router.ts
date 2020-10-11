import { BaseRouter } from './base.router';
import { Request, Response } from "express";

class MainRouter extends BaseRouter {

    /**
     * GET /
     */
    public getHome(req: Request, res: Response) {
        <% if (handlebars) { %>
        res.render('home');
        <% } else { %>res.send("Hello World")<% }%>
    }

    public init(): void {
        this.router.get('/', this.getHome.bind(this));
    }
}

export const mainRouter = new MainRouter();