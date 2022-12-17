import { Method } from '../../routes';
import { AbstractHandler, Handler } from '../handler';
import { httpError, StatusCode } from '../../error';

export class MethodValidator extends AbstractHandler {
  constructor(private method?: Method) {
    super();
  }

  public handle: Handler['handle'] = async (data) => {
    if (!this.method || data.method === this.method) return super.handle(data);

    return httpError(StatusCode.METHOD_NOT_ALLOWED, 'Wrong method', { method: this.method });
  };
}
