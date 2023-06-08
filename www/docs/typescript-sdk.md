---
sidebar_label: 'Typescript SDK'
---

# Typescript SDK

## Fetch your Client SDK

You can simply download the typescript client code with the following command line:

```bash title='terminal'
npx fetch-bridge-sdk $serverUrl
```

If you do not have axios and form-data installed in your project, the command line will automatically install them for you.

The upcoming version of the command line will allow you to select your preferred HTTP client library, either axios or fetch, and the required packages will be automatically installed if they are not already present in your project.


## Use it in the frontend

The Typescript client SDK exports an API constant which can be easily imported into your code and used to access every endpoint of the Bridge API.

### Example

```ts twoslash title='client.ts' live

const API = {
    user: {
        getMe: async (p: {
            headers: { token: string }
        }): Promise<
  | {
      data: {
        _id: string
        username: string;
        email: string;
        age: number;
        language: 'english' | 'french';
        avatar?: string;
        createdAt: Date;
      };
      error: undefined;
    }
  | {
      data: undefined;
      error:
        | { name: 'Wrong permission'; data?: any; status: 401 }
        | { status: 404; name: 'User not found' }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => '' as any 
    }
} 

// ---cut---
// import { API } from './api'

async () => {

    const { data, error } = await API.user.getMe({
        headers: { token: 'secretToken' }
    })

    if (data) console.log(data)
    //                      ^?


    if (error) {
        switch (error.name) {
            case "User not found":
            //...
            break;
        }

        console.log(error)
        //            ^?  
   }
}
```