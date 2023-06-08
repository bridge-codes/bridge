import { JSONTypeI, JSONTypeObject } from '../types';

export interface JSONHandler {
  object: {
    body?: { object: JSONTypeObject; optional: boolean };
    query?: { object: JSONTypeObject; optional: boolean };
    headers?: { object: JSONTypeObject; optional: boolean };
    files?: ({ record: { key: JSONTypeI; value: JSONTypeI } } | { object: JSONTypeObject }) & { optional: boolean };
    returnBridgeType: { data: JSONTypeI; error: { union: JSONTypeI[] } };
  };
}

export type BridgeRoutesTree = { [key: string]: 'handler' | BridgeRoutesTree };

export const isHandler = (data: any): data is JSONHandler => {
  return 'object' in data && 'returnBridgeType' in data.object && 'data' in data.object.returnBridgeType;
};

const params = ['body', 'query', 'headers', 'files'] as const;

function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const internalSeverError = {
  object: {
    name: {
      optional: false,
      primitive: 'string',
      value: 'Internal Server Error',
    },
    status: {
      optional: false,
      primitive: 'number',
      value: 500,
    },
  },
} as const;

/**
 * TO-DO
 * - [ ] missingFiles: string[]
 */
const getParamError = (param: (typeof params)[number]) =>
  ({
    object: {
      name: {
        optional: false,
        primitive: 'string',
        value: `${capitalizeFirstLetter(param)} schema validation error`,
      },
      status: {
        optional: false,
        primitive: 'number',
        value: 400,
      },
      data: {
        optional: false,
        primitive: 'any',
      },
    },
  } as const);

export const formatReturnTypeJSON = (jsonHandler: JSONHandler, additionalErrors: JSONTypeI[] = []): JSONTypeI => {
  const errors = jsonHandler.object.returnBridgeType.error.union;
  const data = jsonHandler.object.returnBridgeType.data;

  // adding errors from specific client library
  errors.push(...additionalErrors);

  // adding internal server error
  errors.push(internalSeverError);

  // adding errors from parameters
  for (const param of params) if (jsonHandler.object[param]) errors.push(getParamError(param));

  return {
    union: [
      { object: { data: { optional: false, ...data }, error: { optional: false, primitive: 'undefined' } } },
      { object: { data: { optional: false, primitive: 'undefined' }, error: { optional: false, union: errors } } },
    ],
  };
};
