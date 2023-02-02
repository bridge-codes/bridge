#!/usr/bin/env node
import axios from 'axios';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';
import prompts from 'prompts';
import { API } from '../sdk';
import fs from 'fs';

var argv = require('minimist')(process.argv.slice(2));

const launch = async () => {
  const projectFullName = argv._[0];

  if (!projectFullName.includes('/')) {
    console.error(
      'You have ton give a parameter, example: npx fetch-bridge-sdk@latest digitalu/bridge-api',
    );
    process.exit(1);
  }

  const [username, projectName] = projectFullName.split('/');

  const slugRegex = /^[a-zA-Z0-9-]+$/;

  const { directory } = await prompts({
    type: 'text',
    name: 'directory',
    message: `What's the name of the directory?`,
    initial: 'sdk',
    validate: (text) =>
      slugRegex.test(text) ? true : 'You can only use alphanumeric characters and -',
  });

  if (fs.existsSync(directory)) {
    const { override } = await prompts({
      type: 'confirm',
      name: 'override',
      message: `A folder in ./${directory} already exists. Do you want to override it?`,
    });

    if (!override) process.exit(1);
    fs.rmSync(directory, { recursive: true });
  }

  API.deploy.typescriptsdk.get({ query: { owner: username, project: projectName } }).then((res) => {
    if (res.error) {
      console.error(res.error);
      process.exit(1);
    }

    axios({
      method: 'get',
      url: res.data,
      responseType: 'arraybuffer',
    })
      .then((response) => {
        const zipFolder = new AdmZip(response.data);
        zipFolder.extractAllTo(directory, true);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

  let pnpmLock: boolean;
  try {
    fs.readFileSync('./pnpm-lock.yaml', 'utf-8');
    pnpmLock = true;
  } catch (e) {
    pnpmLock = false;
  }

  const installCommand = pnpmLock ? 'pnpm i' : 'npm i';

  if (!packageJSON) throw new Error('package.json not found.');

  if (!packageJSON.dependencies.axios)
    execSync(`echo Installing axios`) && execSync(`${installCommand} axios`);
  if (!packageJSON.dependencies['form-data'])
    execSync(`echo Installing form-data`) && execSync(`${installCommand} form-data`);
};

launch();
