// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, Title } from '../src/presentational';
import initialProps from '../src/data/initialProps';

export const Showcase = styled.View``;
export const Card = styled.View``;
export const CardCaption = styled.View``;
export const CardDescription = styled.Text``;
export const CardTitle = styled.Text``;

export default function Page({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  return (
    <Container>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>

      <Title>
        Welcome to Expo + Next.js{' '}
        <span role="img" aria-label="Greeting hand">
          👋
        </span>
      </Title>
      <Link href="/news">
        <a>News</a>
      </Link>

      {data.allWorks.map(({ id, title, slug, excerpt, coverImage }) => (
        <Showcase key={id}>
          <Card>
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
            <CardCaption>
              <CardTitle>
                <Link href="/works/[slug]" as={`/works/${slug}`}>
                  <a>{title}</a>
                </Link>
              </CardTitle>
              <CardDescription>
                <Text>{excerpt}</Text>
              </CardDescription>
            </CardCaption>
          </Card>
        </Showcase>
      ))}
    </Container>
  );
}

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

Page.getInitialProps = ({ res }) => initialProps(res, indexQuery);
