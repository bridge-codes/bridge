import fs from 'fs';

export async function removeAddedCode(absolutePath: string, addedCode: string) {
  try {
    const data = fs.readFileSync(absolutePath, 'utf-8');
    const newData = data.replace(addedCode, '');

    fs.writeFileSync(absolutePath, newData, 'utf-8');
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}
