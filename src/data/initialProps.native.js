import { query } from './datocms';

export default async (res, gqlQuery, variables) => {
  const result = await query(gqlQuery, variables);
  const { data } = result;
  return { data, etag: null };
};
