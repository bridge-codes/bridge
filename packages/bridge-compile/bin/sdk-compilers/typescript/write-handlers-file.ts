import { writeFileAsync, mkdirAsync } from '../../utils';
import { JSONTypeI } from '../../types';
import { BridgeRoutesTree, isHandler } from '../utils';
import { getHandlerTSFileContent } from './compilers/handler-file-compiler';

const handlerNameToMethod: Record<string, 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'> = {
  GET_BRIDGE_METHOD: 'GET',
  POST_BRIDGE_METHOD: 'POST',
  PATCH_BRIDGE_METHOD: 'PATCH',
  PUT_BRIDGE_METHOD: 'PUT',
  DELETE_BRIDGE_METHOD: 'DELETE',
};

const handlerNameToFunctionName: Record<string, 'get' | 'post' | 'put' | 'patch' | 'delete'> = {
  GET_BRIDGE_METHOD: 'get',
  POST_BRIDGE_METHOD: 'post',
  PATCH_BRIDGE_METHOD: 'patch',
  PUT_BRIDGE_METHOD: 'put',
  DELETE_BRIDGE_METHOD: 'delete',
};

export const writeHandlersFilesAndFolders = async (
  JSONType: JSONTypeI,
  filePath: string,
  routesTree: BridgeRoutesTree,
  pathArray: string[] = []
): Promise<BridgeRoutesTree> => {
  if (!('object' in JSONType)) return routesTree;

  const promises: Promise<any>[] = [];

  for (const [key, value] of Object.entries(JSONType.object)) {
    if (!('object' in value)) return routesTree;

    if (isHandler(value)) {
      const method = handlerNameToMethod[key] || 'POST';
      const newKey = handlerNameToFunctionName[key] || key;
      const newPathArray = newKey !== key ? [...pathArray] : [...pathArray, newKey];

      promises.push(
        writeFileAsync(
          `${filePath}/${newKey}.ts`,
          getHandlerTSFileContent(value, newPathArray, pathArray.length, method)
        )
      );
      routesTree[newKey] = 'handler';
    } else {
      promises.push(
        mkdirAsync(`${filePath}/${key}`).then(async () => {
          routesTree[key] = await writeHandlersFilesAndFolders(value, `${filePath}/${key}`, {}, [...pathArray, key]);
        })
      );
    }
  }

  await Promise.all(promises);

  return routesTree;
};
