---
sidebar_label: 'Errors'
sidebar_position: 4
---

# Errors

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

If you throw an error within a handler, it will send a JSON response to the client with a status code of 500. Similarly, an unexpected error in the resolve function of a handler will also result in a 500 response to the client. The client will not receive information about the cause of the error, which can be handled in Bridge's errorHandler function.

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

## Error handling

You can use the `errorHandler` in Bridge to handle any type of error. See [this chapter](../error_handling) for more information.
