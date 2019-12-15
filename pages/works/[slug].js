import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../../src/hooks/useRevalidateOnFocus';
import { Image, ScrollView } from '../../src/presentational';
import initialProps from '../../src/data/initialProps';
import Markdown from '../../src/markdown';
import Layout from '../../src/layout';

function WorkImageSlider({ work }) {
  return (
    <ScrollView>
      {work.gallery.map(({ alt, url, width, height }) => (
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
export const SheetSlider = styled.View``;
export const SheetTitle = styled.Text``;
export const SheetLead = styled.Text``;

export const Page = ({ data: { work }, etag }) => {
  useRevalidateOnFocus(etag);
  const {
    coverImage: { alt, url, width, height },
  } = work;
  return (
    <Layout>
      <Sheet>
        <SheetTitle>{work.title}</SheetTitle>
        <SheetLead>{work.excerpt}</SheetLead>
        <SheetSlider>
          <WorkImageSlider work={work} />
        </SheetSlider>
        <Markdown>{work.description}</Markdown>
        <Image alt={alt} source={{ uri: url }} style={{ width, height }} />
      </Sheet>
    </Layout>
  );
};

export const InitialQuery = gql`
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
      description(markdown: true)
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
  initialProps(res, InitialQuery, { slug: asPath.slice('/works/'.length) });

export default Page;
