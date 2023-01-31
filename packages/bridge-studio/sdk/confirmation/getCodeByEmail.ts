import Fetch from '../bridgeFetchMethod';

export default async (data: {
  query: { email: string };
}): Promise<
  | { data: 'Code sent by email'; error: null }
  | {
      data: null;
      error:
        | { name: 'Query schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/confirmation/getCodeByEmail',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
