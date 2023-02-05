import { IncomingMessage } from 'http';

export const getJSONDataFromRequestStream = <T>(request: IncomingMessage): Promise<T> =>
  new Promise((resolve) => {
    if (typeof (request as any).body === 'object') resolve((request as any).body);
    const chunks: any[] = [];
    request.on('data', (chunk) => {
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (err) {
        resolve(JSON.parse('{}'));
      }
    });
  });
