import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from 'react-slick';
import gql from 'graphql-tag';
import Link from 'next/link';
import { useRevalidateOnFocus } from '../../src/hooks/useRevalidateOnFocus';
import initialProps from '../../src/data/initialProps';

const Work = ({ data: { work }, etag }) => {
  useRevalidateOnFocus(etag);
  const { coverImage } = work;
  return (
    <View style={styles.sheet}>
      <View style={styles.sheet_inner}>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Text style={styles.sheet_title}>{work.title}</Text>
        <Text style={styles.sheet_lead}>{work.excerpt}</Text>
        <View style={styles.sheet_slider}>
          <Slider infinite={true} slidesToShow={2} arrows>
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
        </View>
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
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet_inner: {},
  sheet_title: {},
  sheet_lead: {},
  sheet_slider: {},
  sheet_gallery: {},
});

export default Work;

Work.getInitialProps = async ({ res, asPath }) =>
  await initialProps(res, workQuery, { slug: asPath.slice('/works/'.length) });

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
