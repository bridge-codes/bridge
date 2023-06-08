import Fetch from './bridgeFetchMethod';

export default async (): Promise<
  | { data: string; error: undefined }
  | {
      data: undefined;
      error:
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({ method: 'POST', path: '/hello' });

  if (res.error && typeof res.error.status === 'number')
    return { data: undefined, error: res.error };
  else return { data: res, error: undefined };
};
