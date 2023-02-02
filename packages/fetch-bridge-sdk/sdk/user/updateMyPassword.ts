import Fetch from '../bridgeFetchMethod';

export default async (data: {
  body: { oldPassword: string; newPassword: string };
  headers: { refreshtoken: string };
}): Promise<
  | { data: any; error: null }
  | {
      data: null;
      error:
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/user/updateMyPassword',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
