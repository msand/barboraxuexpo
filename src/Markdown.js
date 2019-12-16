import React from 'react';
import styledWeb from 'styled-components';

const Markdown = styledWeb.div``;

export default ({ children }) => (
  <Markdown
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
);
