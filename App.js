import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import * as news from './pages/news';
import * as index from './pages/index';
import { client } from './src/data/datocms';
import * as works from './pages/works/[slug]';
import { ErrorView } from './src/presentational';
import { defaultRouteState, RouteContext } from './src/Link';

function getRoute(page) {
  switch (page) {
    case '/news':
      return news;
    case '/works/':
      return works;
    default:
    case '/':
      return index;
  }
}

export default function App() {
  const [routeState, setRouteState] = useState(defaultRouteState);
  const { page, variables } = routeState;
  const { InitialQuery, Page } = getRoute(page);
  const { loading, error, data } = useQuery(InitialQuery, {
    client,
    variables,
  });
  if (loading) {
    return <ErrorView>Loading...</ErrorView>;
  }
  if (error) {
    return <ErrorView>Error! {error.message}</ErrorView>;
  }
  return (
    <RouteContext.Provider value={{ routeState, setRouteState }}>
      <ErrorView>
        <Page data={data} />
      </ErrorView>
    </RouteContext.Provider>
  );
}
