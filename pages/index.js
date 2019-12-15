// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, Title, Image, Text } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Layout from '../src/layout';
import Link from '../src/Link';
import Head from '../src/Head';

export const Showcase = styled.View``;
export const Card = styled.View``;
export const CardCaption = styled.View``;
export const CardDescription = styled.Text``;
export const CardTitle = styled.Text``;

export function Page({ data, etag, meta = {} }) {
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

        <Title>
          Welcome to Expo + Next.js{' '}
          <Text role="img" aria-label="Greeting hand">
            👋
          </Text>
        </Title>
        <Link href="/news">
          <Text>News</Text>
        </Link>

        {data.allWorks.map(({ id, title, slug, excerpt, coverImage }) => (
          <Showcase key={id}>
            <Card>
              <Link
                href="/works/[slug]"
                as={`/works/${slug}`}
                variables={{ slug }}
              >
                <Image
                  alt={coverImage.alt}
                  style={{ width: 50, height: 50 }}
                  source={{ uri: coverImage.url }}
                />
              </Link>
              <CardCaption>
                <Link href="/works/[slug]" as={`/works/${slug}`} variables={{ slug }}>
                  <CardTitle>{title}</CardTitle>
                </Link>
                <CardDescription>
                  <Text>{excerpt}</Text>
                </CardDescription>
              </CardCaption>
            </Card>
          </Showcase>
        ))}
      </Container>
    </Layout>
  );
}
export const InitialQuery = gql`
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

Page.getInitialProps = ({ res }) => initialProps(res, InitialQuery);
export default Page;
