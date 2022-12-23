---
sidebar_label: 'Files'
sidebar_position: 5
---

# Files

Bridge integrates seamlessly with `formidable` to receive and handle files on your server. Simply install `formidable` and pass it to `initBridge` to enable this feature. You can use the `apply` function in Bridge to specify the names of specific files you want your client to send, or use "any" to accept any file.

Check the following example:

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
