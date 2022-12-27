---
sidebar_label: 'Files'
---

# Files

Bridge integrates seamlessly with `formidable` to receive and handle files on your server. Simply install `formidable` and pass it to `initBridge` to enable this feature. You can use the `apply` function in Bridge to specify the names of specific files you want your client to send, or use "any" to accept any file.

## Example

```ts twoslash title='index.ts'
import { initBridge, handler, apply } from 'bridge';
import formidable from 'formidable';

const sendAnyFiles = handler({
  file: 'any',
  resolve: ({ file }) => {
    //          ^?
    console.log(file);
    return { success: true };
  },
});

const sendSpecificFiles = handler({
  file: apply('profilePicture', 'coverPicture'),
  resolve: ({ file }) => {
    //          ^?
    console.log(file);
    return { success: true };
  },
});

const routes = {
  sendAnyFiles,
  sendSpecificFiles,
};

const bridge = initBridge({ routes, formidable });
```

## Error Example

```json
{
  "error": {
    "status": 400,
    "name": "You didn't send all required files",
    "data": {
      "missingFiles": ["profilePicture"]
    }
  }
}
```
