---
sidebar_label: 'Quickstart'
---

# Quickstart

## Autimatic Setup

We recommend creating a new Bridge app using `create-bridge-app`, which sets up everything automatically for you. (You don't need to create an empty directory, `create-bridge-app` will make one for you.) To create a project, run:

```bash
npx create-bridge-app@latest
# or
yarn create bridge-app
# or
pnpm create bridge-app
```

After the installation is complete:

- Run `npm run dev` or `yarn dev` or `pnpm dev` to start the development server on `http://localhost:8080`
- Edit `index.ts` to start developing your server

For more information on how to use create-bridge-app, you can review the create-bridge-app [documentation](https://www.npmjs.com/package/create-bridge-app).

## Manual Setup

### Installations

Install `bridge` and `zod` in your project:

```bash
npm install bridge zod
# or
yarn add bridge zod
# or
pnpm add bridge zod
```

### Create an index.ts file

**Complete Bridge App with HTTP**

```ts twoslash title='index.ts' showLineNumbers
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

```ts twoslash title='index.ts' showLineNumbers
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

<!--
### Defining an endpoint

Let's walk through the steps of building a typesafe API with Bridge. To start, let's create an endpoint that returns "Hello World" to the client.

```ts twoslash title='index.ts'
import { handler } from 'bridge';

const helloEndpoint = handler({
  resolve: () => 'Hello World',
});
```

A handler can set an endpoint and validate user data such as the body, files, request parameters or headers sent. Check out how it works in detail [here](handler/resolve).

### Defining the routes

To define the routes of our project, we simply have to create a routes object and insert inside our handlers. The keys of the routes object correspond to the path.

```ts twoslash title='index.ts'
import { handler } from 'bridge';

const helloEndpoint = handler({
  resolve: () => 'Hello World',
});

const routes = {
  hello: helloEndpoint,
};
```

### Launching the server

To launch our server code, we need to initiate our bridge project with `initBridge`.

**Complete Bridge App with HTTP**

```ts twoslash title='index.ts' showLineNumbers
import { handler, initBridge } from 'bridge';

const helloEndpoint = handler({
  resolve: () => 'Hello World',
});

const routes = {
  hello: helloEndpoint,
};

const port = 8080;

initBridge({ routes })
  .HTTPServer()
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
```

**Complete Bridge App with Express**

```ts twoslash title='index.ts' showLineNumbers
import { handler, initBridge } from 'bridge';
import express from 'express';

const routes = {
  hello: handler({
    resolve: () => 'Hello World',
  }),
};

const port = 8080;
const app = express();

app.use('', initBridge({ routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
``` -->

You can test your endpoint by making an http call to `http://localhost:8080/hello`.

Congratulations, you just launched your first Bridge server! 🥳

:::tip
To get the most out of Bridge in your project, we recommend taking some time to read the documentation on [handlers](handler) and check out our [example](example) for inspiration and guidance.
:::

## Client code generation and documentation

You'll soon be able to generate automatically a complete documentation and a fully type sdk of your api in any language with the Bridge App. Simply join our **[Discord community](https://discord.gg/yxjrwm7Bfr)** to learn more and join the **[Beta](https://discord.gg/yxjrwm7Bfr)**!
