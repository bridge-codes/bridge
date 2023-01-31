import Fetch from '../bridgeFetchMethod';

export default async (data: {
  body: {
    serverUrl: string;
    githubRepo: {
      id: number;
      name: string;
      owner: string;
      full_name: string;
      visibility: 'private' | 'public';
      createdAt: Date;
    };
    projectName: string;
  };
  headers: { token: string };
}): Promise<
  | {
      data: {
        owner: string;
        name: string;
        provider: 'github';
        subscribedLanguages: Array<'typescript'>;
        serverUrl: string;
        pendingCompilation: true;
        githubRepo: {
          id: number;
          name: string;
          owner: string;
          full_name: string;
          visibility: 'private' | 'public';
          createdAt: Date;
        };
        lastCompilationSuccess: true;
      } & { _id: string; createdAt: Date; updatedAt: Date };
      error: null;
    }
  | {
      data: null;
      error:
        | { name: 'Wrong permission'; data?: any; status: 401 }
        | { name: 'Expired token'; data?: any; status: 401 }
        | { name: 'Invalid token'; data?: any; status: 401 }
        | { status: 404; name: 'Document not found' }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Already exists'; data?: any; status: 406 }
        | { name: 'User not connected with github'; data?: any; status: 401 }
        | {
            name: 'Undefined in result of github.getRepoZip';
            data?: any;
            status: 500;
          }
        | { status: 409; name: 'Already exists'; data?: any }
        | { name: 'Body schema validation error'; status: 422; data: any }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/github/subscribeRepoToBridge',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
