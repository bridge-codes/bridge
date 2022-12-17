import { IncomingMessage, ServerResponse } from 'http';
import { ErrorHandler } from '../../error';
import {
  getJSONDataFromRequestStream,
  getJSONQueryFromURL,
  formidableAsyncParseFiles,
} from '../httpTransormers';
import { convertBridgeRoutesToServerRoutes, BridgeRoutes, Method } from '../../routes';
import { FormidableFile } from '../../utilities';

export const createHttpHandler = (
  routes: BridgeRoutes,
  config?: { errorHandler?: ErrorHandler; formidable?: any },
) => {
  let path: string;
  let queryString: string;

  const serverRoutes = convertBridgeRoutesToServerRoutes(routes);

  return async (req: IncomingMessage, res: ServerResponse) => {
    let body: Record<any, any> = {};
    let file: { [file: string]: FormidableFile | FormidableFile[] } = {};

    const query = getJSONQueryFromURL(req.url || '');

    try {
      [path, queryString] = (req.url || '/').split('?');

      const route = serverRoutes[path] || serverRoutes['not-found'];

      if (route.endpoint.config.fileConfig && !config?.formidable)
        throw new Error(
          `You need to install formidable and to give it to Bridge in order to use files.`,
        );

      if (route.endpoint.config.fileConfig)
        file = await formidableAsyncParseFiles(req, config?.formidable!);
      else body = await getJSONDataFromRequestStream(req);

      const mid = {};

      const result = await route.endpoint.handle({
        body,
        file,
        query,
        headers: req.headers,
        method: req.method as Method,
        mid,
      });

      if (result.error) {
        config?.errorHandler?.({ error: result.error, path: path });
        return res
          .writeHead(result.error.status || 500, { 'Content-Type': 'application/json' })
          .end(JSON.stringify({ error: result.error }));
      }

      return res
        .writeHead(200, {
          'Content-Type': typeof result === 'object' ? 'application/json' : 'text/plain',
        })
        .end(typeof result === 'object' ? JSON.stringify(result) : result);
    } catch (err) {
      config?.errorHandler?.({
        error: { status: 500, name: 'Internal server error', data: err },
        path: path,
      });
      return res
        .writeHead(500, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ status: 500, name: 'Internal server error' }));
    }
  };
};
