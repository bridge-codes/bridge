---
sidebar_label: 'Data Validation'
---

# Data Validation

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

## Validation Error

If the user's data is in the wrong format, Bridge will respond with an error. An example using Zod:

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
