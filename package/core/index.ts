import { CreateHandler } from './types';
import { BridgeHandler } from './handlers';

// This is a BridgeHandler
export const handler: CreateHandler = (routeParams) => {
  return new BridgeHandler({
    bodySchema: routeParams.body,
    querySchema: routeParams.query,
    headersSchema: routeParams.headers,
    fileConfig: routeParams.file,
    method: routeParams.method,
    middlewares: routeParams.middlewares,
    documentation: routeParams.documentation,
    resolve: routeParams.resolve,
  });
};

export * from './types';
export * from './handlers';
export * from './handler';
