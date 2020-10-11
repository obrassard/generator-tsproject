var Generator = require('yeoman-generator');
var packageQueues = require('../packagesQueues');

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this.argument("appname", { type: String, required: true });
        this.options.appname = this.options.appname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    initializing() {
        this.composeWith('tsproject', {express: true, arguments: [this.options.appname]});
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "list",
                name: "type",
                default: true,
                message: "What type of setup do you prefer ?\nBASIC: express server config only.\nCOMPLETE: custom errors, views, middlewares, extended routes.",
                choices: [
                    'basic', 'complete'
                ]
            },
            {
                type: "confirm",
                name: "jwt",
                default: false,
                message: "Setup JWT middleware ?",
                when: (answers) => answers.type === 'complete'
            },
            {
                type: "confirm",
                name: "handlebars",
                default: false,
                message: "Add support for handlebars templates ?",
                when: (answers) => answers.type === 'complete'
            },
            {
                type: "confirm",
                name: "static",
                default: false,
                message: "Create a static file folder ?",
                when: (answers) => answers.type === 'complete'
            }
        ])
    }

    queuePackages() {
        packageQueues.addToPackagesQueue('express')
        packageQueues.addToPackagesQueue('body-parser')
        packageQueues.addToPackagesQueue('morgan')
        packageQueues.addToPackagesQueue('@types/body-parser', true)
        packageQueues.addToPackagesQueue('@types/morgan', true)
        packageQueues.addToPackagesQueue('@types/express', true)
        packageQueues.addToPackagesQueue('copyfiles', true)

        if (this.answers.jwt) {
            packageQueues.addToPackagesQueue('express-jwt')
            packageQueues.addToPackagesQueue('@types/express-jwt',true)
        }

        if (this.answers.handlebars) {
            packageQueues.addToPackagesQueue('express-handlebars')
            packageQueues.addToPackagesQueue('@types/express-handlebars',true)
        }
    }

    writing() {
        if (this.answers.type == "complete") {
            this.fs.copyTpl(
                this.templatePath('src/**/*'),
                this.destinationPath(`./${this.options.appname}/src`),
                {
                    jwt: this.answers.jwt,
                    handlebars: this.answers.handlebars,
                    static: this.answers.static
                }
            );
        } else {
            this.fs.copy(
                this.templatePath('server.ts'),
                this.destinationPath(`./${this.options.appname}/src/server.ts`),
            );
            this.fs.copy(
                this.templatePath('index.ts'),
                this.destinationPath(`./${this.options.appname}/src/index.ts`),
            );
        }

        if (this.answers.handlebars) {
            this.fs.copy(
                this.templatePath('views/**/*'),
                this.destinationPath(`./${this.options.appname}/src/views`),
            );
        }

        if (this.answers.static) {
            this.fs.copy(
                this.templatePath('static/.gitkeep'),
                this.destinationPath(`./${this.options.appname}/src/static/.gitkeep`),
            );
        }
    }
};