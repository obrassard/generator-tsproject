import { Router, Request, Response } from "express";

export abstract class BaseRouter {
    public router: Router;

    /* Initialize the Router */
    constructor() {
        this.router = Router();
        this.init();
    }

    public abstract init(): void;
}