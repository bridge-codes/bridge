import { ErrorStatus } from './status';

interface Error {
  name: string;
  status: number;
  data?: any;
}

export const isError = (object: any): object is Error =>
  typeof object === 'object' &&
  typeof object.error === 'object' &&
  typeof object.error.name === 'string' &&
  typeof object.error.status === 'number';

/**
 *
 * TO_COMPLETE
 *
 */
export const httpError = <Status extends ErrorStatus, Name extends string, Data>(
  status: Status,
  name: Name,
  data?: Data,
): { error: { name: Name; data?: any; status: Status } } => {
  return { error: { status, name, data } };
};

export * from './listener';
export * from './status';
