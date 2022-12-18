import { BridgeRoutes } from './routes';
import { ErrorHandler } from './error';
import { RoutesToBridgeType } from './routes';
import type * as express from 'express';
import { createHttpHandler } from './server/adapters/node-http';
import http from 'http';

class Bridge<Routes extends BridgeRoutes, URL extends string> {
  public bridgeType!: RoutesToBridgeType<Routes>;

  constructor(
    public routes: Routes,
    private config: { errorHandler?: ErrorHandler; formidable?: any },
    public url: URL,
  ) {}

  public expressMiddleware = (): express.Handler => createHttpHandler(this.routes, this.config);

  public HTTPServer = () => http.createServer(createHttpHandler(this.routes, this.config));
}

export const initBridge = <Routes extends BridgeRoutes, URL extends string>({
  routes,
  url,
  errorHandler,
  formidable,
}: {
  routes: Routes;
  url?: URL;
  formidable?: any;
  errorHandler?: ErrorHandler;
}): Bridge<Routes, URL> => new Bridge(routes, { formidable, errorHandler }, url as any);
