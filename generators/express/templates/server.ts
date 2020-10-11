import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { Request, Response } from 'express';

export const app = express();

// Setup middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Hello World"
    });
});