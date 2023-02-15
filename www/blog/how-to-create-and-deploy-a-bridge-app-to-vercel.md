---
slug: how-to-create-and-deploy-a-bridge-app-to-vercel
title: How to create and deploy a Bridge app (with Express) to Vercel?
authors: [raul]
tags: [devops]
---

# How to create and deploy a Bridge app with Vercel

Vercel is a platform to host frontend applications and static sites but you can also host an express app using serverless functions. I've been using it for quite some time (mainly for frontend stuff) but it can also deploy your Expressjs backend!
We will see how to create a [Bridge app](https://bridge.codes) and deploy it to [Vercel](https://vercel.com).

## A quick presentation on Bridge.

Bridge is a Typescript backend framework that focuses on type-safety and developer experience. It aims to provide the best developer experience by simplifying the process of developing and integrating APIs.

This is done by heavily using the Typescript inference between elements from the backend such as data validation, routes, middlewares and so on.

## Prerequisites

Having [Nodejs](https://nodejs.org/) and [Vercel CLI](https://vercel.com/docs/cli) installed on your machine.

## 1. Create your Bridge app

The easiest way it to use the **create-bridge-app** npm package.

You can do that by using:

```bash
npx create-bridge-app@latest
```

What is your project's name: **bridge-vercel**
Which template do you want to use? Select **minimal-express**



Now, you can go into the created directory and install the dependencies:
```
cd bridge-vercel && npm i
```

And that's it! This should work perfectly on your machine. Try it using:

```
npm run dev
```

However, the code as it is won't work if deployed to Vercel. Some changes have to be made to make it compatible with the serverless functions.

## Deploy your app to Vercel

There are a few things we need to do to deploy our app to Vercel:

- Create a **vercel.json** file
- Edit the **index.ts** file
- Edit the **tsconfig.json** file
- Edit the **package.json** file

### vercel.json

The first thing that we will do is to create a **vercel.json** file at the root of your project.

```json
{
  "rewrites": [
    {
      "source": "/api/:path+",
      "destination": "/api"
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/api"
    }
  ]
}
```

What it does is redirect every request to the '/api' route. A request that would be 'GET /users/all' will be redirected to "GET /api/users/all".
Why is that necessary? Because Vercel considers that each file of the '/api' folder is a serverless function and will deploy it as a serverless function.

### index.ts

To make it work, we'll also need to update our **index.ts** file and **initBridge** on the **/api** route. We addtionnaly add a new route GET "/api/hello".

```ts
import { initBridge, handler, method } from 'bridge';
import express from 'express';

const app = express();

app.get('/api', (req, res) => res.send(`Welcome on Bridge API`));

const heyHandler = handler({
  resolve: () => {
    return 'Hey you!';
  },
});

const routes = {
  hey: method({ GET: heyHandler }),
};

app.use('/api', initBridge({ routes }).expressMiddleware());

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});

module.exports = app;
```

Don't forget to add the **module.exports = app** at the end of your file.

### package.json

Let's now edit our package.json and add some useful scripts.
It should look like this:

```json
{
  "name": "bridge-vercel",
  "version": "1.0.0",
  "dependencies": {
    "bridge": "^2.0.45",
    "express": "^4.18.2",
    "ts-node": "^10.9.1"
  },
  "scripts": {
    "deploy": "tsc && vercel",
    "deploy-prod": "tsc && vercel --prod",
    "dev": "ts-node index.ts"
  },
  "devDependencies": {
    "@types/express": "^4.17.15",
    "@types/node": "^18.11.16",
    "typescript": "^4.9.4"
  }
}
```

- __npm run dev__ will run our development server on port 8080.
- __npm run vercel__ builds and deploys our app to vercel in preview
- __npm run deploy-prod__ build and deploys our app to vercel in production

### tsconfig.json

Now, let's edit our tsconfig file to make a build into the /api folder. 

```json
{
  "compilerOptions": {
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "commonjs" /* Specify what module code is generated. */,
    "outDir": "api" /* Specify an output folder for all emitted files. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}
```

Now everything should be ready for the deploy, just use **vercel**.

```
npm run deploy
```

Once the deployment is finished (this should take 10 seconds), you should be able to access the GET /api/hello route.

To read more about Bridge, check out the [documentation](https://bridge.codes/docs/handler).
