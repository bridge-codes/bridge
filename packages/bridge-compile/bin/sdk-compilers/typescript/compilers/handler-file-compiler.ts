import { JSONTypeToTSInterface } from '../json-type-to-ts-interface';
import prettier from 'prettier';
import { JSONHandler, formatReturnTypeJSON } from '../../utils';

const axiosError = {
  object: {
    name: {
      optional: false,
      primitive: 'string',
      value: 'Axios Error',
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
} as const;

export const getHandlerTSFileContent = (
  handler: JSONHandler,
  pathArray: string[],
  depth: number,
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
): string => {
  const bodyInterface = handler.object.body === undefined ? undefined : JSONTypeToTSInterface(handler.object.body);
  const queryInterface = handler.object.query === undefined ? undefined : JSONTypeToTSInterface(handler.object.query);
  const headersInterface =
    handler.object.headers === undefined ? undefined : JSONTypeToTSInterface(handler.object.headers);
  const filesInterface =
    handler.object.files === undefined
      ? undefined
      : 'record' in handler.object.files
      ? `Record<string, File | Buffer>`
      : `{${Object.keys(handler.object.files.object)
          .map((key) => `${key}: File | Buffer`)
          .join(';')}}`;

  const returnInterface = JSONTypeToTSInterface(formatReturnTypeJSON(handler, [axiosError]));

  const hasParameters = bodyInterface || queryInterface || headersInterface || filesInterface;

  let importFetch = './';
  if (depth > 0) importFetch = '../'.repeat(depth);
  importFetch += 'bridgeFetchMethod';

  return prettier.format(
    `import Fetch from '${importFetch}';\n\nexport default async (${
      hasParameters
        ? `data: {${bodyInterface ? `body: ${bodyInterface},` : ``}${
            queryInterface ? `query: ${queryInterface},` : ``
          }${headersInterface ? `headers: ${headersInterface},` : ``}${
            filesInterface ? `file: ${filesInterface}` : ''
          }}`
        : ''
    }): Promise<${returnInterface}> => { 
      const res = await Fetch({ ${hasParameters ? `...data,` : ''} method: "${method}", path: '${pathArray
      .map((p) => `/${p}`)
      .join('')}' });

      if (res.error && typeof res.error.status === 'number') return { data: undefined, error: res.error };
      else return { data: res, error: undefined };
      }`,
    { parser: 'typescript', singleQuote: true }
  );
};
