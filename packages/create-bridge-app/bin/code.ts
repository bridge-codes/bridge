#!/usr/bin/env node

export const indexFile = `import {
    initBridge,
    handler,
    onError,
    StatusCode,
    httpError,
    apply,
  } from "bridge";
  import express from "express";
  // You can also use Yup or Superstruct for data validation
  import z from "zod";
  import dotenv from "dotenv";
  import path from "path";

  if (!process.env.PORT) dotenv.config({ path: path.join(".env") });

  const api = {
    port: process.env.PORT,
    projectName: process.env.projectName,
    serverUrl: process.env.SERVER_URL
  }
  
  // A middleware is also a handler
  const authMiddleware = handler({
    headers: z.object({ token: z.string().min(5) }),
    resolve: ({ headers }) => {
      if (headers.token !== "private_token")
        return httpError(StatusCode.UNAUTHORIZED, "Wrong token");
      else return { firstName: "John", name: "Doe", age: 21 };
    },
  });
  
  // A handler can be used as an endpoint
  const updateUser = handler({
    middlewares: apply(authMiddleware),
    body: z.object({ age: z.number() }),
    resolve: ({ mid, body }) => {
      const user = mid;
      user.age = body.age;
      return user;
    },
  });

  export const createUser = handler({
    body: z.object({ firstName: z.string().min(3), lastName: z.string().min(3) }),
    resolve: ({ body }) => body,
  });
  
  // You can have multiple endpoints for the same route with different methods with the method function
  const routes = {
    hey: handler({ resolve: () => "hey" }), // POST /hey
    hello: handler({
      query: z.object({ name: z.string().optional() }),
      resolve: ({ query }) => \`Hello \${query.name}\`,
    }), // POST /hello
    user: {
      create: createUser, // POST /user/create
      update: updateUser, // POST /user/update
    },
  };
  
  const errorHandler = onError(({ error, path }) => {
    // The error object can be modified here before it is sent to the client
    if (error.name === "Internal server error")
      console.log(path, error); // Send to bug reporting
    else console.log(path, error.status, error.name);
  });
  
  // It is also possible to use HTTP Server
  const app = express();

  app.get('/', (req, res) => res.send(\`Welcome on \${api.projectName}\`));
  
  app.use("", initBridge({ routes, errorHandler, url: api.serverUrl }).expressMiddleware());
  
  app.listen(api.port, () => {
    console.log(\`Listening on port \${api.port}\`);
  });
  `;

export const nodemonFile = `{
    "restartable": "rs",
    "ignore": [".git", "dist/"],
    "watch": ["source"],
    "execMap": {
      "ts": "node -r ts-node/register"
    },
    "env": {
      "NODE_ENV": "test"
    },
    "ext": "js,json,ts"
  }
  `;

export const gitIgnoreFile = `/node_modules
  /dist`;
