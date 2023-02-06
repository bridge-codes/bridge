#!/usr/bin/env node

import os from 'os';
import path from 'path';
import prompts from 'prompts';
import fs from 'fs';
import { execSync } from 'child_process';
import { renameFolder } from './renameSync';

const launch = async () => {
  const slugRegex = /^[a-zA-Z0-9-]+$/;

  const { projectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: `What's your project's name?`,
    validate: (text) =>
      slugRegex.test(text) ? true : 'You can only use alphanumeric characters and -',
  });

  if (fs.existsSync(`./${projectName}`)) {
    const { override } = await prompts({
      type: 'confirm',
      name: 'override',
      message: `A folder in ./${projectName} already exists. Do you want to override it?`,
    });

    if (!override) process.exit(1);
    fs.rmSync(`./${projectName}`, { recursive: true });
  }

  const { template } = await prompts({
    type: 'select',
    choices: [
      { title: 'minimal-express', value: 'minimal-express' },
      { title: 'minimal-http', value: 'minimal-http' },
    ],
    name: 'template',
    message: `Which template do you want to use?`,
    validate: (text) =>
      slugRegex.test(text) ? true : 'You can only use alphanumeric characters and -',
  });

  const tempRepoPath = path.join('./', 'bridgeRepoTemp');

  execSync(`git clone https://github.com/bridge-codes/bridge.git ${tempRepoPath} -q`);

  // fs.mkdirSync(projectName);

  // const oldPath = path.join(tempRepoPath, `examples/${template}`);
  // const newPath = projectName;

  // fs.copyFileSync(path.join(tempRepoPath, `examples/${template}`), projectName);

  // fs.unlinkSync(`examples/${template}`);

  await renameFolder(path.join(tempRepoPath, `examples/${template}`), projectName);

  const packageJSONPath = path.join(projectName, 'package.json');
  fs.readFile(packageJSONPath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const regexStr = `"name": "${template}",`;
    const result = data.replace(new RegExp(regexStr, 'g'), `"name": "${projectName}",`);

    fs.writeFile(packageJSONPath, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

  fs.rmSync(tempRepoPath, { recursive: true });
};

launch();
