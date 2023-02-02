import Fetch from '../../bridgeFetchMethod';

export default async (data: {
  query: { project: string; owner: string };
}): Promise<
  | { data: string; error: null }
  | {
      data: null;
      error:
        | { name: 'Document not found'; data?: any; status: 404 }
        | { name: 'Query schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'GET',
    path: '/deploy/typescript-sdk',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
