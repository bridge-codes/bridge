import AdmZip from 'adm-zip';
import * as os from 'os';

export const extractZipFromBufferAndGetPath = (zipBuffer: Buffer): string => {
  const zipFolder = new AdmZip(zipBuffer);

  const folderName = zipFolder.getEntries()[0].entryName;

  console.log(folderName);

  const tmpDir = os.tmpdir();

  zipFolder.extractAllTo(tmpDir, true);

  return `${tmpDir}/${folderName}`;
};
