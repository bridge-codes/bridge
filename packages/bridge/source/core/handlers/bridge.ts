import { AbstractHandler, Handler } from '../handler';
import { Method } from '../../routes';
import { MiddelwaresHandler } from './middleware';
import { Resolver } from './resolver';
import { MethodValidator } from './methodValidator';
import { DataParser, DataValidator } from './dataValidator';
import { FileConfig, FileValidator } from './fileValidator';

export interface BridgeHandlerDocumentation {
  title?: string;
  text?: string;
}

export class BridgeHandler<
  Resolve extends (...args: any[]) => any = any,
  Middlewares extends ReadonlyArray<BridgeHandler> = any,
> extends AbstractHandler {
  private handler: Handler;
  public resolve: Resolve;

  public constructor(
    public config: {
      resolve: Resolve;
      bodySchema?: DataParser;
      querySchema?: DataParser;
      headersSchema?: DataParser;
      fileConfig?: FileConfig;
      method?: Method;
      middlewares?: Middlewares;
      documentation?: BridgeHandlerDocumentation; // NEED TO INFER FROM DATA TO DOCUMENTATE PARAMS
    },
  ) {
    super();

    this.resolve = config.resolve;

    if (config.bodySchema && config.method === 'GET')
      throw new Error("You can't have a body with a GET endpoint.");

    if (config.bodySchema && config.fileConfig)
      throw new Error("You can't get a JSON body and files in the same endpoint.");

    const firstHandler: Handler = new MethodValidator(config.method);

    let handler = firstHandler;

    if (config.bodySchema) handler = handler.setNext(new DataValidator(config.bodySchema, 'body'));
    if (config.querySchema)
      handler = handler.setNext(new DataValidator(config.querySchema, 'query'));
    if (config.headersSchema)
      handler = handler.setNext(new DataValidator(config.headersSchema, 'headers'));
    if (config.fileConfig) handler = handler.setNext(new FileValidator(config.fileConfig));

    if (config.middlewares) handler = handler.setNext(new MiddelwaresHandler(config.middlewares));

    handler = handler.setNext(new Resolver(config.resolve));

    this.handler = firstHandler;
  }

  /**
   *
   * If the middleware returns an error, we stop the chain and return it
   * otherwise we add the result in the mid data of the next handler
   * If there is no next handler, we return the last result
   */
  public handle: Handler['handle'] = async (data) => {
    const res = await this.handler.handle(data);

    if (res && res.error) return res;

    data.mid = { ...res, ...data.mid };

    if (this.nextHandler) return this.nextHandler.handle(data);

    return res;
  };
}

export const isBridgeHandler = (data: any): data is BridgeHandler =>
  data &&
  typeof data === 'object' &&
  typeof data.handler === 'object' &&
  typeof data.handle === 'function' &&
  typeof data.config === 'object' &&
  typeof data.config.resolve === 'function';
