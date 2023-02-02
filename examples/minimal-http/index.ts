import { handler, initBridge } from 'bridge';

const port = 8080;
const routes = { hello: handler({ resolve: () => 'hello' }) };

const httpServer = initBridge({ routes }).HTTPServer();

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
