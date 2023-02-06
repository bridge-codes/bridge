import { BridgeRoutes, ServerRoutes, isBridgeRoutes } from './types';
import { isBridgeHandler } from '../core';
import { isBridgeMethod } from './method';

const serverRoutes: ServerRoutes = {};

export const convertBridgeRoutesToServerRoutes = (
  routes: BridgeRoutes,
  prefix: string,
  hasFormidable: boolean,
): ServerRoutes => {
  for (const [key, value] of Object.entries(routes)) {
    if (!value) continue;
    else if (isBridgeMethod(value)) {
      serverRoutes[`${prefix}/${key}`] = value.methods;
      Object.values(value.methods).forEach((handler) => {
        if (handler.config.filesConfig && !hasFormidable)
          throw new Error(
            `You need to install formidable and to give it to Bridge in order to use files.`,
          );
      });
    } else if (isBridgeHandler(value)) {
      serverRoutes[`${prefix}/${key}`] = { POST: value };
      if (value.config.filesConfig && !hasFormidable)
        throw new Error(
          `You need to install formidable and pass it to the initBridge function in order to use files.
          \nCheck the documentation: https://bridge.codes/docs/file \n`,
        );
    } else if (isBridgeRoutes(value))
      convertBridgeRoutesToServerRoutes(value, `${prefix}/${key}`, hasFormidable);
  }

  return serverRoutes;
};
