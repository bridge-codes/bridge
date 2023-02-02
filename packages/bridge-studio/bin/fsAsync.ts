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
