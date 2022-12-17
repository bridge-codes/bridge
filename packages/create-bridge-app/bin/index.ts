#!/usr/bin/env node

import { runCommand } from './utils';
import fs from 'fs';
import prettier from 'prettier';
// import minimist from 'minimist';

// const argv = minimist(process.argv.slice(2));

import readlineLib from 'readline';

const readline = readlineLib.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`What's your project name? `, (name) => {
  console.log(`Hey there ${name}!`);

  runCommand({
    command: `mkdir ${name} && cd ${name} && npx tsc --init --outDir dist`,
    onSuccess: () => {
      fs.writeFile(
        `${name}/package.json`,
        prettier.format(
          `{
        "name": "${name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[^a-zA-Z0-9]/g, '')}",
        "version": "1.0.0",
        "scripts": {
          "start": "node ./dist/index.js",
          "build": "tsc"
        }
      }`,
          { parser: 'json' },
        ),
        () => {
          runCommand({
            command: `cd ${name} && npm i bridge express zod && npm i --save-dev @types/express @types/node typescript`,
          });
        },
      );

      fs.writeFile(
        `${name}/index.ts`,
        prettier.format(
          `import { initBridge, handler, onError, StatusCode, httpError, apply } from 'bridge';
          import express from 'express';
          import z from 'zod';
          
          const port = 8080;
          
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
          
          const routes = {
            hey: handler({ resolve: () => 'hey' }),
            hello: handler({
              query: z.object({ name: z.string().optional() }),
              method: 'GET',
              resolve: ({ query }) => \`Hello \${query.name}\`,
            }),
            user: {
              update: updateUser,
            },
          };
          
          const errorHandler = onError(({ error, path }) => {
            if (error.name === 'Internal server error') console.log(path, error); // Send to bug reporting
            else console.log(path, error.status, error.name);
          });
          
          const app = express();
          
          app.use('', initBridge({ routes, errorHandler }).expressMiddleware());
          
          app.listen(port, () => {
            console.log(\`Listening on port \${port}\`);
          });`,
          { parser: 'typescript' },
        ),
        () => {},
      );
    },
  });

  readline.close();
});
