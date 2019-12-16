import React from 'react';
import { TouchableOpacity } from 'react-native';
import NextLink from 'next/link';

const Link = ({ href, target, as, title, children }) => (
  <NextLink href={href} target={target} as={as} title={title}>
    <TouchableOpacity>{children}</TouchableOpacity>
  </NextLink>
);

export default Link;
