import { initBridge, handler, onError, StatusCode, httpError, apply } from 'bridge';
import express from 'express';
import z from 'zod';

const port = 8081;

const authMiddleware = handler({
  headers: z.object({ token: z.string().min(5) }),
  resolve: ({ headers }) => {
    if (headers.token !== 'private_token') return httpError(StatusCode.UNAUTHORIZED, 'Wrong token');
    else return { firstName: 'John', name: 'Doe', age: 21 };
  },
});

const updateUser = handler({
  middlewares: apply(authMiddleware),
  body: z.object({ age: z.number() }),
  resolve: ({ mid, body }) => {
    const user = mid;
    user.age = body.age;
    return user;
  },
});

const routes = {
  hey: handler({ resolve: () => 'hey' }),
  hello: handler({
    query: z.object({ name: z.string().optional() }),
    method: 'GET',
    resolve: ({ query }) => `Hello ${query.name}`,
  }),
  user: {
    update: updateUser,
  },
};

const errorHandler = onError(({ error, path }) => {
  if (error.name === 'Internal server error') console.log(path, error); // Send to bug reporting
  else console.log(path, error.status, error.name);
});

const app = express();

app.use('', initBridge({ routes, errorHandler }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
