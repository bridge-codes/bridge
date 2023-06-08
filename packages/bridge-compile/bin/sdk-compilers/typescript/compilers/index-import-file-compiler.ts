import { BridgeRoutesTree } from '../../utils';

export const getIndexTSFileContent = (
  root: BridgeRoutesTree,
  path: string[] = []
): { importsString: string; exportAPIStringObject: string } => {
  let exportAPIStringObject = '{';
  let importsString = '';

  for (const [key, value] of Object.entries(root)) {
    if (value === 'handler') {
      importsString += `import ${path.join('').replaceAll('-', '')}${key} from "./${path.join('/')}/${key}";\n`;
      exportAPIStringObject += `${key}: ${path.join('').replaceAll('-', '')}${key},`;
    } else {
      exportAPIStringObject += `${key.replaceAll('-', '')}:`;
      const res = getIndexTSFileContent(value, [...path, key]);
      importsString += res.importsString;
      exportAPIStringObject += res.exportAPIStringObject;
    }
  }

  exportAPIStringObject += '},';

  return { importsString, exportAPIStringObject };
};
