import axios from 'axios';
import FormData from 'form-data';

export const serverUrl = 'http://localhost:8080';

interface FETCH {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  body?: Record<any, any>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  file?: Record<string, File | Buffer>;
}

const getQueryUrl = (query: FETCH['query']): string => {
  if (!query || !Object.values(query).some((val) => val)) return '';

  return Object.entries(query)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

export default async ({ path, method, body, query, headers, file }: FETCH) => {
  let completeUrl = serverUrl + path;
  if (query && Object.keys(query).length > 0)
    completeUrl += '?' + getQueryUrl(query);

  const config: any = { url: completeUrl, method };

  if (headers) config.headers = headers;
  if (body) config.data = body;
  else if (file) {
    const formData = new FormData();
    Object.entries(file).forEach(([name, f]) => formData.append(name, f));
    config.data = formData;
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  return axios(config)
    .then((res) => res.data)
    .catch((err) => {
      if (
        err.response &&
        err.response.data &&
        'error' in err.response.data &&
        'status' in err.response.data.error
      )
        return err.response.data;

      return {
        error: {
          name: 'Axios Error',
          status: 400,
          data: err,
        },
      };
    });
};
