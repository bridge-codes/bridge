import { BridgeHandler } from '../core';
import { BridgeMethod } from './method';

export type Method = 'POST' | 'PATCH' | 'GET' | 'DELETE' | 'PUT';

export type BridgeRoutes<Object extends BridgeRoutes = {}> = {
  [key: string]: Object | BridgeHandler | any;
};

export const isBridgeRoutes = (data: any): data is BridgeRoutes => typeof data === 'object';

export interface ServerRoutes {
  [key: string]: {
    GET?: BridgeHandler;
    POST?: BridgeHandler;
    PATCH?: BridgeHandler;
    PUT?: BridgeHandler;
    DELETE?: BridgeHandler;
  };
}

type BridgeHandlerReturnType<H extends BridgeHandler> = H extends BridgeHandler<
  infer ResolveFct,
  infer Middlewares
>
  ? {
      body: Parameters<ResolveFct>[0]['body'];
      query: Parameters<ResolveFct>[0]['query'];
      headers: Parameters<ResolveFct>[0]['headers'];
      files: Parameters<ResolveFct>[0]['files'];
      return:
        | (ReturnType<ResolveFct> extends Promise<infer RetWithoutPromise>
            ? RetWithoutPromise
            : ReturnType<ResolveFct>)
        | Extract<BridgeHandlerReturnType<Middlewares[number]>['return'], { error: any }>
        | (Parameters<ResolveFct>[0]['body'] extends Record<any, any>
            ? { error: { name: 'Body schema validation error'; status: 400; data: any } }
            : never)
        | (Parameters<ResolveFct>[0]['headers'] extends Record<any, any>
            ? { error: { name: 'Headers schema validation error'; status: 400; data: any } }
            : never)
        | (Parameters<ResolveFct>[0]['query'] extends Record<any, any>
            ? { error: { name: 'Query schema validation error'; status: 400; data: any } }
            : never);
    }
  : {};

export type RoutesToBridgeType<T extends BridgeRoutes> = {
  [key in keyof T]: T[key] extends BridgeHandler
    ? BridgeHandlerReturnType<T[key]>
    : T[key] extends BridgeMethod<any, any, any, any, any>
    ? {
        GET_BRIDGE_METHOD: T[key]['type']['getBridgeMehthodSDK'] extends null
          ? null
          : BridgeHandlerReturnType<T[key]['type']['getBridgeMehthodSDK']>;
        POST_BRIDGE_METHOD: T[key]['type']['postBridgeMehthodSDK'] extends null
          ? null
          : BridgeHandlerReturnType<T[key]['type']['postBridgeMehthodSDK']>;
        PATCH_BRIDGE_METHOD: T[key]['type']['patchBridgeMehthodSDK'] extends null
          ? null
          : BridgeHandlerReturnType<T[key]['type']['patchBridgeMehthodSDK']>;
        PUT_BRIDGE_METHOD: T[key]['type']['putBridgeMehthodSDK'] extends null
          ? null
          : BridgeHandlerReturnType<T[key]['type']['putBridgeMehthodSDK']>;
        DELETE_BRIDGE_METHOD: T[key]['type']['deleteBridgeMehthodSDK'] extends null
          ? null
          : BridgeHandlerReturnType<T[key]['type']['deleteBridgeMehthodSDK']>;
      }
    : T[key] extends BridgeRoutes
    ? RoutesToBridgeType<T[key]>
    : never;
};
