---
sidebar_label: 'Compilation 🚀'
---

# Compilation

Use the following command line to compile your Bridge project:

```bash title='terminal'
npx bridge-compile@latest
# or
pnpx bridge-compile@latest
```

This command line generates 3 things:
- JSONType.json file
- openapi.json file
- sdk folder

The JSONType file contains all the types of your project compiled by Bridge. This file was the input to create the openapi specification and to generate the typescript sdk folder. You can develop your own compiler using this file as an input to generate sdk in other languages.