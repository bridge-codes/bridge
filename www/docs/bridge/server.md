---
sidebar_label: 'Launch your server'
---

# Launch your server

## With Node HTTP

### Example


```ts twoslash title='server.ts'
import { initBridge, handler } from 'bridge';

const hello = handler({
  resolve: () => 'hello',
});

const bridge = initBridge({ routes: { hello } });

const port = 8080;

bridge.HTTPServer().listen(port, () => {
  `Listening on port ${port}`;
});
```

## With Express

### Install [express](https://www.npmjs.com/package/express)

```bash title=terminal
npm i express
npm i --save-dev @types/express
```

### Example

```ts twoslash title='server.ts'
import { initBridge, handler } from 'bridge';
import express from 'express';

const hello = handler({
  resolve: () => 'hello',
});

const bridge = initBridge({ routes: { hello } });

const port = 8080;

const app = express();

app.use('', bridge.expressMiddleware());

app.listen(port, () => {
  `Listening on port ${port}`;
});
```

## With Fastify

Coming soon...

## Lambda

Coming soon...



