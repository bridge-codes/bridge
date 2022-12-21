---
sidebar_position: 1
---

# Quickstart

Welcome to the Bridge documentation!

If you have any questions about anything related to Bridge or if you want to discuss with us and the community, you are welcome to join our **[discord](https://discord.gg/yxjrwm7Bfr)**.

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

For more information on how to use create-next-app, you can review the create-bridge-app [documentation](https://discord.gg/yxjrwm7Bfr).

## Manual Setup

Install `bridge` in your project:

```bash
npm install bridge
# or
yarn add bridge
# or
pnpm add bridge
```

### Defining a handler

Let's walk through the steps of building a typesafe API with Bridge. To start, let's create our first `handler`:

```ts twoslash title='index.ts'
import { handler } from 'bridge';

const helloHandler = handler({
  resolve: () => 'Hello',
});
```

A handler can set an endpoint and validate user data such as the body, files, request parameters or headers sent. Check out how it works in detail

<!-- [here](handler). -->

### Defining the routes

To define the routes of our project, we simply have to create a routes object and insert inside our handlers. The keys of the routes object correspond to the path.

```ts twoslash title='index.ts'
import { handler } from 'bridge';

const helloHandler = handler({
  resolve: () => 'Hello',
});

const routes = {
  hello: helloHandler,
};
```

### Launching the server

To launch our server code, we need to initiate our bridge project with `initBridge`.

**With HTTP**

```ts twoslash title='index.ts'
import { handler, initBridge } from 'bridge';

const helloHandler = handler({
  resolve: () => 'Hello',
});

const routes = {
  hello: helloHandler,
};

const port = 8080;

initBridge({ routes })
  .HTTPserver()
  .listen((port) => {
    console.log(`Listening on port ${port}`);
  });
```

**With Express**

```ts twoslash title='index.ts'
import { handler, initBridge } from 'bridge';
import express from 'express';

const helloHandler = handler({
  resolve: () => 'Hello',
});

const routes = {
  hello: helloHandler,
};

const port = 8080;

const bridge = initBridge({ routes });

const app = express();

app.use('', bridge.expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

Congratulations, you just launched your first bridge server! 🥳

## Client code generation and documentation

You'll soon be able to generate automatically a complete documentation and a fully type sdk of your api in any language with the Bridge App.

Coming soon...
