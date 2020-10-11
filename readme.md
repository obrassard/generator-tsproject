<img src="https://i.imgur.com/fAmJYWo.png" alt="TypeScript Logo" width="100"/>

# generator-tsproject

**A light, yet convenient, [Yeoman generator](https://yeoman.io) for TypeScript + Node.JS projects**

This generator will allows you to customize and scaffold your next TypeScript project in seconds. 

Besides providing the basic files and packages needed for TypeScript + Node.js development, the generator will helps you to install and setup other usefull development tools such as Nodemon, or Jest. 

:sparkles: **NEW**: You can now scaffold and customize a complete Express.JS project using `yo tsproject:express`

No more manual configuration required. 🤯

Psst ! It can also generate development Docker files and workflow files for Github Actions.

<br>

[![See this package on NPM](https://img.shields.io/badge/-See%20this%20package%20on%20npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/generator-tsproject)

## Getting started

```sh
npm install -g yo
npm install -g generator-tsproject
yo tsproject <project-name>

# Or for express projects :
yo tsproject:express <project-name>
```

***

### Generated project's structure (`tsproject`)

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

***

### Generated project's structure (`tsproject:express`)

With the express subgenerator, and all options enabled, this is what a generated project looks like :

```
.
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── nodemon.json
├── node_modules/
│   └── ...
├── package.json
├── readme.md
├── src
│   ├── errors
│   │   └── http.error.ts
│   ├── index.ts
│   ├── middlewares
│   │   └── demo.middleware.ts
│   ├── routes
│   │   ├── api.router.ts
│   │   ├── base.router.ts
│   │   └── main.router.ts
│   ├── server.ts
│   ├── static
│   └── views
│       ├── home.handlebars
│       └── layouts
│           └── main.handlebars
├── tests
│   └── express.test.ts
├── tsconfig.json
└── yarn.lock
```