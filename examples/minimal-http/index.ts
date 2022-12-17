import { handler, initBridge } from 'bridge';

const port = 8080;
const routes = { hello: handler({ method: 'GET', resolve: () => 'hello' }) };

initBridge({ routes })
  .HTTPServer()
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
