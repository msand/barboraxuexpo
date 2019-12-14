// @generated: @expo/next-adapter@2.0.0-beta.9
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { query } from '../src/data/datocms';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useFocus } from '../src/hooks/useFocus';

export default function Page({ data, etag, meta = {} }) {
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

  return (
    <View style={styles.container}>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>

      <Text style={styles.text}>Welcome to Expo + Next.js 👋</Text>

      {data.allWorks.map(({ id, title, slug, excerpt, coverImage }) => {
        console.log(coverImage);
        return (
          <View key={id} style={styles.showcase_item}>
            <View style={styles.card} d>
              <Link href={`/works/${slug}`} style={styles.card_image}>
                <a>
                  <img
                    width={450}
                    style={{ maxWidth: '100%' }}
                    src={coverImage.url}
                    alt={coverImage.alt}
                  />
                </a>
              </Link>
              <View style={styles.card_caption}>
                <Text style={styles.card_title}>
                  <Link href={`/works/${slug}`}>
                    <a>{title}</a>
                  </Link>
                </Text>
                <View style={styles.card_description}>
                  <Text>{excerpt}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
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

Page.getInitialProps = async ({ res }) => {
  const data = await query(indexQuery);
  console.log('data', data);
  const etag = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(data.data))
    .digest('hex');

  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.setHeader('X-version', etag);
  }

  return { ...data, etag };
};

const indexQuery = gql`
  query IndexQuery {
    allWorks(orderBy: position_ASC) {
      id
      title
      slug
      excerpt
      coverImage {
        alt
        id
        url
        width
        height
      }
    }
  }
`;
