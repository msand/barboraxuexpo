// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, Title, Image, Text } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Layout from '../src/Layout';
import Link from '../src/Link';
import Head from '../src/Head';

export const Showcase = styled.View``;
export const Card = styled.View``;
export const CardTitle = styled.Text``;
export const CardCaption = styled.View``;
export const CardDescription = styled.Text``;

export function Page({
  etag,
  meta: { description, title: metaTitle } = {},
  data: { allWorks },
}) {
  useRevalidateOnFocus(etag);
  return (
    <Layout>
      <Container>
        <Head>
          {metaTitle && <title>{metaTitle[0][0]}</title>}
          {description && (
            <meta name="description" content={description[0][0]} />
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
        {allWorks.map(({ id, title, slug, excerpt, coverImage }) => (
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
                <Link
                  href="/works/[slug]"
                  as={`/works/${slug}`}
                  variables={{ slug }}
                >
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
export const Query = gql`
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

Page.getInitialProps = ({ res }) => initialProps(res, Query);

export default Page;
