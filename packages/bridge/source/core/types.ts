import { KeysWithValNotEmptyObject, MidsReturnsIntersection, MidsParams } from '../utilities';
import { DataParser, BridgeHandler, InferDataParser, FilesConfig } from './handlers';
import { FormidableFile } from '../utilities';

export interface BridgeParams<
  Resolve = any,
  Middlewares extends ReadonlyArray<BridgeHandler<(p: any) => Record<any, any>>> = never,
  Body extends DataParser<Record<any, any>> = never,
  Query extends DataParser<Record<any, any>> = never,
  Headers extends DataParser<Record<any, any>> = never,
  Files extends FilesConfig = ['BridgeFilesDoNotExists'],
> {
  resolve: Resolve;
  middlewares?: Middlewares;
  body?: Body /** Can't have a body with GET method or with files, an error is throw if ther developer tries to, but the type here doesnt block to keep a clean UI */;
  query?: Query;
  headers?: Headers;
  files?: Files;
}

export type CreateHandler = <
  Resolve extends (p: {
    [key in KeysWithValNotEmptyObject<{
      middlewares: MidsReturnsIntersection<Middelwares> extends never
        ? {}
        : MidsReturnsIntersection<Middelwares>;
      body: (InferDataParser<Body> extends never ? {} : InferDataParser<Body>) &
        (MidsParams<Middelwares>['body'] extends never ? {} : MidsParams<Middelwares>['body']);
      query: (InferDataParser<Query> extends never ? {} : InferDataParser<Query>) &
        (MidsParams<Middelwares>['query'] extends never ? {} : MidsParams<Middelwares>['query']);
      headers: (InferDataParser<Headers> extends never ? {} : InferDataParser<Headers>) &
        (MidsParams<Middelwares>['headers'] extends never
          ? {}
          : MidsParams<Middelwares>['headers']);
      files: Files extends ['BridgeFilesDoNotExists']
        ? {}
        : Files extends 'any'
        ? { [key: string]: FormidableFile }
        : { [key in Files[number]]: FormidableFile };
    }> &
      keyof {
        middlewares: MidsReturnsIntersection<Middelwares> extends never
          ? {}
          : MidsReturnsIntersection<Middelwares>;
        body: (InferDataParser<Body> extends never ? {} : InferDataParser<Body>) &
          (MidsParams<Middelwares>['body'] extends never ? {} : MidsParams<Middelwares>['body']);
        query: (InferDataParser<Query> extends never ? {} : InferDataParser<Query>) &
          (MidsParams<Middelwares>['query'] extends never ? {} : MidsParams<Middelwares>['query']);
        headers: (InferDataParser<Headers> extends never ? {} : InferDataParser<Headers>) &
          (MidsParams<Middelwares>['headers'] extends never
            ? {}
            : MidsParams<Middelwares>['headers']);
        files: Files extends ['BridgeFilesDoNotExists']
          ? {}
          : Files extends 'any'
          ? { [key: string]: FormidableFile }
          : { [key in Files[number]]: FormidableFile };
      }]: {
      middlewares: MidsReturnsIntersection<Middelwares> extends never
        ? {}
        : MidsReturnsIntersection<Middelwares>;
      body: (InferDataParser<Body> extends never ? {} : InferDataParser<Body>) &
        (MidsParams<Middelwares>['body'] extends never ? {} : MidsParams<Middelwares>['body']);
      query: (InferDataParser<Query> extends never ? {} : InferDataParser<Query>) &
        (MidsParams<Middelwares>['query'] extends never ? {} : MidsParams<Middelwares>['query']);
      headers: (InferDataParser<Headers> extends never ? {} : InferDataParser<Headers>) &
        (MidsParams<Middelwares>['headers'] extends never
          ? {}
          : MidsParams<Middelwares>['headers']);
      files: Files extends ['BridgeFilesDoNotExists']
        ? {}
        : Files extends 'any'
        ? { [key: string]: FormidableFile }
        : { [key in Files[number]]: FormidableFile };
    }[key];
  }) => Res,
  Res,
  Body extends DataParser<Record<any, any>> = never,
  Query extends DataParser<Record<string, any>> = never,
  Headers extends DataParser<Record<string, any>> = never,
  Files extends FilesConfig = ['BridgeFilesDoNotExists'],
  Middelwares extends ReadonlyArray<BridgeHandler> = never,
>(
  p: BridgeParams<Resolve, Middelwares, Body, Query, Headers, Files>,
) => BridgeHandler<Resolve, Middelwares>;
