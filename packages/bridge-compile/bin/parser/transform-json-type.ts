import { JSONTypeI, JSONTypeObject } from '../types';

interface ReturnBridgeType {
  data: JSONTypeI;
  error: {
    union: JSONTypeI[];
  };
}

interface JSONHandler {
  object: {
    body: { object: JSONTypeObject; optional: boolean } | { primitive: 'unknown'; optional: boolean };
    query: { object: JSONTypeObject; optional: boolean } | { primitive: 'unknown'; optional: boolean };
    headers: { object: JSONTypeObject; optional: boolean } | { primitive: 'unknown'; optional: boolean };
    files:
      | (({ record: { key: JSONTypeI; value: JSONTypeI } } | { object: JSONTypeObject }) & {
          optional: boolean;
        })
      | { primitive: 'unknown'; optional: boolean };
    return: JSONTypeI & { optional: boolean };
    returnBridgeType?: ReturnBridgeType;
  };
}

const isHandler = (data: any): data is JSONHandler =>
  'object' in data &&
  'body' in data.object &&
  'query' in data.object &&
  'headers' in data.object &&
  'files' in data.object &&
  'return' in data.object;

const isError = (data: any): data is { object: { error: { object: { name: any; status: any } } } } =>
  'object' in data &&
  'error' in data.object &&
  'object' in data.object.error &&
  'name' in data.object.error.object &&
  'status' in data.object.error.object;

export const hasHandlers = (JSONType: JSONTypeI) => {
  if (!('object' in JSONType)) return false;

  if (isHandler(JSONType)) return true;
  else {
    for (const value of Object.values(JSONType.object)) if (hasHandlers(value)) return true;
    return false;
  }
};

export const cleanJSONType = (JSONType: JSONTypeI): JSONTypeI => {
  const newJSONType: JSONTypeI = { object: {} };

  if ('object' in JSONType)
    Object.entries(JSONType.object).forEach(([key, value]) => {
      if (!hasHandlers(value)) return;

      if (isHandler(value)) {
        // We don't need the optional value
        delete (value as any).optional;

        // Removing unknown parameters
        for (const param of ['body', 'query', 'headers', 'files'] as const) {
          // We don't need the optional value
          delete (value.object[param] as any).optional;

          if (
            param in value.object &&
            'primitive' in value.object[param] &&
            (value.object[param] as any).primitive === 'unknown'
          )
            delete value.object[param];

          if (param in value.object) {
            if ('primitive' in value.object[param] && (value.object[param] as any).primitive === 'unknown')
              delete value.object[param];

            if (
              'intersection' in value.object[param] &&
              (value.object[param] as any).intersection.every((item: JSONTypeI) => 'object' in item)
            ) {
              const newObjectParam: any = { object: {} };
              (value.object[param] as any).intersection.forEach((item: any) => {
                newObjectParam.object = { ...newObjectParam.object, ...item.object };
              });
              value.object[param] = newObjectParam;
            }
          }
        }

        if (!('union' in value.object.return)) {
          if ('primitive' in value.object.return && value.object.return.primitive === 'void')
            value.object.returnBridgeType = { data: { object: {} }, error: { union: [] } };
          else value.object.returnBridgeType = { data: value.object.return, error: { union: [] } };
        }

        // With union in return
        else {
          const errors: JSONTypeI[] = [];
          const success: JSONTypeI[] = [];
          for (const returnVal of value.object.return.union) {
            if (isError(returnVal)) errors.push(returnVal.object.error);
            else {
              // console.log(returnVal);
              // if the handlers returns void, Bridge returns an empty object instead
              if ('primitive' in returnVal && returnVal.primitive === 'void') success.push({ object: {} });
              else success.push(returnVal);
            }
          }

          value.object.returnBridgeType = {
            data: success.length === 1 ? success[0] : { union: success },
            error: { union: errors },
          };
        }

        delete (value.object as any).return;

        newJSONType.object[key] = value;
      } else {
        newJSONType.object[key] = cleanJSONType(value) as any;
      }
    });

  return newJSONType;
};
