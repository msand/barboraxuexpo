import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../../src/hooks/useRevalidateOnFocus';
import { Image, isWeb, ScrollView } from '../../src/presentational';
import initialProps from '../../src/data/initialProps';
import Markdown from '../../src/Markdown';
import Layout from '../../src/Layout';
import Head from '../../src/Head';

function WorkImageSlider({ gallery }) {
  return (
    <ScrollView>
      {gallery.map(({ alt, url, width, height }) => (
        <Image
          key={url}
          alt={alt}
          source={{ uri: url }}
          style={{ width, height }}
        />
      ))}
    </ScrollView>
  );
}

export const Sheet = styled.View``;
export const SheetLead = styled.Text``;
export const SheetTitle = styled.Text``;

export const Page = ({
  etag,
  meta = {},
  data: {
    work: {
      title,
      excerpt,
      gallery,
      description,
      coverImage: { alt, url, width, height },
    },
  },
}) => {
  useRevalidateOnFocus(etag);
  return (
    <Layout>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>
      <Sheet>
        <SheetTitle>{title}</SheetTitle>
        <SheetLead>{excerpt}</SheetLead>
        {gallery && gallery.length ? (
          <WorkImageSlider gallery={gallery} />
        ) : null}
        <Markdown>{description}</Markdown>
        <Image alt={alt} source={{ uri: url }} style={{ width, height }} />
      </Sheet>
    </Layout>
  );
};

export const Query = gql`
  query WorkQuery($slug: String!) {
    work(orderBy: position_ASC, filter: { slug: { eq: $slug } }) {
      title
      excerpt
      gallery {
        alt
        id
        url
        width
        height
      }
      description(markdown: ${isWeb})
      coverImage {
        alt
        id
        url
        width
        height
      }
      slug
      id
      updatedAt
      position
      _updatedAt
      _status
      _publishedAt
      _createdAt
      _firstPublishedAt
      _isValid
      _publicationScheduledAt
      _seoMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

Page.getInitialProps = ({ res, asPath }) =>
  initialProps(res, Query, { slug: asPath.slice('/works/'.length) });

export default Page;
