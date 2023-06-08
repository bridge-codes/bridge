import fs from 'fs';
import path from 'path';

/**
 *
 */
export const findSourceFilePath = async (dir: string): Promise<{ sourceFilePath: string; addedCode: string }> => {
  let sourceFilePath: string = '';
  let addedCode: string = '';

  for (const file of fs.readdirSync(dir)) {
    const absolute = path.join(dir, file);

    if (fs.statSync(absolute).isDirectory()) {
      const { sourceFilePath: sourceFilePathInDir, addedCode: addedCodeInDir } = await findSourceFilePath(absolute);
      if (sourceFilePathInDir) return { sourceFilePath: sourceFilePathInDir, addedCode: addedCodeInDir };
    } else if (absolute.substring(absolute.length - 3) === '.ts') {
      const file = fs.readFileSync(absolute, 'utf8');
      const matches = file.match(/initBridge\((.*?)\)/);

      if (matches && matches?.length > 1 && matches[1].includes('routes')) {
        // console.log(matches[1]);

        addedCode = `\nconst bridgeGeneratedVariable = initBridge(${matches[1]});\ntype BridgeGenereatedType = typeof bridgeGeneratedVariable['bridgeType'];\n`;

        await fs.promises.appendFile(absolute, addedCode, 'utf-8');

        sourceFilePath = absolute;
        return { sourceFilePath, addedCode };
      }
    }
  }

  return { sourceFilePath, addedCode };
};
