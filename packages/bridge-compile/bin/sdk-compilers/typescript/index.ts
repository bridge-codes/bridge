import { JSONTypeI } from '../../types';
import { mkdirAsync, writeFileAsync } from '../../utils';
import { writeHandlersFilesAndFolders } from './write-handlers-file';
import getFetchFileContent from './compilers/fetch-file-compiler';
import { getIndexTSFileContent } from './compilers/index-import-file-compiler';
import prettier from 'prettier';
import AdmZip from 'adm-zip';
import fs from 'fs';
import os from 'os';

export default async (JSONType: JSONTypeI, serverUrl: string): Promise<Buffer> => {
  const sdkTempPath = `${os.tmpdir()}/ts-sdk-${new Date().getTime()}`;

  await mkdirAsync(sdkTempPath);

  const [routesTree] = await Promise.all([
    writeHandlersFilesAndFolders(JSONType, sdkTempPath, {}),
    writeFileAsync(`${sdkTempPath}/bridgeFetchMethod.ts`, getFetchFileContent(serverUrl)),
  ]);

  const { importsString, exportAPIStringObject } = getIndexTSFileContent(routesTree);

  await writeFileAsync(
    `${sdkTempPath}/index.ts`,
    prettier.format(`${importsString}\nexport const API = ${exportAPIStringObject.slice(0, -1)}`, {
      parser: 'typescript',
      singleQuote: true,
    })
  );

  const zip = new AdmZip();
  zip.addLocalFolder(sdkTempPath);

  const buffer = await zip.toBufferPromise();

  fs.rm(sdkTempPath, { recursive: true }, () => {});

  return buffer;
};
