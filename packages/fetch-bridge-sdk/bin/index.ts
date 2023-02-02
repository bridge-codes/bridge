#!/usr/bin/env node
import axios from 'axios';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';
var argv = require('minimist')(process.argv.slice(2));
import fs from 'fs';

const runCommand = (command: string) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const projectFullName = argv._[0];

const [username, projectName] = projectFullName.split('/');

if (!username || !projectName)
  throw new Error('You have ton give your full projectName: {username}/{projectName}');

const config = {
  method: 'get',
  url: `https://api-prod.bridge.codes/deploy/typescript-sdk?owner=${username}&project=${projectName}`,
} as const;

const directory = './sdk';

if (fs.existsSync(directory)) fs.rmSync(directory, { recursive: true });

axios(config)
  .then(function (response) {
    axios({
      method: 'get',
      url: response.data,
      responseType: 'arraybuffer',
    })
      .then((response) => {
        const zipFolder = new AdmZip(response.data);
        zipFolder.extractAllTo(directory, true);
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  .catch(function (error) {
    console.log(error);
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
  runCommand(`echo Installing axios`) && runCommand(`${installCommand} axios`);
if (!packageJSON.dependencies['form-data'])
  runCommand(`echo Installing form-data`) && runCommand(`${installCommand} form-data`);
