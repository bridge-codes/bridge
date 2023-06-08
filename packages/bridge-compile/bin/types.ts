export const primitives = [
  'string',
  'boolean',
  'true',
  'false',
  'number',
  'Date',
  'File',
  'any',
  'undefined',
  'never',
  'void',
  'null',
  'unknown',
  'nested',
] as const;

export type JSONTypeI =
  | PrimitiveType
  | { record: { key: JSONTypeI; value: JSONTypeI } }
  | { union: JSONTypeI[] }
  | { intersection: JSONTypeI[] }
  | { array: JSONTypeI }
  | { arrayWithPos: JSONTypeI[] }
  | { object: JSONTypeObject };

export const utilityTypes = ['Record', 'Promise'] as const;

export type PrimitiveType = {
  primitive: (typeof primitives)[number] | 'unrecognized';
  value?: string | number | boolean;
};

export type JSONTypeObject = {
  [key: string]: JSONTypeObjectValue;
};

export type JSONTypeObjectValue = JSONTypeI & { optional: boolean };

export interface ReturnBridgeType {
  data: JSONTypeI;
  error: {
    union: {
      object: {
        status: { optional: false; primitive: 'number'; value: number };
        name: { optional: false; primitive: 'string'; value: string };
        data?: { optional: false; primitive: 'any' };
      };
    }[];
  };
}

export type JSONHandlerContent = JSONHandler['object'];

export interface JSONHandler {
  object: {
    body?: { object: JSONTypeObject };
    query?: { object: JSONTypeObject };
    headers?: { object: JSONTypeObject };
    files?: { record: { key: JSONTypeI; value: JSONTypeI } } | { object: JSONTypeObject };
    returnBridgeType: ReturnBridgeType;
  };
}

export interface JSONMethods {
  object: {
    GET_BRIDGE_METHOD?: JSONHandler;
    POST_BRIDGE_METHOD?: JSONHandler;
    PATCH_BRIDGE_METHOD?: JSONHandler;
    PUT_BRIDGE_METHOD?: JSONHandler;
    DELETE_BRIDGE_METHOD?: JSONHandler;
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OPENAPI
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface OpenAPIObject {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}

interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

interface LicenseObject {
  name: string;
  url?: string;
}

interface ServerObject {
  url: string;
  description?: string;
  variables?: { [variable: string]: ServerVariableObject };
}

interface ServerVariableObject {
  enum?: string[];
  default: string;
  description?: string;
}

export interface PathsObject {
  [path: string]: PathItemObject;
}

type PathItemObject = {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
};

export interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject | ReferenceObject;
  responses?: ResponsesObject;
  callbacks?: { [callback: string]: CallbackObject | ReferenceObject };
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
}

interface ParameterObject {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: 'matrix' | 'label' | 'form' | 'simple' | 'spaceDelimited' | 'pipeDelimited' | 'deepObject';
  explode?: boolean;
  allowReserved?: boolean;
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
}

interface RequestBodyObject {
  description?: string;
  content: { [media: string]: MediaTypeObject };
  required?: boolean;
}

interface ResponsesObject {
  [status: string]: ResponseObject | ReferenceObject;
}

interface ResponseObject {
  description: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
  links?: { [link: string]: LinkObject | ReferenceObject };
}

interface CallbackObject {
  [expression: string]: PathItemObject;
}

interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [parameter: string]: any };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

interface HeaderObject extends ParameterObject {}

interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  encoding?: { [media: string]: EncodingObject };
}

interface EncodingObject {
  contentType?: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

export interface SchemaObject {
  nullable?: boolean;
  discriminator?: DiscriminatorObject;
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: XMLObject;
  externalDocs?: ExternalDocumentationObject;
  example?: any;
  deprecated?: boolean;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string';
  items?: SchemaObject | ReferenceObject;
  allOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;
  properties?: { [name: string]: SchemaObject | ReferenceObject };
  additionalProperties?: boolean | SchemaObject | ReferenceObject;
  format?: string;
}

interface DiscriminatorObject {
  propertyName: string;
  mapping?: { [value: string]: string };
}

interface XMLObject {
  name?: string;
  namespace?: string;
  prefix?: string;
  attribute?: boolean;
  wrapped?: boolean;
}

interface SecurityRequirementObject {
  [name: string]: string[];
}

interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

interface ReferenceObject {
  $ref: string;
}

interface ComponentsObject {
  schemas?: { [key: string]: SchemaObject | ReferenceObject };
  responses?: { [key: string]: ResponseObject | ReferenceObject };
  parameters?: { [key: string]: ParameterObject | ReferenceObject };
  examples?: { [key: string]: ExampleObject | ReferenceObject };
  requestBodies?: { [key: string]: RequestBodyObject | ReferenceObject };
  headers?: { [key: string]: HeaderObject | ReferenceObject };
  securitySchemes?: { [key: string]: SecuritySchemeObject | ReferenceObject };
  links?: { [key: string]: LinkObject | ReferenceObject };
  callbacks?: { [key: string]: CallbackObject | ReferenceObject };
}

type SecuritySchemeObject =
  | HttpSecurityScheme
  | ApiKeySecurityScheme
  | OAuth2SecurityScheme
  | OpenIdConnectSecurityScheme;

interface HttpSecurityScheme {
  type: 'http';
  scheme: string;
  bearerFormat?: string;
}

interface ApiKeySecurityScheme {
  type: 'apiKey';
  in: 'query' | 'header' | 'cookie';
  name: string;
}

interface OAuth2SecurityScheme {
  type: 'oauth2';
  flows: OAuthFlowsObject;
}

interface OpenIdConnectSecurityScheme {
  type: 'openIdConnect';
  openIdConnectUrl: string;
}

interface OAuthFlowsObject {
  implicit?: ImplicitOAuthFlowObject;
  password?: PasswordOAuthFlowObject;
  clientCredentials?: ClientCredentialsFlowObject;
  authorizationCode?: AuthorizationCodeOAuthFlowObject;
}

interface ImplicitOAuthFlowObject {
  authorizationUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}

interface PasswordOAuthFlowObject {
  tokenUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}

interface ClientCredentialsFlowObject {
  tokenUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}

interface AuthorizationCodeOAuthFlowObject {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}
