import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { ErrorView, Text } from './src/presentational';
import RouteContext from './src/RouteContext';
import { client } from './src/data/datocms';
import * as index from './pages/index';
import routes from './routes.native';

const initialRoute = { page: '/', variables: null };

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const { page, variables } = route;
  const { Page, Query } = routes[page] || index;
  const { loading, data, error } = useQuery(Query, {
    variables,
    client,
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
    <RouteContext.Provider value={setRoute}>
      <ErrorView>
        <Page data={data} />
      </ErrorView>
    </RouteContext.Provider>
  );
}
