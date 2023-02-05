import { initBridge, handler, onError, apply, method } from './source';
import formidable from 'formidable';
import express from 'express';
import bodyParser from 'body-parser';
import z from 'zod';

const authMid = handler({
  resolve: () => ({
    ah: 'dds',
  }),
});

const hey = handler({
  middlewares: apply(authMid),
  body: z.object({ name: z.string() }),
  resolve: ({ middlewares }) => middlewares,
});

const routes = { hey: method({ POST: hey }) };

const errorHandler = onError(({ error, path }) => {
  console.log(path, error);
});

const app = express();

// app.use(bodyParser.json());

const bridge = initBridge({ routes, errorHandler });

app.use('', bridge.expressMiddleware());

app.listen(8080, () => {
  console.log('Listening');
});
