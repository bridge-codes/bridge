import { AbstractHandler, Handler, HandlerParams } from '../handler';

export class Resolver extends AbstractHandler {
  public isResolver = true;

  constructor(private resolve: (p: HandlerParams) => any) {
    super();
  }

  public handle: Handler['handle'] = async (data) => this.resolve(data);
}
