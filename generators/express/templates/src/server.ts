import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
<% if (jwt) { %>import jwt from 'express-jwt';<% } %>
<% if (handlebars) { %>import exphbs  from 'express-handlebars';<% } %>
import { mainRouter } from './routes/main.router';
import { apiRouter } from './routes/api.router';
import { demoMiddleware } from './middlewares/demo.middleware';

// Creates and configures an ExpressJS web server.
class Server {

    // ref to Express instance
    private app;

    constructor() {
        this.app = express();
        this.setup();
        this.middlewares();
        this.routes();
    }

    private setup() {
        <% if (handlebars) { %>
        this.app.engine('handlebars', exphbs());
        this.app.set('view engine', 'handlebars');
        this.app.set('views', (__dirname + '/views'));<% }%>
        <% if (static) { %>
        this.app.use('/static', express.static(__dirname + '/static'));<% }%>
    }

    // Configure Express middlewares
    private middlewares(): void {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        <% if (jwt) { %>
        //JWT Middleware see https://github.com/auth0/express-jwt
        //By default, the decoded token is attached to req.user
        this.app.use('/api/*', jwt({ secret: 'shhhhhhared-secret', algorithms: ['HS256']}));<% }%>

        // Custom middleware demo
        this.app.use(demoMiddleware);
    }

    // Configure API endpoints.
    private routes(): void {
        this.app.use('/', mainRouter.router);
        this.app.use('/api/', apiRouter.router);
    }

    public start(): void {
        const port = (process.env.PORT || 3000);
        this.app.listen(port, () => {
            console.log(`Listening on http://localhost:${port}`)
        })
    }

    public getApp(): Express.Application {
        return this.app;
    }
}

const server = new Server()
export default server;
export const app = server.getApp();
