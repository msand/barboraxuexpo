import React from 'react';
import NextLink from 'next/link';
import { TouchableOpacity } from 'react-native';

const Link = ({ href, as, children }) => (
  <NextLink href={href} as={as}>
    <TouchableOpacity>{children}</TouchableOpacity>
  </NextLink>
);

export default Link;
