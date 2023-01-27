#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import axios from 'axios';

// import prompts from 'prompts';

// (async () => {
//   const response = await prompts({
//     type: 'number',
//     name: 'value',
//     message: 'How old are you?',
//     validate: (value) => (value < 18 ? `Nightclub is 18+ only` : true),
//   });

//   console.log(response); // => { value: 24 }
// })();

const getBridgeConfig = () => {
  try {
    const bridgeCongJson = require(path.join(process.cwd(), 'bridge.config.json'));
    if (
      !(
        bridgeCongJson.username &&
        bridgeCongJson.projectName &&
        bridgeCongJson.secretToken &&
        bridgeCongJson.serverUrl
      )
    )
      return false;
    return bridgeCongJson;
  } catch (e) {
    return false;
  }
};

const isBridgeProject = () => {
  try {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    return packageJson.dependencies['bridge'] !== undefined;
  } catch (e) {
    return false;
  }
};

const launch = () => {
  if (!isBridgeProject) process.exit(1);

  console.log(getBridgeConfig());

  const zip = new AdmZip();
  zip.addLocalFolder('.', undefined, (path) => {
    return !path.startsWith('node_modules');
  });

  // axios.post('http://localhost:8080/project/createWithCommandLine');
  //   zip.writeZip('output.zip');
};

launch();
