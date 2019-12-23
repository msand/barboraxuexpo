const fetch = require('isomorphic-unfetch');
const { ApolloClient } = require('apollo-client');
const { setContext } = require('apollo-link-context');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');

const token = process.env.DATO_API_TOKEN || 'de342103fca06a961c637edd39bcf8';

const httpLink = createHttpLink({
  fetch,
  uri: 'https://graphql.datocms.com/',
});

const authLink = setContext((_, { headers }) => ({
  headers: Object.assign(headers || {}, {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }),
}));

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

module.exports = {
  client,
  query: (query, variables) => client.query({ query, variables }),
};
