import React from 'react';
import gql from 'graphql-tag';
import { ScrollView } from 'react-native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import {
  DateText,
  DatoImage,
  Image,
  isWeb,
  NewsContainer,
  Text,
  Title,
  View,
} from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Markdown from '../src/Markdown';
import Layout from '../src/Layout';
import Head from '../src/Head';
import Link from '../src/Link';

export function Page({
  etag,
  meta: { description, title: metaTitle } = {},
  data: {
    newsPage: { title, updatedAt, newsContent },
  },
}) {
  useRevalidateOnFocus(etag);
  return (
    <Layout>
      <Head>
        {metaTitle && <title>{metaTitle[0][0]}</title>}
        {description && <meta name="description" content={description[0][0]} />}
      </Head>
      <Title>{title}</Title>
      <DateText>{updatedAt}</DateText>
      <NewsContent newsContent={newsContent} />
    </Layout>
  );
}
function NewsContent({ newsContent }) {
  return newsContent.map(
    ({ gallery, image, where, when, video, title, id, content }) => (
      <NewsContainer key={id}>
        {title ? <Text>{title}</Text> : null}
        {when ? <Text>{when}</Text> : null}
        {where ? (
          <Text>
            long: {where.longitude} lat: {where.latitude}
          </Text>
        ) : null}
        {content ? <Markdown>{content}</Markdown> : null}
        {image ? <DatoImage image={image} /> : null}
        {gallery ? <NewsGallery gallery={gallery} /> : null}
        {video ? <NewsVideo video={video} /> : null}
      </NewsContainer>
    ),
  );
}
function NewsVideo({
  video: { url, title, thumbnailUrl, alt, width, height },
}) {
  return (
    <Link href={url} title={title}>
      <View>
        <Text>{title}</Text>
        <Image
          alt={alt}
          style={{ width, height }}
          source={{ uri: thumbnailUrl }}
        />
      </View>
    </Link>
  );
}
function NewsGallery({ gallery }) {
  return (
    <View>
      {gallery.length ? (
        <ScrollView
          horizontal
          style={{
            flex: 1,
            maxHeight: 500,
            minHeight: 0,
            height: 500,
          }}
          contentContainerStyle={{
            maxWidth: gallery.length * 300,
          }}
        >
          {gallery.map(({ url, alt, width, height }) => (
            <Image
              key={url}
              alt={alt}
              source={{ uri: url }}
              style={{ width, height, maxWidth: 300 }}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

export const Query = gql`
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
        content(markdown: ${isWeb})
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

Page.getInitialProps = ({ res }) => initialProps(res, Query);

export default Page;
