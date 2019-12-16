import React from 'react';
import styled from 'styled-components';

const Markdown = styled.div`
  color: #fff;
`;

export default ({ children }) => (
  <Markdown
    dangerouslySetInnerHTML={{
      __html: children,
    }}
  />
);
