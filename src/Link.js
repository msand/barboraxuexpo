import React, { createContext, useContext } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import Link from 'next/link';

const isWeb = Platform.OS === 'web';

const re = /(\/[^/]*\/?)/;

export const defaultRouteState = { page: '/', variables: null };

export const RouteContext = createContext(defaultRouteState);

export const PlatformLink = isWeb
  ? ({ href, target, as, title, children }) => (
    <Link href={href} target={target} as={as} title={title}>
      <TouchableOpacity>{children}</TouchableOpacity>
    </Link>
  )
  : ({ children, title, href, variables }) => {
    const { setRouteState } = useContext(RouteContext);
    return (
      <TouchableOpacity
        onPress={() => {
          const e = re.exec(href);
          const page = e[1];
          setRouteState({ page, variables });
        }}
      >
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

export default PlatformLink;
