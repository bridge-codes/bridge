import { handler, initBridge } from 'bridge';
import express from 'express';

const port = 8080;
const routes = { hello: handler({ resolve: () => 'hello' as const }) };

const app = express();

app.use('', initBridge({ routes }).expressMiddleware());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
