// This code was strongly inspired from @trpc/server

import { httpError, StatusCode } from '../../error';
import { AbstractHandler, Handler } from '../handler';

type YupParser<T = any> = { validateSync: (input: unknown) => T };
type SuperstructParser<T = any> = { create: (input: unknown) => T };
type ZodParser<T = any> = { parse: (input: any) => T };

export type DataParser<T = any> = YupParser<T> | ZodParser<T> | SuperstructParser<T>;

export type InferDataParser<Val extends DataParser> = Val extends DataParser<infer Output>
  ? Output
  : any;

export const isZodParser = (parser: any): parser is ZodParser =>
  typeof parser?.safeParse === 'function';

/**
 *  This handler is used to validate data from the body, the
 */
export class DataValidator<Output = any> extends AbstractHandler {
  public output!: Output;

  constructor(
    private parser: DataParser<Output>,
    private dataToValidate: 'body' | 'query' | 'headers',
  ) {
    super();
  }

  private isYupParser = (parser: any): parser is YupParser =>
    typeof parser.validateSync === 'function';

  private isSuperstructParser = (parser: any): parser is SuperstructParser =>
    typeof parser.create === 'function';

  private isZodParser = (parser: any): parser is ZodParser =>
    typeof parser.safeParse === 'function';

  public handle: Handler['handle'] = async (data) => {
    try {
      if (this.isYupParser(this.parser)) this.parser.validateSync(data[this.dataToValidate]);
      else if (this.isZodParser(this.parser)) this.parser.parse(data[this.dataToValidate]);
      else if (this.isSuperstructParser(this.parser)) this.parser.create(data[this.dataToValidate]);

      return super.handle(data);
    } catch (error) {
      switch (this.dataToValidate) {
        case 'body':
          return httpError(StatusCode.UNPROCESSABLE_ENTITY, `Body schema validation error`, error);
        case 'query':
          return httpError(
            StatusCode.UNPROCESSABLE_ENTITY,
            `Parameters schema validation error`,
            error,
          );
        case 'headers':
          return httpError(
            StatusCode.UNPROCESSABLE_ENTITY,
            `Headers schema validation error`,
            error,
          );
      }
    }
  };
}
