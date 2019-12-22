// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import gql from 'graphql-tag';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, Title, DatoImage, Text } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Layout from '../src/Layout';
import Head from '../src/Head';

export function Page({
  etag,
  meta = {},
  data: {
    aboutPage: { bio, title, subtitle, photo },
  },
}) {
  useRevalidateOnFocus(etag);
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
      </Container>
      {photo ? (
        <DatoImage
          image={photo}
          style={{
            height: 300,
            padding: 10,
          }}
        />
      ) : null}
    </Layout>
  );
}
export const Query = gql`
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

Page.getInitialProps = ({ res }) => initialProps(res, Query);

export default Page;
