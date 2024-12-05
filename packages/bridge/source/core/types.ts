import { ExcludeNeverKeysObj, Pretify } from '../utilities';
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

type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

// Generic type to get the intersection of return types of an array of BridgeHandler
type IntersecOfResolveReturnTypesWithoutError<T extends Readonly<BridgeHandler<any, any>[]>> =
  T extends Readonly<BridgeHandler<infer F, any>[]>
    ? Omit<UnionToIntersection<ReturnTypeOf<F>>, 'error'>
    : never;

type MidParams<T extends Readonly<BridgeHandler<any, any>[]>> = T extends Readonly<
  BridgeHandler<infer F, any>[]
>
  ? Parameters<F>[number] & { body: {}; query: {}; headers: {} }
  : never;

export type CreateHandler = <
  Resolve extends (
    p: Pretify<
      ExcludeNeverKeysObj<{
        middlewares: Pretify<IntersecOfResolveReturnTypesWithoutError<Middelwares>>;
        body: Pretify<
          (InferDataParser<Body> extends never ? {} : InferDataParser<Body>) &
            (MidParams<Middelwares>['body'] extends never ? {} : MidParams<Middelwares>['body'])
        >;
        query: Pretify<
          (InferDataParser<Query> extends never ? {} : InferDataParser<Query>) &
            (MidParams<Middelwares>['query'] extends never ? {} : MidParams<Middelwares>['query'])
        >;
        headers: Pretify<
          (InferDataParser<Headers> extends never ? {} : InferDataParser<Headers>) &
            (MidParams<Middelwares>['headers'] extends never
              ? {}
              : MidParams<Middelwares>['headers'])
        >;
        files: Pretify<
          Files extends ['BridgeFilesDoNotExists']
            ? {}
            : Files extends 'any'
            ? { [key: string]: FormidableFile[] }
            : { [key in Files[number]]: FormidableFile[] }
        >;
      }>
    >,
  ) => Res,
  Res,
  Body extends DataParser<Record<any, any>> = never,
  Query extends DataParser<Record<string, any>> = never,
  Headers extends DataParser<Record<string, any>> = never,
  Files extends FilesConfig = ['BridgeFilesDoNotExists'],
  Middelwares extends ReadonlyArray<BridgeHandler> = never,
>(
  p: BridgeParams<Resolve, Middelwares, Body, Query, Headers, Files>,
) => BridgeHandler<Resolve, Middelwares>;
