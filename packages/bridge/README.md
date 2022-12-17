<div align="center">
  <a href="https://bridge.codes">
      <img src="https://pbs.twimg.com/profile_images/1603953549037080576/pXOaHTde_400x400.png" height="120" />
  </a>
</div>
  
<div align="center">

 <a href="https://twitter.com/bridge_codes">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40bridge_codes&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
  </a>
  <a href="https://discord.gg/ZCw645JV"> 
    <img alt="Discord" src="https://img.shields.io/discord/1050622016673288282?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://github.com/trpc/trpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/trpc/trpc" />
  </a>
</div>

## What is Bridge?

Bridge is a Typescript Node.js framework that provides an easy and scalable way to create REST APIs while generating the client code.

Our goal is to make Bridge a great framework for both frontend and backend teams, so if you're familiar with Node.js and Typescript, you'll feel right at home.

**👉 See more informations on [bridge.codes](https://bridge.code). 👈**

## Quickstart

There are a few [examples](https://github.com/bridge-codes/bridge/tree/main/examples) that you can use for playing out with Bridge or bootstrapping your new project.

**Quick start by creating a project with create-bridge-app:**

```bash
npx create-bridge-app@latest
# or
yarn create bridge-app
# or
pnpm create bridge-app
```

**Or by creating a project by yourself with http:**

```bash
npm init
npm i bridge
npm i typescript --save-dev
```

```typescript
import { handler, initBridge } from 'bridge';

const port = 8080;
const routes = { hello: handler({ method: 'GET', resolve: () => 'hello' }) };

initBridge({ routes })
  .HTTPServer()
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
```

**Or with express:**

```bash
npm init
npm i bridge express
npm i typescript @types/express --save-dev
```

```typescript
import { handler, initBridge } from 'bridge';
import express from 'express';

const port = 8080;
const routes = { hello: handler({ method: 'GET', resolve: () => 'hello' }) };

const app = express();

app.use('', initBridge({ routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

## Documentation

**Create a handler that validates data**

```typescript
// You can use either zod, yup or superstruct
import z from 'zod'

const hello: handler({
  query: z.object({ name: z.string().optional() }),
  body: z.object({ age: z.number() }),
  headers: z.object({ token: z.string().min(6) }),
  resolve: ({ query, body, headers }) => `Hello ${query.name}`,
}),
```

**Send error to client**

```typescript
import { httpError, StatusCode } from "bridge";

const getMe: handler({
  headers: z.object({ token: z.string().min(6) }),
  resolve: ({ headers }) => {
    if (headers.token !== "private_token") return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return {
      firstName: 'John',
      lastName: 'Doe',
    }
  },
}),
```

**Creating and using a middleware**

```typescript
import z from 'zod';
import { apply } from 'bridge';

const authMiddleware = handler({
  headers: z.object({ token: z.string().min(5) }),
  resolve: ({ headers }) => {
    if (headers.token !== 'private_token') return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return { firstName: 'John', name: 'Doe', age: 21 };
  },
});

const updateUser = handler({
  middlewares: apply(authMiddleware),
  body: z.object({ age: z.number() }),
  resolve: ({ mid, body }) => {
    const user = mid;
    user.age = body.age;
    return user;
  },
});
```

**Handle errors**

```typescript
import { initBridge, onError } from 'bridge';

const errorHandler = onError(({ error, path }) => {
  if (error.name === 'Internal server error') console.log(path, error); // Send to bug reporting
  else console.log(path, error.status, error.name);
});

const bridge = initBridge({ routes, errorHandler });
```

**👉 See full documentation on [bridge.codes](https://bridge.codes/documentation). 👈**
