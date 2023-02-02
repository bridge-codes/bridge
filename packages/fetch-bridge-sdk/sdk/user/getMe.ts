import Fetch from '../bridgeFetchMethod';

export default async (data: {
  headers: { token: string };
}): Promise<
  | {
      data: {
        github?: {
          id: string;
          accessToken: string;
          refreshToken: string;
          lastUpdate: Date;
          username: string;
          profileUrl: string;
          accountCreation: Date;
          public_repos_nbr: number;
          followers: number;
        };
        createdAt: Date;
        lastConnexionDate: Date;
        name: string;
        username: string;
        email: string;
        language: 'english' | 'french';
        twitter_username?: string;
        avatar?: string;
      } & { _id: string };
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
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({ ...data, method: 'POST', path: '/user/getMe' });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
