import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRevalidateOnFocus } from '../src/hooks/useRevalidateOnFocus';
import initialProps from '../src/data/initialProps';

export default function NewsPage({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  const {
    newsPage: {
      title,
      updatedAt,
      newsContent,
    },
  } = data;
  return (
    <View style={styles.container}>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{updatedAt}</Text>
      {newsContent.map(
        ({ gallery, image, where, when, video, title, id, content }) => (
          <View key={id}>
            {title ? <Text>{title}</Text> : null}
            {when ? <Text>{when}</Text> : null}
            {where ? (
              <Text>
                long: {where.longitude} lat: {where.latitude}
              </Text>
            ) : null}
            {content ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            ) : null}
            {image ? <NewsImage image={image} /> : null}
            {gallery ? <NewsGallery gallery={gallery} /> : null}
            {video ? <NewsVideo video={video} /> : null}
          </View>
        ),
      )}
    </View>
  );
}
function NewsImage({ url, ...rest }) {
  return <img src={url} {...rest} />;
}
function NewsVideo({ video: { url, title, thumbnailUrl, ...rest } }) {
  return (
    <a href={url} title={title}>
      {title}
      <img src={thumbnailUrl} {...rest} />
    </a>
  );
}
function NewsGallery({ gallery }) {
  return gallery.map(({ url, ...rest }) => (
    <img src={url} key={url} {...rest} />
  ));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showcase_item: {},
  card: {},
  card_caption: {},
  card_description: {},
  card_title: {
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});

NewsPage.getInitialProps = async ({ res }) =>
  await initialProps(res, newsPageQuery);

const newsPageQuery = gql`
  query NewsPageQuery {
    newsPage {
      title
      updatedAt
      newsContent {
        gallery {
          id
          url
          width
          height
          alt
        }
        image {
          url
          width
          height
          alt
        }
        where {
          longitude
          latitude
        }
        when
        video {
          width
          url
          title
          thumbnailUrl
          height
        }
        title
        id
        updatedAt
        content(markdown: true)
      }
      _seoMetaTags {
        tag
        content
        attributes
      }
      id
    }
  }
`;
