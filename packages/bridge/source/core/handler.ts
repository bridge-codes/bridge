type AnyObject = Record<any, any>;

/**
 * This is the real data received by the client
 */
export interface HandlerParams {
  body: AnyObject;
  query: AnyObject;
  headers: AnyObject;
  files: AnyObject;
  middlewares: AnyObject;
}

export interface Handler {
  setNext(handler: Handler): Handler;

  handle: (p: HandlerParams) => any;

  getNextHandler: () => Handler | undefined;
}

export abstract class AbstractHandler implements Handler {
  protected nextHandler: Handler | undefined;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;

    return handler;
  }

  public async handle(data: HandlerParams) {
    if (this.nextHandler) return this.nextHandler.handle(data);
    return data;
  }

  public getNextHandler = () => this.nextHandler;
}

export class FirstHandler extends AbstractHandler {}
