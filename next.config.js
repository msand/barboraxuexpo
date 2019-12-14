// @generated: @expo/next-adapter@2.0.0-beta.9
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
require('dotenv').config();
const gql = require('graphql-tag');
const { query } = require('./src/data/datocms');
const { withExpo } = require('@expo/next-adapter');

const allSlugs = gql`
  query allSlugs {
    allWorks {
      slug
    }
  }
`;

module.exports = withExpo({
  env: {
    DATO_API_TOKEN: process.env.DATO_API_TOKEN, // Pass through env variables
  },
  projectRoot: __dirname,
  async exportPathMap() {
    // we fetch our list of works, this allow us to dynamically generate the exported pages
    const {
      data: { allWorks },
    } = await query(allSlugs);

    // combine the map of works pages with the landing page
    const pages = {
      '/': { page: '/' },
    };

    // transform the list of works into a map of pages with the pathname `/works/:slug`
    allWorks.forEach(
      ({ slug }) => (pages[`/works/${slug}`] = { page: '/works/[slug]' }),
    );

    return pages;
  },
});
