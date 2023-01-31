import express, { NextFunction, Request, Response } from 'express';
import { handler, initBridge, onError, httpError, StatusCode, apply } from 'bridge';
import z from 'zod';

const app = express();

const authMid = handler({
  headers: z.object({ token: z.string() }),
  resolve: ({ headers }) => {
    if (headers.token !== 'private_token') return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return { batista: 89 };
  },
});

const authMid2 = handler({
  headers: z.object({ bonjour: z.string() }),
  middlewares: apply(authMid),
  resolve: ({ headers, mid }) => {
    if (headers.bonjour !== 'private_token')
      return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return { NabTest: 'John', name: 'Doe', age: 21, ...mid };
  },
});

const hello = handler({
  body: z.object({ name: z.string() }),
  query: z.object({ name: z.string() }),
  middlewares: apply(authMid2),
  resolve: ({ body, query, headers, mid }) => {
    if (query.name === 'has')
      return httpError(StatusCode.UNAUTHORIZED, 'Dont like has', { reason: 'bnla' });

    const res = authMid.resolve({ headers: { token: '' } });
    return `Hey NabTest `;
  },
});

const routes = {
  hello,
  hey: hello,
};

const errorHandler = onError(({ path, error }) => {
  console.log(path, error);
});

app.use('/', initBridge({ routes, errorHandler }).expressMiddleware());

// const ctrl = (req: Request, res: Response) => {
//   const bodySchema = z.object({
//     name: z.string(),
//   });

//   const val = bodySchema.safeParse(req.body);
//   if (!val.success) return res.json(val);

//   const body = val.data;

//   res.json({ sub: { text: `Hello ${body.name.toLowerCase()}` } });
// };

// /**
//  * METADATA
//  */
// app.get('/', ctrl);

app.listen(8080, () => {
  console.log('Listening on 8080');
});
