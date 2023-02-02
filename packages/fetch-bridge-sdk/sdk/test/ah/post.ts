import Fetch from '../../bridgeFetchMethod';

export default async (): Promise<
  | { data: string; error: null }
  | {
      data: null;
      error:
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({ method: 'POST', path: '/test/ah' });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
