import React from 'react';
import Link from 'next/link';
import gql from 'graphql-tag';
import Slider from 'react-slick';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../../src/hooks/useRevalidateOnFocus';
import initialProps from '../../src/data/initialProps';
import { Container } from '../../src/presentational';

function WorkImageSlider({ work }) {
  return (
    <Slider infinite slidesToShow={2} arrows>
      {work.gallery.map(coverImage => (
        <img
          width={450}
          key={coverImage.url}
          src={coverImage.url}
          alt={coverImage.alt}
          style={{ maxWidth: '100%' }}
        />
      ))}
    </Slider>
  );
}

export const Sheet = styled.View``;
export const SheetSlider = styled.View``;
export const SheetTitle = styled.Text``;
export const SheetLead = styled.Text``;

const Work = ({ data: { work }, etag }) => {
  useRevalidateOnFocus(etag);
  const { coverImage } = work;
  return (
    <Container>
      <Sheet>
        <Link href="/">
          <a>Home</a>
        </Link>
        <SheetTitle>{work.title}</SheetTitle>
        <SheetLead>{work.excerpt}</SheetLead>
        <SheetSlider>
          <WorkImageSlider work={work} />
        </SheetSlider>
        <div
          dangerouslySetInnerHTML={{
            __html: work.description,
          }}
        />
        <img
          width={450}
          src={coverImage.url}
          alt={coverImage.alt}
          style={{ maxWidth: '100%' }}
        />
      </Sheet>
    </Container>
  );
};

export default Work;

const workQuery = gql`
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

Work.getInitialProps = ({ res, asPath }) =>
  initialProps(res, workQuery, { slug: asPath.slice('/works/'.length) });
