import childProcess from 'child_process';

export function runCommand({
  command,
  onSuccess,
  onFailure,
}: {
  command: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}): void {
  try {
    childProcess.exec(`${command}`, (error, stdout, stderr) => {
      // console.log(error, stdout, stderr);

      if (error) onFailure?.();
      else onSuccess?.();
    });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);

    onFailure?.();
  }
}

import fs from 'fs';

export const writeFileAsync = (filePath: string, content: string) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(filePath, content, function (err) {
      if (err) reject(err);
      else resolve({ success: true });
    });
  });
};

export const mkdirAsync = (folderPath: string) => {
  return new Promise(function (resolve, reject) {
    fs.mkdir(folderPath, function (err) {
      if (err) reject(err);
      else resolve({ success: true });
    });
  });
};
