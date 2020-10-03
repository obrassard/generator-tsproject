<img src="https://i.imgur.com/fAmJYWo.png" alt="TypeScript Logo" width="100"/>

# generator-tsproj

**This project is a light [Yeoman generator](https://yeoman.io) for TypeScript projets scaffolding**

This generator will allows you to customize and scaffold your next TypeScript project in seconds. 

Besides providing the basic files and packages needed for TypeScript + Node.js development, the generator will helps you to install and setup other usefull development tools such as Nodemon, or Jest. 

No more manual configuration required. 🤯

Psst ! It can also generate development Docker files and workflow files for Github Actions.

<br>

[![See this package on NPM](https://img.shields.io/badge/-See%20this%20package%20on%20npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/generator-tsproj)

## Getting started

```
npm install -g yo
npm install -g generator-tsproj
yo tsproj <project-name>
```

***

### Generated project's structure

When all options are enabled, this is what a generated project looks like :

```
.
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── node_modules/
│   └── ...
├── nodemon.json
├── package.json
├── readme.md
├── src
│   └── main.ts
├── tests
│   └── main.test.ts
├── tsconfig.json
└── yarn.lock
```
