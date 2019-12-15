import { query } from './datocms';

export default async (res, initialQuery, variables) => {
  const result = await query(initialQuery, variables);
  const { data } = result;
  return { data, etag: null };
};
