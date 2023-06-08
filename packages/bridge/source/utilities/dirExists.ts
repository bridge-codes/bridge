import fs from 'fs';

export function directoryExists(path: string): boolean {
  try {
    return fs.statSync(path).isDirectory();
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // The directory does not exist
      return false;
    } else {
      // Something else went wrong
      console.error(err);
      return false;
    }
  }
}
