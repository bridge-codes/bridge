import { AbstractHandler, Handler, FirstHandler } from '../handler';
import { MiddelwaresHandler } from './middleware';
import { Resolver } from './resolver';
import { DataParser, DataValidator } from './data-validator';
import { FilesConfig, FileValidator } from './file-validator';

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
      filesConfig?: FilesConfig;
      middlewares?: Middlewares;
      // documentation?: BridgeHandlerDocumentation; // NEED TO INFER FROM DATA TO DOCUMENTATE PARAMS
    },
  ) {
    super();

    this.resolve = config.resolve;

    if (config.bodySchema && config.filesConfig)
      throw Error("You can't get a JSON body and files in the same endpoint.");

    const firstHandler: Handler = new FirstHandler();

    let handler = firstHandler;

    if (config.bodySchema) handler = handler.setNext(new DataValidator(config.bodySchema, 'body'));
    if (config.querySchema)
      handler = handler.setNext(new DataValidator(config.querySchema, 'query'));
    if (config.headersSchema)
      handler = handler.setNext(new DataValidator(config.headersSchema, 'headers'));
    if (config.filesConfig) handler = handler.setNext(new FileValidator(config.filesConfig));

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

    data.middlewares = { ...res, ...data.middlewares };

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
