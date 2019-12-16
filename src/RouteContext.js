import { createContext } from 'react';

const defaultRouteContext = () => null;

const RouteContext = createContext(defaultRouteContext);

export default RouteContext;
