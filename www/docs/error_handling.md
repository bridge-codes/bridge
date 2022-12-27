---
sidebar_label: 'Error Handling'
sidebar_position: 4
---

# Error Handling

All errors that occur in a handler go through the onError method before being sent to the client. Here you can handle or change errors.

## Example

```ts twoslash
import { initBridge, onError } from 'bridge';

const errorHandler = onError(({ error, path }) => {
  // The error object can be modified here before it is sent to the client

  if (error.name === 'Internal server error') console.log(path, error); // Send to bug reporting
  else console.log(path, error.status, error.name, error.data);
});

const bridge = initBridge({ routes: {}, errorHandler });
```

The onError parameter is an object that contains all information about the error and the context it occurs in:

```ts
{
  path: string;
  error: {
    name: string;
    status: number;
    data?: any;
  }
}
```

:::info

To see how a handler can generate an error, refer to [this chapter](handler/error).

:::
