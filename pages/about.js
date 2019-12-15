// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import gql from 'graphql-tag';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, Title, DatoImage, Text } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Layout from '../src/layout';
import Head from '../src/Head';

export function Page({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  const { bio, title, subtitle, photo } = data.aboutPage;
  return (
    <Layout>
      <Container>
        <Head>
          {meta.title && <title>{meta.title[0][0]}</title>}
          {meta.description && (
            <meta name="description" content={meta.description[0][0]} />
          )}
        </Head>

        <Title>{title}</Title>
        <Title>{subtitle}</Title>
        <Text>{bio}</Text>
        {photo ? <DatoImage image={photo} /> : null}
      </Container>
    </Layout>
  );
}
export const InitialQuery = gql`
  query AboutQuery {
    aboutPage {
      id
      bio
      title
      subtitle
      photo {
        url
        title
        alt
        width
        height
      }
      seoSettings {
        twitterCard
        title
        description
        image {
          width
          url
          height
          title
          alt
        }
      }
      _seoMetaTags {
        tag
        content
        attributes
      }
    }
  }
`;

Page.getInitialProps = ({ res }) => initialProps(res, InitialQuery);
export default Page;
