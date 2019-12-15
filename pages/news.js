import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Text, View } from 'react-native';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { Container, DateText, Title } from '../src/presentational';
import initialProps from '../src/data/initialProps';

export default function NewsPage({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  const {
    newsPage: { title, updatedAt, newsContent },
  } = data;
  return (
    <Container>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Title>{title}</Title>
      <DateText>{updatedAt}</DateText>
      <NewsContent newsContent={newsContent} />
    </Container>
  );
}
function NewsContent({ newsContent }) {
  return newsContent.map(
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
  );
}
function NewsImage({ image: { url, alt, width, height } }) {
  return <img src={url} alt={alt} width={width} height={height} />;
}
function NewsVideo({
  video: { url, title, thumbnailUrl, alt, width, height },
}) {
  return (
    <a href={url} title={title}>
      {title}
      <img src={thumbnailUrl} alt={alt} width={width} height={height} />
    </a>
  );
}
function NewsGallery({ gallery }) {
  return gallery.map(({ url, alt, width, height }) => (
    <img src={url} key={url} alt={alt} width={width} height={height} />
  ));
}

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

NewsPage.getInitialProps = ({ res }) => initialProps(res, newsPageQuery);
