import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { query } from '../../src/data/datocms';
import Slider from 'react-slick';
import gql from 'graphql-tag';
import { useFocus } from '../../src/hooks/useFocus';

const Work = ({ work, etag }) => {
  const focused = useFocus();
  useEffect(() => {
    if (focused) {
      fetch(window.location, {
        headers: {
          pragma: 'no-cache',
        },
      }).then(res => {
        if (res.ok && res.headers.get('x-version') !== etag) {
          window.location.reload();
        }
      });
    }
  }, [focused]);
  const { coverImage } = work;
  return (
    <View style={styles.sheet}>
      <View style={styles.sheet_inner}>
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

Work.getInitialProps = async ({ res, query: { slug } }) => {
  const result = await query(workQuery, { slug });
  const { data } = result;
  const etag = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');

  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.setHeader('X-version', etag);
  }

  return { ...data, etag };
};

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
