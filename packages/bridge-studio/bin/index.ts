#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { exec } from 'child_process';
import { API } from '../sdk';
import * as os from 'os';
import colors from 'colors';
import ora from 'ora';
import prompts from 'prompts';
import prettier from 'prettier';

const getBridgeConfig = ():
  | false
  | { projectName: string; secretToken: string; serverUrl: string; projectId: string } => {
  try {
    const bridgeConfigJson = require(path.join(process.cwd(), 'bridge.config.json'));
    if (
      !(
        bridgeConfigJson.projectName &&
        bridgeConfigJson.secretToken &&
        bridgeConfigJson.serverUrl &&
        bridgeConfigJson.projectId
      )
    )
      return false;
    return bridgeConfigJson;
  } catch (e) {
    return false;
  }
};

const getPackageJSON = (): false | { name?: string; dependencies?: Record<string, string> } => {
  try {
    return require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    return false;
  }
};

const githubClientId = 'Iv1.61c158472b4a85b9';

const getProjectZipBuffer = async (): Promise<{
  projectTempPath: string;
  projectZipBuffer: Buffer;
}> => {
  const zip = new AdmZip();
  zip.addLocalFolder('.', undefined, (path) => !path.startsWith('node_modules'));

  const projectDir = path.join(os.tmpdir(), new Date().getTime().toString());
  fs.mkdirSync(projectDir);

  const projectTempPath = path.join(projectDir, new Date().getTime().toString());
  fs.mkdirSync(projectTempPath);
  zip.extractAllTo(projectTempPath);

  const newZip = new AdmZip();
  newZip.addLocalFolder(projectDir);

  return { projectTempPath, projectZipBuffer: newZip.toBuffer() };
};

type BridgeConfig = {
  projectId: string;
  projectName: string;
  secretToken: string;
  serverUrl: string;
};

const createBridgeConfigWithPrompt = async (
  packageJsonProjectName?: string,
): Promise<BridgeConfig> => {
  console.log(
    `You're going to be redirected to the Bridge Login: https://github.com/login/oauth/authorize?client_id=${githubClientId}`,
  );

  new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
    exec(`open 'https://github.com/login/oauth/authorize?client_id=${githubClientId}'`);
    exec(`start "" "https://github.com/login/oauth/authorize?client_id=${githubClientId}"`);
  });

  const { secretToken } = await prompts({
    type: 'text',
    name: 'secretToken',
    message: 'Copy/paste here your secretToken',
    validate: (text) => (text.length < 15 ? 'This is not your secretToken' : true),
  });

  const slugRegex = /^[a-zA-Z0-9-]+$/;

  const { projectName } = await prompts({
    type: 'text',
    name: 'projectName',
    message: `What's your project's name?`,
    initial: packageJsonProjectName,
    validate: (text) =>
      slugRegex.test(text) ? true : 'You can only use alphanumeric characters and -',
  });

  const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}/;

  const { serverUrl } = await prompts({
    type: 'text',
    name: 'serverUrl',
    message: `What's your server's url?`,
    initial: 'http://localhost:8080',
    validate: (text) => (urlRegex.test(text) ? true : 'This is not a correct url'),
  });

  const res = await API.project.createProjectFromCLI({
    headers: { token: secretToken },
    query: { serverUrl, projectName },
  });

  if (res.error) {
    console.log(colors.red(`Error: ${res.error.name}`));
    process.exit(1);
  }

  const bridgeConfig: BridgeConfig = {
    projectId: res.data._id,
    projectName,
    serverUrl,
    secretToken,
  };

  fs.writeFile(
    'bridge.config.json',
    prettier.format(JSON.stringify(bridgeConfig), { parser: 'json' }),
    () => {},
  );

  return bridgeConfig;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const launch = async () => {
  const packageJson = getPackageJSON();
  if (!packageJson) {
    console.error(colors.red(`Error: package.json not found`));
    process.exit(1);
  }

  if (!packageJson.dependencies?.bridge) {
    console.error(colors.red(`Error: bridge was not found in your project's dependencies`));
    process.exit(1);
  }

  let bridgeConfig = getBridgeConfig();

  if (!bridgeConfig) bridgeConfig = await createBridgeConfigWithPrompt(packageJson.name);

  const { projectTempPath, projectZipBuffer } = await getProjectZipBuffer();

  let res = await API.project.compileWithCommandLine({
    file: { projectZipBuffer },
    headers: { token: bridgeConfig.secretToken },
    query: {
      projectId: bridgeConfig.projectId,
      serverUrl: bridgeConfig.serverUrl,
      projectName: bridgeConfig.projectName,
    },
  });

  if (res.error) {
    console.error(colors.red(`Error: ${res.error.name}`));
    process.exit(1);
  }

  let { user, project } = res.data;

  const spinner = ora('0s: Compiling your project').start();
  let compDurationSec = 0;

  do {
    await sleep(1000);
    compDurationSec++;
    const res = await API.project.getFromCLI({
      headers: { token: bridgeConfig.secretToken },
      query: { _id: bridgeConfig.projectId },
    });

    if (res.error) {
      console.error(colors.red(`Error: Project not found`));
      process.exit(1);
    }

    project = res.data;

    spinner.text = `${compDurationSec}s: Compiling your project`;
  } while (project.pendingCompilation);

  spinner.stop();

  if (project.lastCompilationSuccess)
    console.log(
      colors.green(`Your project has successfully been compiled in ${compDurationSec - 1}s!`),
    );
  else {
    console.log(
      colors.red(
        `There has been an error in your project compilation. Contact the support on discord or at support@bridge.codes`,
      ),
    );
    process.exit(1);
  }

  console.log(
    `You can fetch your sdk with the following command: ` +
      colors.blue(`npx fetch-bridge-sdk@latest ${user.username}/${bridgeConfig.projectName}`),
  );

  fs.rm(projectTempPath, { recursive: true }, () => {});
};

launch();
