#!/usr/bin/env node

import { runCommand } from './utils';
import fs from 'fs';
import prettier from 'prettier';
// import { indexFile, nodemonFile, gitIgnoreFile } from './code';
// import minimist from 'minimist';

// const argv = minimist(process.argv.slice(2));

import readlineLib from 'readline';

const readline = readlineLib.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`What's your project name? `, (name) => {
  readline.close();
  console.log(`Downloading dependencies...`);

  runCommand({
    command: `mkdir ${name} && echo ah && cd ${name} && npx tsc --init --outDir dist`,
    onSuccess: () => {
      console.log('wtf');
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
          "dev": "nodemon --config nodemon.json ./index.ts",
          "build": "tsc"
        }
      }`,
          { parser: 'json' },
        ),
        () => {
          runCommand({
            command: `cd ${name} && npm i bridge express zod dotenv && npm i --save-dev @types/express @types/node typescript ts-node nodemon`,
            onSuccess: () => {
              console.log('success');
              // Promise.all([
              //   writeFileAsync(
              //     `${name}/index.ts`,
              //     prettier.format(indexFile, { parser: 'typescript' }),
              //   ),
              //   writeFileAsync(
              //     `${name}/nodemon.json`,
              //     prettier.format(nodemonFile, { parser: 'json' }),
              //   ),
              //   writeFileAsync(`${name}/.gitignore`, gitIgnoreFile),
              //   writeFileAsync(
              //     `${name}/.env`,
              //     `PROJECT_NAME=${name}\nPORT=8080\nSERVER_URL=http://localhost:8080`,
              //   ),
              //   writeFileAsync(
              //     `${name}/README.md`,
              //     `#${name}\n\nWelcome on ${name}, this is a Bridge project, visit https://bridge.codes to learn how to automatically generate a complete online documentation and a fully typed client code in any language.`,
              //   ),
              // ]);
            },
          });
        },
      );
    },
  });
});
