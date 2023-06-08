import { JSONHandler, JSONMethods, JSONTypeI, JSONHandlerContent, JSONTypeObject } from './types';
import { PathsObject, OperationObject, SchemaObject } from './types';
import { descriptionOfStatusCode, methodConvertor } from './utils';

const isJSONHandler = (data: any): data is JSONHandler =>
  'object' in data && 'returnBridgeType' in data.object && 'data' in data.object.returnBridgeType;

const isJSONMethods = (data: any): data is JSONMethods =>
  'object' in data &&
  (('GET_BRIDGE_METHOD' in data.object && isJSONHandler(data.object.GET_BRIDGE_METHOD)) ||
    ('POST_BRIDGE_METHOD' in data.object && isJSONHandler(data.object.POST_BRIDGE_METHOD)) ||
    ('PATCH_BRIDGE_METHOD' in data.object && isJSONHandler(data.object.PATCH_BRIDGE_METHOD)) ||
    ('PUT_BRIDGE_METHOD' in data.object && isJSONHandler(data.object.PUT_BRIDGE_METHOD)) ||
    ('DELETE_BRIDGE_METHOD' in data.object && isJSONHandler(data.object.DELETE_BRIDGE_METHOD)));

function convertJSONTypeToSchemaObject(jsonType: JSONTypeI): SchemaObject {
  if ('primitive' in jsonType) {
    let schema: SchemaObject = {};
    if (jsonType.value) schema.enum = [jsonType.value];

    if (jsonType.primitive === 'string') schema.type = 'string';
    if (jsonType.primitive === 'Date') {
      schema.type = 'string';
      schema.format = 'date';
    } else if (jsonType.primitive === 'number') schema.type = 'number';
    else if (jsonType.primitive === 'boolean') schema.type = 'boolean';
    else if (jsonType.primitive === 'true') {
      schema.type = 'boolean';
      schema.enum = ['true'];
    } else if (jsonType.primitive === 'false') {
      schema.type = 'boolean';
      schema.enum = ['false'];
    } else if (jsonType.primitive === 'any' || jsonType.primitive === 'nested') schema = {};
    return schema;
  } else if ('record' in jsonType) {
    return {
      type: 'object',
      additionalProperties: convertJSONTypeToSchemaObject(jsonType.record.value),
    };
  } else if ('union' in jsonType) {
    if (jsonType.union.length > 0 && jsonType.union.every((item) => 'value' in item && 'primitive' in item))
      return {
        type: (jsonType.union[0] as any).primitive,
        enum: jsonType.union.map((item: any) => item.value),
      };

    if (jsonType.union.length === 1) return convertJSONTypeToSchemaObject(jsonType.union[0]);

    return {
      anyOf: jsonType.union.map(convertJSONTypeToSchemaObject),
    };
  } else if ('intersection' in jsonType) {
    return {
      allOf: jsonType.intersection.map(convertJSONTypeToSchemaObject),
    };
  } else if ('array' in jsonType) {
    return {
      type: 'array',
      items: convertJSONTypeToSchemaObject(jsonType.array),
    };
  } else if ('arrayWithPos' in jsonType) {
    return {
      type: 'array',
      items: {
        anyOf: jsonType.arrayWithPos.map(convertJSONTypeToSchemaObject),
      },
    };
  } else if ('object' in jsonType) {
    return {
      type: 'object',
      required: Object.entries(jsonType.object)
        .map(([key, val]) => (val.optional === false ? key : ''))
        .filter((val) => val !== ''),
      properties: Object.entries(jsonType.object).reduce((properties, [key, value]) => {
        properties[key] = {
          ...convertJSONTypeToSchemaObject(value),
          nullable: value.optional ? true : undefined,
        };
        return properties;
      }, {} as { [key: string]: SchemaObject }),
    };
  }

  return {};
  //   throw new Error('Invalid JSONTypeI');
}

const convertJSONTypeRequestToPathObject = (jsonHandler: JSONHandlerContent): OperationObject => {
  const operationObject: any = {
    parameters: [],
    responses: {
      '200': {
        description: 'Success',
        content: {
          'application/json': {
            schema: convertJSONTypeToSchemaObject(jsonHandler.returnBridgeType.data),
          },
        },
      },
    },
  };

  const errorsFormated: Record<string, any> = {};

  jsonHandler.returnBridgeType.error.union.forEach((error) => {
    const statusCode = (error.object.status.value || 500).toString();

    if (!errorsFormated[statusCode]) errorsFormated[statusCode] = error;
    else if ('union' in errorsFormated[statusCode].object.name)
      if (!errorsFormated[statusCode].object.name.union.includes(error.object.name)) {
        errorsFormated[statusCode].object.name.union.push(error.object.name);
      } else
        errorsFormated[statusCode].object.name = { union: [errorsFormated[statusCode].object.name, error.object.name] };
  });

  for (const [status, error] of Object.entries(errorsFormated)) {
    operationObject.responses[status] = {
      description: descriptionOfStatusCode[status] || 'error',
      content: {
        'application/json': {
          schema: convertJSONTypeToSchemaObject(error),
        },
      },
    };
  }

  if (jsonHandler.body)
    operationObject.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: convertJSONTypeToSchemaObject(jsonHandler.body),
        },
      },
    };

  if (jsonHandler.files && 'record' in jsonHandler.files)
    operationObject.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
            required: ['file'],
          },
        },
      },
    };

  if (jsonHandler.files && 'object' in jsonHandler.files) {
    const filesName = Object.keys(jsonHandler.files.object);

    const properties: any = {};

    filesName.forEach((fileName) => {
      properties[fileName] = {
        type: 'string',
        format: 'binary',
      };
    });

    operationObject.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties,
            required: ['file'],
          },
        },
      },
    };
  }

  if (jsonHandler.query)
    operationObject.parameters.push(
      ...Object.entries(jsonHandler.query.object).map(([key, val]) => ({
        name: key,
        in: 'query',
        required: !val.optional,
        schema: { type: 'string' },
        description: '',
      }))
    );

  if (jsonHandler.headers)
    operationObject.parameters.push(
      ...Object.entries(jsonHandler.headers.object).map(([key, val]) => ({
        name: key,
        in: 'header',
        required: !val.optional,
        schema: { type: 'string' },
        description: '',
      }))
    );

  return operationObject;
};

export const convertJSONTypeObjectToOpenAPIPath = (jsonTypeObject: JSONTypeObject): PathsObject => {
  const paths: PathsObject = {};

  for (const [key, value] of Object.entries(jsonTypeObject)) {
    if (!('object' in value)) continue;

    if (isJSONMethods(value)) {
      for (const [method, jsonHandler] of Object.entries(value.object)) {
        if (Object.keys(methodConvertor).includes(method as keyof typeof methodConvertor)) {
          paths[`/${key}`] = {
            [methodConvertor[method as keyof typeof methodConvertor]]: convertJSONTypeRequestToPathObject(
              (jsonHandler as any).object
            ),
          };
        }
      }
    } else if (isJSONHandler(value))
      paths[`/${key}`] = { post: convertJSONTypeRequestToPathObject((value as any).object) };
    else {
      const subPath = convertJSONTypeObjectToOpenAPIPath((value as any).object);
      for (const [subKey, subValue] of Object.entries(subPath)) paths[`/${key}${subKey}`] = subValue;
    }
  }

  return paths;
};
