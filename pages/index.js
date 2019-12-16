// @generated: @expo/next-adapter@2.0.0-beta.9
import React from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components/native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Image, Text, Title, FlexImage } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Layout from '../src/Layout';
import Link from '../src/Link';
import Head from '../src/Head';

export const Showcase = styled.View``;
export const Card = styled.View``;
export const CardTitle = styled.Text``;
export const CardCaption = styled.View``;
export const CardDescription = styled.Text``;

function AllWorks({ allWorks }) {
  return (
    <>
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
    </>
  );
}

export function Page({
  etag,
  meta: { description, title: metaTitle } = {},
  data: {
    allWorks,
    home: {
      background: { url },
      introText,
      copyright,
    },
  },
}) {
  useRevalidateOnFocus(etag);
  return (
    <Layout>
      <Head>
        {metaTitle && <title>{metaTitle[0][0]}</title>}
        {description && <meta name="description" content={description[0][0]} />}
      </Head>
      <Link href="/news">
        <Text>News</Text>
      </Link>
      <FlexImage source={{ uri: url }} />
      <Title>{introText}</Title>
      {false && <AllWorks allWorks={allWorks} />}
      <Text>{copyright}</Text>
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
    home {
      background {
        url
      }
      introText
      copyright
    }
  }
`;

Page.getInitialProps = ({ res }) => initialProps(res, Query);

export default Page;
