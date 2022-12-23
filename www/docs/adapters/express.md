---
sidebar_label: 'Express'
sidebar_position: 2
---

# Express

**Example**

```ts twoslash title='index.ts'
import { initBridge, handler } from 'bridge';
import express from 'express';

const hello = handler({
  resolve: () => 'hello',
});

const bridge = initBridge({ routes: { hello } });

const port = 8080;

const app = express();

app.use('', bridge.expressMiddleware());

app.listen(port, () => {
  `Listening on port ${port}`;
});
```
