const { ApolloClient } = require('apollo-client');
const { createHttpLink } = require('apollo-link-http');
const { setContext } = require('apollo-link-context');
const { InMemoryCache } = require('apollo-cache-inmemory');
const fetch = require('isomorphic-unfetch');

const token = process.env.DATO_API_TOKEN;

const httpLink = createHttpLink({
  fetch,
  uri: 'https://graphql.datocms.com/',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: Object.assign(headers || {}, {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

module.exports = {
  query: (query, variables) => client.query({ query, variables }),
};
