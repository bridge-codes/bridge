import { BridgeHandler, handler } from '../core';

export type Method = 'POST' | 'PATCH' | 'GET' | 'DELETE' | 'PUT';

export type BridgeRoutes<Object extends BridgeRoutes = {}> = {
  [key: string]: Object | BridgeHandler | any;
};

export const isBridgeRoutes = (data: any): data is BridgeRoutes => typeof data === 'object';

export interface ServerRoutes {
  [key: string]: {
    endpoint: BridgeHandler;
  };
}

// // We don't need to inject the files types because the compiler can understand by itself its typez
type BridgeHandlerReturnType<H extends BridgeHandler> = H extends BridgeHandler<
  infer ResolveFct,
  infer Middlewares
>
  ? {
      body: Parameters<ResolveFct>[0]['body'];
      query: Parameters<ResolveFct>[0]['query'];
      headers: Parameters<ResolveFct>[0]['headers'];
      return:
        | (ReturnType<ResolveFct> extends Promise<infer RetWithoutPromise>
            ? RetWithoutPromise
            : ReturnType<ResolveFct>)
        | Extract<BridgeHandlerReturnType<Middlewares[number]>['return'], { error: any }>
        | (Parameters<ResolveFct>[0]['body'] extends Record<any, any>
            ? { error: { name: 'Body schema validation error'; status: 422; data: any } }
            : never)
        | (Parameters<ResolveFct>[0]['headers'] extends Record<any, any>
            ? { error: { name: 'Headers schema validation error'; status: 422; data: any } }
            : never)
        | (Parameters<ResolveFct>[0]['query'] extends Record<any, any>
            ? { error: { name: 'Query schema validation error'; status: 422; data: any } }
            : never);
    }
  : {};

export type RoutesToBridgeType<T extends BridgeRoutes> = {
  [key in keyof T]: T[key] extends BridgeHandler
    ? BridgeHandlerReturnType<T[key]>
    : T[key] extends BridgeRoutes
    ? RoutesToBridgeType<T[key]>
    : never;
};
