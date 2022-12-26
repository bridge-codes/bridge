import { BridgeRoutes, ServerRoutes, isBridgeRoutes } from './types';
import { isBridgeHandler } from '../core';
import { isBridgeMethod } from './method';

const serverRoutes: ServerRoutes = {};

export const convertBridgeRoutesToServerRoutes = (
  routes: BridgeRoutes,
  prefix = '',
): ServerRoutes => {
  for (const [key, value] of Object.entries(routes)) {
    if (!value) continue;
    else if (isBridgeMethod(value)) serverRoutes[`${prefix}/${key}`] = value.methods;
    else if (isBridgeHandler(value)) serverRoutes[`${prefix}/${key}`] = { POST: value };
    else if (isBridgeRoutes(value)) convertBridgeRoutesToServerRoutes(value, `${prefix}/${key}`);
  }

  return serverRoutes;
};
