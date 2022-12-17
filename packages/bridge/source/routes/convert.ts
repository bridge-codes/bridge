import { BridgeRoutes, ServerRoutes, isBridgeRoutes } from './types';
import { handler, isBridgeHandler } from '../core';
import { httpError, StatusCode } from '../error';

const defaultServerRoutes: ServerRoutes = {
  'not-found': {
    endpoint: handler({
      resolve: () => httpError(StatusCode.NOT_FOUND, 'Root not found'),
    }),
  },
};

const serverRoutes: ServerRoutes = {};

export const convertBridgeRoutesToServerRoutes = (
  routes: BridgeRoutes,
  prefix = '',
): ServerRoutes => {
  for (const [key, value] of Object.entries(routes)) {
    if (!value) continue;
    else if (isBridgeHandler(value)) serverRoutes[`${prefix}/${key}`] = { endpoint: value };
    else if (isBridgeRoutes(value)) convertBridgeRoutesToServerRoutes(value, `${prefix}/${key}`);
  }

  return { ...defaultServerRoutes, ...serverRoutes };
};
