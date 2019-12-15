// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { useRevalidateOnFocus } from '../src/hooks/useRevalidateOnFocus';
import initialProps from '../src/data/initialProps';

export default function Page({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  return (
    <View style={styles.container}>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>

      <Text style={styles.text}>Welcome to Expo + Next.js 👋</Text>
      <Link href="/news">
        <a>News</a>
      </Link>

      {data.allWorks.map(({ id, title, slug, excerpt, coverImage }) => (
        <View key={id} style={styles.showcase_item}>
          <View style={styles.card}>
            <Link href="/works/[slug]" as={`/works/${slug}`}>
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
                <Link href="/works/[slug]" as={`/works/${slug}`}>
                  <a>{title}</a>
                </Link>
              </Text>
              <View style={styles.card_description}>
                <Text>{excerpt}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
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

Page.getInitialProps = async ({ res }) => await initialProps(res, indexQuery);

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
