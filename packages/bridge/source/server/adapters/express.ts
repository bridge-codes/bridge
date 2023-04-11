import { BridgeRoutes } from '../../routes';
import { ErrorHandler } from '../../error';
import type * as express from 'express';

import { createHttpHandler } from './node-http';

export const createExpressMiddleware = (
  routes: BridgeRoutes,
  config?: { errorHandler?: ErrorHandler; formidable?: any; logs?: boolean },
): express.Handler => createHttpHandler(routes, config);
