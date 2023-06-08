---
sidebar_label: 'OpenAPI Documentation'
---

# Browse OpenAPI documentation

After compiling your Bridge project, you can browse the openapi specification generated easily with ExpressJS.


```ts title='server.ts' showLineNumbers
import { handler, initBridge } from 'bridge';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const openApiDocumentation = require('./openapi.json');

const routes = {
  hello: handler({
    resolve: () => 'Hello World',
  }),
};

const port = 8080;
const app = express();
const bridge = initBridge({ routes });

app.use('', bridge.expressMiddleware());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
```
