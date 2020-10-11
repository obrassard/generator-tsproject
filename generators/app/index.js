var Generator = require('yeoman-generator');
var packageQueues = require('../packagesQueues');
module.exports = class extends Generator {

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
                runCmd: this.options.runCmd,
                entrypoint: this.options.express ? 'index':'main',
                express: this.options.express
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

        if (!this.options.express) {
            this.fs.copy(
                this.templatePath('main.ts'),
                this.destinationPath(`./${this.options.appname}/src/main.ts`),
            )
        }

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

            if (!this.options.express)
                this.fs.copy(
                    this.templatePath('main.test.ts'),
                    this.destinationPath(`./${this.options.appname}/tests/main.test.ts`),
                )
            else {
                this.fs.copy(
                    this.templatePath('express.test.ts'),
                    this.destinationPath(`./${this.options.appname}/tests/express.test.ts`),
                )
            }

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
        this.log('Installing packages ...')
        packageQueues.addToPackagesQueue('typescript', true);
        packageQueues.addToPackagesQueue('@types/node', true);
        packageQueues.addToPackagesQueue('ts-node', true);
        packageQueues.addToPackagesQueue('rimraf', true);
        packageQueues.addToPackagesQueue('dotenv');

        if (this.answers.nodemon) {
            packageQueues.addToPackagesQueue('nodemon', true);
        }

        if (this.answers.jest) {
            packageQueues.addToPackagesQueue('jest', true);
            packageQueues.addToPackagesQueue('jest-extended', true);
            packageQueues.addToPackagesQueue('ts-jest', true);
            packageQueues.addToPackagesQueue('@types/jest', true);
            packageQueues.addToPackagesQueue('supertest', true);
            packageQueues.addToPackagesQueue('@types/supertest', true);
        }

        this._installPackages();
    }
    
    end() {
        this._intializeGit();
        this.log('All done ! Congrats ✨')
    }

    _intializeGit() {
        this.log('Intializing Git ...')
        this.spawnCommandSync('git', ['init', this.options.appname]);
        this.spawnCommandSync('git', ['add', '*'], { 'cwd': this.options.appname });
        this.spawnCommandSync('git', ['add', '.*'], { 'cwd': this.options.appname });
        this.spawnCommandSync('git', ['commit', '-m', 'Initial commit'], { 'cwd': this.options.appname });
    }

    _installPackages() {

        // Install required dependencies
        if (packageQueues.packagesQueue.length) {
            if (this.answers.packageManager == 'npm' ) {
                this.npmInstall(packageQueues.packagesQueue, { 'save-dev': false }, { 'cwd': this.options.appname });
            } else if (this.answers.packageManager == 'yarn') {
                this.yarnInstall(packageQueues.packagesQueue, { 'dev': false }, { 'cwd': this.options.appname });
            }
        }

        // Install required dev-dependencies
        if (packageQueues.devPackagesQueue.length) {
            if (this.answers.packageManager == 'npm' ) {
                this.npmInstall(packageQueues.devPackagesQueue, { 'save-dev': true }, { 'cwd': this.options.appname });
            } else if (this.answers.packageManager == 'yarn') {
                this.yarnInstall(packageQueues.devPackagesQueue, { 'dev': true }, { 'cwd': this.options.appname });
            }
        }       
    }
};