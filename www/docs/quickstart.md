---
sidebar_label: 'Quickstart'
---

# Quickstart

## Automatic Setup

We recommend creating a new Bridge app using `create-bridge-app`, which sets up everything automatically for you. (You don't need to create an empty directory, `create-bridge-app` will make one for you.) To create a project, run:

```bash title='terminal'
npx create-bridge-app@latest
# or
pnpm create bridge-app
# or
yarn create bridge-app
```

After the installation is complete:

- Run `cd ./your_project_name`
- Run `npm i` or `pnpm i` or `yarn install`
- Run `npm run dev` or `pnpm dev` or `yarn dev` to start the development server on `http://localhost:8080`
- Edit `index.ts` to start developing your server

For more information on how to use create-bridge-app, you can review the create-bridge-app [documentation](https://www.npmjs.com/package/create-bridge-app).

## Manual Setup

### Installations

Install `bridge` and `zod` in your project:

```bash title='terminal'
npm install bridge zod
# or
yarn add bridge zod
# or
pnpm add bridge zod
```

### Create an index.ts file

**Complete Bridge App with HTTP**

```ts twoslash title='server.ts' showLineNumbers
import { handler, initBridge } from 'bridge';

// A handler can set an endpoint and validate user data such as the body, files,
// request parameters or headers sent.
const helloEndpoint = handler({
  resolve: () => 'Hello World',
});

// To define the routes for our project, we can create a routes object and place
// our handlers inside. The keys of the object correspond to the path.
const routes = {
  hello: helloEndpoint,
};

const port = 8080;

const bridge = initBridge({ routes });
const httpServer = bridge.HTTPServer();

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

**Complete Bridge App with Express**

```ts twoslash title='server.ts' showLineNumbers
import { handler, initBridge } from 'bridge';
import express from 'express';

const routes = {
  hello: handler({
    resolve: () => 'Hello World',
  }),
};

const port = 8080;
const app = express();
const bridge = initBridge({ routes });

app.use('', bridge.expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```


You can test your endpoint by making an http call to `POST http://localhost:8080/hello`. Refer to the [route documentation](bridge/routes.md) for instructions on customizing the HTTP method.

Congratulations, you just launched your first Bridge server! 🥳

:::tip
To get the most out of Bridge in your project, we recommend taking some time to read the documentation on [handlers](bridge/handler) and check out our [example](examples/example) for inspiration and guidance.
:::

## Client code generation and OpenAPI Specification

```bash title='terminal'
npx bridge-compile@latest
# or
pnpx bridge-compile@latest
```

This command line generates 3 things:
- JSONType.json file
- openapi.json file
- sdk folder

The JSONType file contains all the types of your project compiled by Bridge. This file was the input to create the openapi specification and to generate the typescript sdk folder. You can develop your own compiler using this file as an input to generate sdk in other languages.

### Browse OpenAPI documentation

Start by installing **swagger-ui-express**

```bash title='terminal'
npm i swagger-ui-express
# or
pnpm i swagger-ui-express
```

Use it with Express:

```ts title='server.ts' showLineNumbers
import { handler, initBridge } from 'bridge';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const openApiDocumentation = require('./openapi.json');

const routes = {
  hello: handler({
    resolve: () => 'Hello World',
  }),
};

const port = 8080;
const app = express();
const bridge = initBridge({ routes });

app.use('', bridge.expressMiddleware());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

Your documentation is now available on http://localhost:8080/docs.

### Fetch the typescript SDK anywhere

You can simply download the typescript client code with the following command line:

```bash title='terminal'
npx fetch-bridge-sdk $serverUrl
```

You need to replace **serverUrl** with your serverUrl. For example "http://localhost:8080". 

If you do not have axios and form-data installed in your project, the command line will automatically install them for you.

The upcoming version of the command line will allow you to select your preferred HTTP client library, either axios or fetch, and the required packages will be automatically installed if they are not already present in your project.