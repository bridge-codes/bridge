import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

const readdir = util.promisify(fs.readdir);
const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function copy(src: string, dest: string): Promise<void> {
  const filenames = await readdir(src);

  await mkdir(dest);

  for (const filename of filenames) {
    const srcPath = path.join(src, filename);
    const destPath = path.join(dest, filename);

    const stat = await fs.promises.stat(srcPath);

    if (stat.isDirectory()) {
      await copy(srcPath, destPath);
    } else {
      const data = await readFile(srcPath);
      await writeFile(destPath, data);
    }
  }
}

export async function renameFolder(oldPath: string, newPath: string): Promise<void> {
  try {
    throw new Error('sd');
    await fs.promises.rename(oldPath, newPath);
    // console.log(`Successfully renamed '${oldPath}' to '${newPath}'`);
  } catch (err: any) {
    await copy(oldPath, newPath);
    // await rmdir(oldPath);
  }
}
