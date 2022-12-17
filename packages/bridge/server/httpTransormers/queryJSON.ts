export const getJSONQueryFromURL = (queryUrl: string): Record<string, string> => {
  const queryJSON: Record<string, string> = {};
  try {
    if (!queryUrl) return queryJSON;

    const queries = queryUrl.replace('?', '&').split('&');

    queries.forEach((query: string) => {
      const [key, value] = query.split('=');
      queryJSON[key] = value;
    });

    return queryJSON;
  } catch (err) {
    console.error(err);
    return queryJSON;
  }
};
