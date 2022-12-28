#!/usr/bin/env node

import { runCommand } from './utils';
import fs from 'fs';
import prettier from 'prettier';
import { indexFile } from './code';
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
        prettier.format(indexFile, { parser: 'typescript' }),
        () => {},
      );
    },
  });

  readline.close();
});
