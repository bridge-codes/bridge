import Fetch from '../bridgeFetchMethod';

export default async (data: {
  headers: { refreshtoken: string };
}): Promise<
  | { data: string; error: null }
  | {
      data: null;
      error:
        | { name: 'Wrong permission'; data?: any; status: 401 }
        | { name: 'Invalid token'; data?: any; status: 401 }
        | { name: 'Wrong refreshToken'; data?: any; status: 401 }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/user/refreshToken',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
