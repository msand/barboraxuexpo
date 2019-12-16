import React, { useContext, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import RouteContext from './RouteContext';

const routeRegEx = /(\/[^/]*\/?)/;

const Link = ({ children, title, href, variables }) => {
  const setRoute = useContext(RouteContext);
  const onPress = useMemo(
    () => () => {
      const e = routeRegEx.exec(href);
      const page = e[1];
      setRoute({ page, variables });
    },
    [href, variables, setRoute],
  );
  return (
    <TouchableOpacity onPress={onPress}>
      {children || (
        <View>
          <Text>
            {title} {href}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Link;
