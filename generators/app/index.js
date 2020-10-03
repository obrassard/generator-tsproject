var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    // The name `constructor` is important here
    constructor(args, opts) {
        super(args, opts);
        this.argument("appname", { type: String, required: true });
        this.options.appname = this.options.appname.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        this._packagesQueue = [];
        this._devPackagesQueue = [];
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
                type: "list",
                name: "packageManager",
                default: "yarn",
                message: "Which package manager would you like to use ?",
                choices: [
                    'npm', 'yarn'
                ]
            },
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
            },
            {
                type: "confirm",
                name: "ghActions",
                default: true,
                message: "Use GitHub Actions for CI ?"
            }
        ]);

        this.options.runCmd = this.answers.packageManager == 'npm' ? 'npm run': 'yarn';
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('package.json.ejs'),
            this.destinationPath(`./${this.options.appname}/package.json`),
            { 
                appname: this.options.appname,
                nodemon: this.answers.nodemon,
                jest: this.answers.jest,
                pkg : this.answers.packageManager,
                runCmd: this.options.runCmd
            }
        );

        this.fs.copyTpl(
            this.templatePath('readme.md.ejs'),
            this.destinationPath(`./${this.options.appname}/readme.md`),
            { 
                docker: this.answers.docker,
                nodemon: this.answers.nodemon,
                jest: this.answers.jest,
                pkg : this.answers.packageManager,
                runCmd: this.options.runCmd
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
            this.fs.copyTpl(
                this.templatePath('Dockerfile.ejs'),
                this.destinationPath(`./${this.options.appname}/Dockerfile`),
                {
                    pkg : this.answers.packageManager,
                    runCmd: this.options.runCmd
                }
            )

            this.fs.copyTpl(
                this.templatePath('docker-compose.yml.ejs'),
                this.destinationPath(`./${this.options.appname}/docker-compose.yml`),
                {
                    pkg : this.answers.packageManager,
                    runCmd: this.options.runCmd
                }
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

        if (this.answers.ghActions) {
            this.fs.copyTpl(
                this.templatePath('ga-node-ci.yml.ejs'),
                this.destinationPath(`./${this.options.appname}/.github/workflows/node-ci.yml`),
                {
                    pkg : this.answers.packageManager
                }
            )
        }
    }

    install() {
        this._addToPackagesQueue('typescript', true);
        this._addToPackagesQueue('@types/node', true);
        this._addToPackagesQueue('ts-node', true);
        this._addToPackagesQueue('rimraf', true);
        this._addToPackagesQueue('dotenv');

        if (this.answers.nodemon) {
            this._addToPackagesQueue('nodemon', true);
        }

        if (this.answers.express) {
            this._addToPackagesQueue('express');
            this._addToPackagesQueue('@types/expres', true);
        }

        if (this.answers.jest) {
            this._addToPackagesQueue('jest', true);
            this._addToPackagesQueue('jest-extended', true);
            this._addToPackagesQueue('ts-jest', true);
            this._addToPackagesQueue('@types/jest', true);
            this._addToPackagesQueue('supertest', true);
        }

        this._installPackages();
    }
    
    end() {
        this.log('Intializing git')
        this.spawnCommandSync('git', ['init', this.options.appname]);

        this.log('All done ! Congrats ✨')
    }

    _addToPackagesQueue(name, dev = false) {
        if (dev) {
            this._devPackagesQueue.push(name)
        } else {
            this._packagesQueue.push(name)
        }
    }

    _installPackages() {

        // Install required dependencies
        if (this._packagesQueue.length) {
            if (this.answers.packageManager == 'npm' ) {
                this.npmInstall(this._packagesQueue, { 'save-dev': false }, { 'cwd': this.options.appname });
            } else if (this.answers.packageManager == 'yarn') {
                this.yarnInstall(this._packagesQueue, { 'dev': false }, { 'cwd': this.options.appname });
            }
        }

        // Install required dev-dependencies
        if (this._devPackagesQueue.length) {
            if (this.answers.packageManager == 'npm' ) {
                this.npmInstall(this._devPackagesQueue, { 'save-dev': true }, { 'cwd': this.options.appname });
            } else if (this.answers.packageManager == 'yarn') {
                this.yarnInstall(this._devPackagesQueue, { 'dev': true }, { 'cwd': this.options.appname });
            }
        }       
    }
};