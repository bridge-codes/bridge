#!/usr/bin/env node

import { runCommand } from './utils';
import fs from 'fs';
import prettier from 'prettier';
import { indexFile, nodemonFile, gitIgnoreFile } from './code';
// import minimist from 'minimist';

// const argv = minimist(process.argv.slice(2));

import readlineLib from 'readline';

const readline = readlineLib.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`What's your project name? `, (name) => {
  console.log(name);
  console.log(`Downloading dependencies...`);

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
            command: `cd ${name} && npm i bridge express zod && npm i --save-dev @types/express @types/node typescript ts-node nodemon`,
          });
        },
      );

      fs.writeFile(
        `${name}/index.ts`,
        prettier.format(indexFile, { parser: 'typescript' }),
        () => {},
      );

      fs.writeFile(
        `${name}/nodemon.json`,
        prettier.format(nodemonFile, { parser: 'json' }),
        () => {},
      );

      fs.writeFile(`${name}/.gitignore`, gitIgnoreFile, () => {});

      fs.writeFile(
        `${name}/.env`,
        `PROJECT_NAME=${name}\nPORT=8080\nSERVER_URL=http://localhost:8080`,
        () => {},
      );

      fs.writeFile(
        `${name}/README.md`,
        `#${name}\n\nWelcome on ${name}, this is a Bridge project, visit https://bridge.codes to learn how to automatically generate a complete online documentation and a fully typed client code in any language.`,
        () => {},
      );
    },
  });

  readline.close();
});
