import React from 'react';
import { Helmet } from 'react-helmet';

function Seo({ favicon, seo }) {
  return <Helmet favicon={favicon} seo={seo} />;
}

export default Seo;
