#!/usr/bin/env node
import axios from 'axios';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';
import fs from 'fs';

var argv = require('minimist')(process.argv.slice(2));

const launch = async () => {
  const serverUrl = argv._[0];

  if (!serverUrl.includes('/')) {
    console.error(
      'You have to give the server url as parameter, example: npx fetch-bridge-sdk@latest http://localhost:8080',
    );
    process.exit(1);
  }

  const directory = 'sdk';

  const { data } = await axios({
    method: 'get',
    url: `${serverUrl}/sdk`,
    responseType: 'arraybuffer',
  });

  const zipFolder = new AdmZip(data);
  zipFolder.extractAllTo(directory, true);

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
