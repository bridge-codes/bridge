---
sidebar_label: 'Method'
sidebar_position: 3
---

# Method

By default, endpoints defined with a handler are accessible using any HTTP method, such as GET, POST, PUT, DELETE or PATH. However, you can also specify a specific method for an endpoint by including it in the handler definition.

```ts twoslash
import { handler, initBridge } from 'bridge';

const handler1 = handler({
  resolve: () => 'Hello World',
});

const handler2 = handler({
  method: 'POST',
  resolve: () => 'Hello World',
});

const routes = { handler1, handler2 };

initBridge({ routes })
  .HTTPServer()
  .listen(8080, () => {});
```

Handler1 can be accessed with any method, but handler2 is only accessible via POST. If you try to make a `GET` request to `localhost:8080/handler2`, for example, you'll receive the following response:

```json
{
  "error": {
    "status": 405,
    "name": "Wrong method",
    "data": {
      "method": "POST"
    }
  }
}
```
