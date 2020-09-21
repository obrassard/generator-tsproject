var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        super(args, opts);
        this.argument("appname", { type: String, required: true });
        this.options.appname = this.options.appname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "confirm",
                name: "nodemon",
                default: true,
                message: "Add nodemon ?"
            },
            // {
            //     type: "confirm",
            //     name: "express",
            //     default: false,
            //     message: "Add express.js ?"
            // },
            {
                type: "confirm",
                name: "jest",
                default: false,
                message: "Install Jest for testing ?"
            },
            {
                type: "confirm",
                name: "docker",
                default: true,
                message: "Add Docker config ?"
            }
        ]);
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('package.json.ejs'),
            this.destinationPath(`./${this.options.appname}/package.json`),
            { 
                appname: this.options.appname,
                nodemon: this.answers.nodemon,
                jest: this.answers.jest,
            }
        );

        this.fs.copyTpl(
            this.templatePath('readme.md.ejs'),
            this.destinationPath(`./${this.options.appname}/readme.md`),
            { 
                docker: this.answers.docker,
                nodemon: this.answers.nodemon,
                jest: this.answers.jest,
            }
        );

        this.fs.copy(
            this.templatePath('main.ts'),
            this.destinationPath(`./${this.options.appname}/src/main.ts`),
        )

        this.fs.copy(
            this.templatePath('tsconfig.json'),
            this.destinationPath(`./${this.options.appname}/tsconfig.json`),
        )

        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath(`./${this.options.appname}/.gitignore`),
        )

        if (this.answers.docker) {
            this.fs.copy(
                this.templatePath('Dockerfile'),
                this.destinationPath(`./${this.options.appname}/Dockerfile`),
            )

            this.fs.copy(
                this.templatePath('docker-compose.yml'),
                this.destinationPath(`./${this.options.appname}/docker-compose.yml`),
            )
        }

        if (this.answers.jest) {
            this.fs.copy(
                this.templatePath('main.test.ts'),
                this.destinationPath(`./${this.options.appname}/tests/main.test.ts`),
            )

            this.fs.copy(
                this.templatePath('jest.config.js'),
                this.destinationPath(`./${this.options.appname}/jest.config.js`),
            )
        }

        if (this.answers.nodemon) {
            this.fs.copy(
                this.templatePath('nodemon.json'),
                this.destinationPath(`./${this.options.appname}/nodemon.json`),
            )
        }
    }

    install() {
        this.npmInstall(['typescript'], { 'save-dev': true }, { 'cwd': this.options.appname });
        this.npmInstall(['@types/node'], { 'save-dev': true }, { 'cwd': this.options.appname });
        this.npmInstall(['ts-node'], { 'save-dev': true }, { 'cwd': this.options.appname });
        this.npmInstall(['rimraf'], { 'save-dev': true }, { 'cwd': this.options.appname });
        this.npmInstall(['dotenv'], null, {'cwd': this.options.appname});

        if (this.answers.nodemon) {
            this.npmInstall(['nodemon'], { 'save-dev': true }, { 'cwd': this.options.appname });
        }

        if (this.answers.express) {
            this.npmInstall(['express', null, {'cwd': this.options.appname}]);
            this.npmInstall(['@types/expres'], { 'save-dev': true }, { 'cwd': this.options.appname });
        }

        if (this.answers.jest) {
            this.npmInstall(['jest'], { 'save-dev': true }, { 'cwd': this.options.appname });
            this.npmInstall(['jest-extended'], { 'save-dev': true }, { 'cwd': this.options.appname });
            this.npmInstall(['ts-jest'], { 'save-dev': true }, { 'cwd': this.options.appname });
            this.npmInstall(['@types/jest'], { 'save-dev': true }, { 'cwd': this.options.appname });
            // this.npmInstall(['supertest'], { 'save-dev': true }, { 'cwd': this.options.appname });
        }
    }
    

    end() {
        this.log('Intializing git')
        this.spawnCommandSync('git', ['init', this.options.appname]);

        this.log('All done ! Congrats ✨')
    }
};