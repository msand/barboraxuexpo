import { query } from './index';

export default async (res, gqlQuery, variables) => {
  const result = await query(gqlQuery, variables);
  const { data } = result;
  const etag = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');

  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.setHeader('X-version', etag);
  }

  return { data, etag };
};
