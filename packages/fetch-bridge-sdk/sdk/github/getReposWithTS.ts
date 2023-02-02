import Fetch from '../bridgeFetchMethod';

export default async (data: {
  body: { repoName?: string; perPage?: number; connectedAccountName: string };
  headers: { token: string };
}): Promise<
  | {
      data: Array<{
        id: number;
        name: string;
        full_name: string;
        visibility: string;
        owner: string;
        createdAt: string;
        updatedAt: string;
      }>;
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
        | { name: 'Body schema validation error'; status: 422; data: any }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/github/getReposWithTS',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
