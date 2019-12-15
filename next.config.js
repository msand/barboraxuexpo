// @generated: @expo/next-adapter@2.0.0-beta.9
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
require('dotenv').config();
const gql = require('graphql-tag');
const { withExpo } = require('@expo/next-adapter');
const withTranspileModules = require('next-transpile-modules');

const { query } = require('./src/data/datocms');

const allSlugs = gql`
  query allSlugs {
    allWorks {
      slug
    }
  }
`;

module.exports = withExpo(
  withTranspileModules({
    env: {
      DATO_API_TOKEN: process.env.DATO_API_TOKEN, // Pass through env variables
    },
    projectRoot: __dirname,
    transpileModules: ['react-native-svg', 'styled-components/native'],
    async exportPathMap() {
      // we fetch our list of works, this allow us to dynamically generate the exported pages
      const {
        data: { allWorks },
      } = await query(allSlugs);
      const pages = {
        '/': { page: '/' },
        '/news': { page: '/news' },
        '/about': { page: '/about' },
      };
      const worksPage = { page: '/works/[slug]' };
      allWorks.forEach(({ slug }) => {
        pages[`/works/${slug}`] = worksPage;
      });
      return pages;
    },
  }),
);
