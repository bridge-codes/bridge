<div align="center">
  <a href="https://bridge.codes">
      <img src="https://bridge.codes/img/logo_b_round.svg" height="120" />
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

# Bridge

Bridge is the most straightforward yet powerful framework for creating simple or complex APIs using the full power of TypeScript, even for developers with little experience. Give it a try and see how easy it is to build your dream API!

<!-- [Try it live](https://stackblitz.com/edit/github-vuwsnn?file=index.ts&view=editor) -->

<!-- **👉 See more informations on [bridge.codes](https://bridge.codes) 👈** -->

## Documentation

Full documentation for `bridge` can be found [here](https://bridge.codes).

## Installation

```bash
# npm
npm install bridge
# Yarn
yarn add bridge
# pnpm
pnpm add bridge
```

## Quickstart

```bash
# npm
npx create-bridge-app@latest
# Yarn
yarn create bridge-app
# pnpm
pnpm create bridge-app
```

## Basic Example

```ts
import { initBridge, handler } from 'bridge';
import express from 'express';
// You can also use Yup or Superstruct for data validation
import z from 'zod';

const port = 8080;

// A handler can be used as an endpoint but also as a middleware
const heyHandler = handler({
  query: z.object({ name: z.string() }),
  resolve: ({ query }) => `Hey ${query.name}`,
});

// You can also have multiple endpoints for the same route with different methods with the method function
const routes = {
  hey: heyHandler, // POST /hey
};

// It is also possible to use pure HTTP Server
const app = express();

app.use('', initBridge({ routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```

For more complex examples and a full understanding of the capabilities of Bridge, be sure to check out our [documentation](https://bridge.codes)!

## Client code generation and documentation


### Connect your Bridge API to Bridge Studio

**With the CLI**

```bash title='terminal'
npx bridge-studio@latest
# or
pnpx bridge-studio@latest
```

**With the plateform:** https://studio.bridge.codes


### Fetch your client SDK

```bash title='terminal'
npx fetch-bridge-sdk@latest {username}/{projectName}
```


### Access your generated documentation

You'll be able to access your complete generated documentation on https://studio.bridge.codes soon.

Please visit https://bridge.codes/studio for more information.