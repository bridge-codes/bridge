#!/usr/bin/env node

import { findSourceFilePath } from './parser/find-source-file';
import fs from 'fs';
import tsParser from './parser/ts-parser';
import colors from 'colors';
import path from 'path';
import prompts from 'prompts';
import prettier from 'prettier';
import ora from 'ora';
import { execSync } from 'child_process';
import AdmZip from 'adm-zip';
import { compileTypescriptSDK } from './sdk-compilers';
import { removeAddedCode } from './parser/remove-added-code';
import { OpenAPIObject, JSONTypeI } from './types';
import { convertJSONTypeObjectToOpenAPIPath } from './openapi';

var argv = require('minimist')(process.argv.slice(2));

type BridgeConfig = {
  serverUrl: string;
  typescript?: boolean;
  openapi?: boolean;
};

const hasProjectPNPM = (projectTempPath: string): boolean => {
  try {
    fs.readFileSync(`${projectTempPath}/pnpm-lock.yaml`, 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
};

const getPackageJSON = (): false | { version?: string; name?: string; dependencies?: Record<string, string> } => {
  try {
    return require(path.join(process.cwd(), 'package.json'));
  } catch (e) {
    return false;
  }
};

const getBridgeConfig = (): false | { serverUrl: string } => {
  try {
    const bridgeConfigJson = require(path.join(process.cwd(), 'bridge.config.json'));
    if (!bridgeConfigJson.serverUrl) return false;
    return bridgeConfigJson;
  } catch (e) {
    return false;
  }
};

const createBridgeConfigWithPrompt = async (): Promise<BridgeConfig> => {
  const urlRegex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}/;

  const { serverUrl } = await prompts({
    type: 'text',
    name: 'serverUrl',
    message: `What's your server's url?`,
    initial: 'http://localhost:8080',
    validate: (text) => (urlRegex.test(text) ? true : 'This is not a correct url'),
  });

  const bridgeConfig: BridgeConfig = { serverUrl };

  fs.writeFile('bridge.config.json', prettier.format(JSON.stringify(bridgeConfig), { parser: 'json' }), () => {});

  return bridgeConfig;
};

export const convertJSONTypeToOpenAPI = (jsonType: JSONTypeI): OpenAPIObject => {
  const openAPI: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
    },
    paths: {},
  };

  if (!('object' in jsonType)) return openAPI;

  openAPI.paths = convertJSONTypeObjectToOpenAPIPath(jsonType.object);

  return openAPI;
};

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
  if (argv._[0]) bridgeConfig = { serverUrl: argv._[0] };
  if (!bridgeConfig) bridgeConfig = await createBridgeConfigWithPrompt();

  const spinner = ora('Compiling your project').start();

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Start Compilation
  //////////////////////////////////////////////////////////////////////////////////////////////////

  const { sourceFilePath, addedCode } = await findSourceFilePath(path.join(process.cwd(), ''));
  if (!sourceFilePath) throw new Error('No source file detected');

  const JSONType = tsParser(sourceFilePath);

  fs.writeFileSync('./JSONType.json', prettier.format(JSON.stringify(JSONType), { parser: 'json' }));

  removeAddedCode(sourceFilePath, addedCode);

  const buffer = await compileTypescriptSDK(JSONType, bridgeConfig.serverUrl);

  const zipFolder = new AdmZip(buffer);
  zipFolder.extractAllTo('./sdk', true);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // OPENAPI
  //////////////////////////////////////////////////////////////////////////////////////////////////

  const openAPI: OpenAPIObject = {
    openapi: '3.0.0',
    info: {
      title: packageJson.name || 'Your Bridge API',
      version: 'Bridge: ' + packageJson.version || '1.0.0',
    },
    paths: {},
  };

  openAPI.paths = convertJSONTypeObjectToOpenAPIPath((JSONType as any).object);

  fs.writeFileSync('./openapi.json', prettier.format(JSON.stringify(openAPI), { parser: 'json' }));

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Install Dependencies If needed
  //////////////////////////////////////////////////////////////////////////////////////////////////

  const installCommand = hasProjectPNPM('./') ? 'pnpm i' : 'npm i';

  if (!packageJson.dependencies.axios) execSync(`echo Installing axios`) && execSync(`${installCommand} axios`);
  if (!packageJson.dependencies['form-data'])
    execSync(`echo Installing form-data`) && execSync(`${installCommand} form-data`);
  if (!packageJson.dependencies['adm-zip'])
    execSync(`echo Installing adm-zip`) && execSync(`${installCommand} adm-zip`);

  spinner.stop();
};

launch();
