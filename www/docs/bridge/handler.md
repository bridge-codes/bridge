---
sidebar_label: 'Handler'
---

# Handler

The `handler` is the core concept of Bridge. This function helps you create endpoints and middlewares for your Bridge server.

## Resolve Function

The `resolve` function is the only required parameter of a handler. You can either return a json object, a string or a number with the resolve function. If the function returns void, the client will receive an empty object in response.

```ts
import { handler } from 'bridge';

// Returns the string "Hello World" with an http status code 200
const handler1 = handler({
  resolve: () => 'Hello World',
});

// Returns the number 42 with an http status code 200
const handler2 = handler({
  resolve: () => 42,
});

// Returns the json { name: "John", age: 42 } with an http status code 200
const handler3 = handler({
  resolve: () => ({ name: 'John', age: 42 }),
});

// Returns the empty json {} with an http status code 200
const handler3 = handler({
  resolve: () => {
    console.log('hello');
  },
});
```

<!-- See how to validate and handle data from the client [here](data).

See how to send an error to the client [here](error). -->
<!--
## Return an http error

Bridge provides a method to return errors to the client called `httpError`.

For example, this endpoint:

```ts twoslash title='index.ts'
import { handler, httpError } from 'bridge';

const hello = handler({
  resolve: () => httpError(400, 'Expired Session'),
});
```

Results to the following response with an error status 400:

```json
{
  "error": {
    "status": 400,
    "name": "Expired Session"
  }
}
```

The `StatusCode` enum in the Bridge library can be used to easily specify an error status in your response. You can also include additional details by passing them as the third argument to `httpError`, which will be sent to the client.

For example, this endpoint:

```ts twoslash title='index.ts'
import { handler, httpError, StatusCode } from 'bridge';

const hello = handler({
  resolve: () => httpError(StatusCode.UNAUTHORIZED, 'Expired Session', { reason: 'example' }),
});
```

Results to the following response with an error status 400:

```json
{
  "error": {
    "status": 400,
    "name": "Expired Session",
    "data": {
      "reason": "example"
    }
  }
}
```

## Throw an error

If you throw an error within a handler, it will send a JSON response to the client with a status code of 500. Similarly, an unexpected error in the resolve function of a handler will also result in a 500 response to the client. The client will not receive information about the cause of the error, which can be handled in **[Bridge's `errorHandler` function](error_handling)**.

For example, this endpoint:

```ts twoslash title='index.ts'
import { handler } from 'bridge';

const hello = handler({
  resolve: () => {
    throw new Error('Test error');
  },
});
```

Results to the following response with an error status 500:

```json
{
  "error": {
    "status": 500,
    "name": "Internal server error"
  }
}
```

## Data Validation

You can validate and process the body, query parameters and headers sent by the client using either the Zod library, the Superstruct or the Yup library library. We strongly suggest to use Zod to have best developer experience.

### With [Zod](https://github.com/colinhacks/zod)

```ts twoslash
import { handler } from 'bridge';
import z from 'zod';

const getMe = handler({
  headers: z.object({ token: z.string().min(5) }),
  query: z.object({ _id: z.string() }),
  body: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    type: z.enum(['admin', 'user']).optional(),
  }),
  resolve: (data) => {
    //       ^?
    const { body, query, headers } = data;

    return { success: true };
  },
});
```

### With [Superstruct](https://github.com/ianstormtaylor/superstruct)

```ts twoslash
import { handler } from 'bridge';
import { object, number, string, enums, size, optional } from 'superstruct';

const getMe = handler({
  headers: object({ token: size(string(), 5) }),
  query: object({ _id: string() }),
  body: object({
    name: optional(string()),
    age: optional(number()),
    type: optional(enums(['admin', 'user'])),
  }),
  resolve: ({ body, query, headers }) => {
    return { success: true };
  },
});
```

### With [Yup](https://github.com/jquense/yup)

```ts twoslash
import { handler } from 'bridge';
import * as yup from 'yup';

const getMe = handler({
  headers: yup.object({ token: yup.string().min(5).required() }),
  query: yup.object({ _id: yup.string().required() }),
  body: yup.object({
    name: yup.string(),
    age: yup.number(),
    type: yup.mixed().oneOf(['admin', 'user']),
  }),
  resolve: ({ body, query, headers }) => {
    return { success: true };
  },
});
```

### Data Validation Error

If the user's data is in the wrong format, Bridge will respond with an error. Here is an example using **Zod**:

```json
{
  "error": {
    "status": 400,
    "name": "Body schema validation error",
    "data": {
      "issues": [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": ["name"],
          "message": "Required"
        }
      ],
      "name": "ZodError"
    }
  }
}
```

## Server Side Calls

You can directly call your handler(s) from the server by calling the resolve function of the handler.

**Example**

```ts twoslash
import { handler, httpError } from 'bridge';
import z from 'zod';

const users: Record<string, { firstName: string; lastName: string }> = {
  '1': {
    firstName: 'John',
    lastName: 'Doe',
  },
};

const getMyIdWithToken = handler({
  headers: z.object({ token: z.string() }),
  resolve: ({ headers }) => {
    if (headers.token === 'token') return { id: '1' };
    else return httpError(400, 'Wrong token');
  },
});

const getProfileWithToken = handler({
  headers: z.object({ token: z.string() }),
  resolve: ({ headers }) => {
    const res = getMyIdWithToken.resolve({ headers });
    //     ^?
    if ('error' in res) return res;
    return users[res.id];
  },
});
```

This example shows two handlers that can be used as endpoints and called separately. `getProfileWithToken` uses the resolve function of `getMyIdWithToken`.

:::caution
The above example doesn't make much sense, it would be more logical to use getMyIdWithToken as a middleware for getProfileWithToken. This would make the code shorter and clearer. Here is the revised code:
:::

```ts twoslash
import { handler, httpError, apply } from 'bridge';
import z from 'zod';

const users: Record<string, { firstName: string; lastName: string }> = {
  '1': {
    firstName: 'John',
    lastName: 'Doe',
  },
};

const getMyIdWithToken = handler({
  headers: z.object({ token: z.string() }),
  resolve: ({ headers }) => {
    if (headers.token === 'token') return { id: '1' };
    else return httpError(400, 'Wrong token');
  },
});

const getProfileWithToken = handler({
  middlewares: apply(getMyIdWithToken),
  resolve: ({ mid }) => users[mid.id],
});
```

:::info
To learn about using middlewares, see the [next chapter](middlewares) in the documentation.
::: -->
