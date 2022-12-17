import { Method } from '../routes';

type AnyObject = Record<any, any>;

/**
 * This is the real data received by the client
 */
export interface HandlerParams {
  body: AnyObject;
  query: AnyObject;
  headers: AnyObject;
  file: AnyObject;
  mid: AnyObject;
  method: Method;
}

export interface Handler {
  setNext(handler: Handler): Handler;

  handle: (p: HandlerParams) => any;
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
}
