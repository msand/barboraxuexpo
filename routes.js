const gql = require('graphql-tag');
const { query } = require('./src/data/datocms');

const allSlugs = gql`
  query allSlugs {
    allWorks {
      slug
    }
  }
`;

// Routes for static export / build
const routes = {
  '/about': { page: '/about' },
  '/news': { page: '/news' },
  '/': { page: '/' },
};

module.exports = async () => {
  // we fetch our list of works, this allows us to dynamically generate the exported pages
  const {
    data: { allWorks },
  } = await query(allSlugs);
  const worksPage = { page: '/works/[slug]' };
  allWorks.forEach(({ slug }) => {
    routes[`/works/${slug}`] = worksPage;
  });
  return routes;
};
