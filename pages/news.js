import React from 'react';
import gql from 'graphql-tag';

import useRevalidateOnFocus from '../src/hooks/useRevalidateOnFocus';
import { DateText, Title, Text, View, Image } from '../src/presentational';
import initialProps from '../src/data/initialProps';
import Markdown from '../src/markdown';
import Layout from '../src/layout';
import Head from '../src/Head';
import Link from '../src/Link';

export function Page({ data, etag, meta = {} }) {
  useRevalidateOnFocus(etag);
  const {
    newsPage: { title, updatedAt, newsContent },
  } = data;
  return (
    <Layout>
      <Head>
        {meta.title && <title>{meta.title[0][0]}</title>}
        {meta.description && (
          <meta name="description" content={meta.description[0][0]} />
        )}
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
      <View key={id}>
        {title ? <Text>{title}</Text> : null}
        {when ? <Text>{when}</Text> : null}
        {where ? (
          <Text>
            long: {where.longitude} lat: {where.latitude}
          </Text>
        ) : null}
        {content ? <Markdown>{content}</Markdown> : null}
        {image ? <NewsImage image={image} /> : null}
        {gallery ? <NewsGallery gallery={gallery} /> : null}
        {video ? <NewsVideo video={video} /> : null}
      </View>
    ),
  );
}
function NewsImage({ image: { url, alt, width, height } }) {
  return <Image alt={alt} source={{ uri: url }} style={{ width, height }} />;
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
  return gallery.map(({ url, alt, width, height }) => (
    <Image
      key={url}
      alt={alt}
      source={{ uri: url }}
      style={{ width, height }}
    />
  ));
}

export const InitialQuery = gql`
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
        content(markdown: false)
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

Page.getInitialProps = ({ res }) => initialProps(res, InitialQuery);

export default Page;
