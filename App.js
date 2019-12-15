import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import * as news from './pages/news';
import * as index from './pages/index';
import * as about from './pages/about';
import { client } from './src/data/datocms';
import * as works from './pages/works/[slug]';
import { ErrorView, Text } from './src/presentational';
import { defaultRouteState, RouteContext } from './src/Link';

const routes = {
  '/news': news,
  '/works/': works,
  '/about': about,
  '/': index,
};

export default function App() {
  const [routeState, setRouteState] = useState(defaultRouteState);
  const { page, variables } = routeState;
  const { InitialQuery, Page } = routes[page] || index;
  const { loading, error, data } = useQuery(InitialQuery, {
    client,
    variables,
  });
  if (loading) {
    return (
      <ErrorView>
        <Text>Loading...</Text>
      </ErrorView>
    );
  }
  if (error) {
    return (
      <ErrorView>
        <Text>Error! {error.message}</Text>
      </ErrorView>
    );
  }
  return (
    <RouteContext.Provider value={{ routeState, setRouteState }}>
      <ErrorView>
        <Page data={data} />
      </ErrorView>
    </RouteContext.Provider>
  );
}
