import { Handler, AbstractHandler } from '../handler';
import { isBridgeError } from '../../error';

export class MiddelwaresHandler extends AbstractHandler {
  constructor(private handlers: ReadonlyArray<Handler>) {
    super();
  }

  public handle: Handler['handle'] = async (data) => {
    // All the middlewares are executed simultaneously
    const results = await Promise.all(this.handlers.map(async (handler) => handler.handle(data)));

    // If one middleware returns an error, we directly return the error to the client
    for (const result of results) if (isBridgeError(result)) return result;

    return super.handle({ ...data, middlewares: Object.assign({}, ...results) });
  };
}
