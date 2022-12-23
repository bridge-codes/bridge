---
sidebar_label: 'Routes'
sidebar_position: 5
---

# Routes

## Definition

Defining the routes for your Bridge project is simple – it's a JSON object with your handlers at the leaf nodes of the JSON tree.

**Example**

```ts twoslash title='index.ts'
import { handler, initBridge } from 'bridge';

const helloHandler = handler({
  method: 'GET',
  resolve: () => {
    return 'Hello';
  },
});

const byeHandler = handler({
  // default method is POST
  resolve: () => {
    return 'Bye';
  },
});

const routes = {
  // GET /hello
  hello: helloHandler,
  // POST /bye
  bye: byeHandler,
};

initBridge({ routes })
  .HTTPServer()
  .listen(8080, () => {});
```

## Nested Routes

In addition to defining individual routes, you can create nested routes by adding new objects to your router. Nested routes let you group related routes together for a more complex and organized API.

**Example**

```ts
const routes = {
  // POST /hey
  hey: heyHandler,
  admin: {
    // POST /admin/signin
    signin: signinHandler,
    users: {
      // POST /admin/users/create
      create: createUserHandler,
      // POST /admin/users/get
      get: getUserHandler,
    },
  },
};
```

## Route Not Found

If the endpoint's route is not found, Bridge will respond to the client with a 404 error and the following object:

```json
{
  "error": {
    "status": 404,
    "name": "Route not found"
  }
}
```
