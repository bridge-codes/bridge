import Fetch from '../bridgeFetchMethod';

export default async (data: {
  body: { email: string; password: string };
  query: { code: string };
}): Promise<
  | { data: { refreshToken: string; accessToken: string }; error: null }
  | {
      data: null;
      error:
        | { name: 'Expired code'; data?: any; status: 401 }
        | { name: 'Invalid code'; data?: any; status: 401 }
        | {
            name: 'user not found' | 'admin not found';
            data?: any;
            status: 404;
          }
        | { name: 'Body schema validation error'; status: 422; data: any }
        | { name: 'Query schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/user/updateForgottenPassword',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
