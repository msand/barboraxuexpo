import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Helmet } from 'react-helmet';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useQuery } from '@apollo/react-hooks';

import Link from './Link';
import Markdown from './markdown';
import { client } from './data/datocms';
import { Container, ErrorView, Text } from './presentational';

const isWeb = Platform.OS === 'web';

const layoutQuery = gql`
  query LayoutQuery {
    _site {
      globalSeo {
        siteName
      }
      faviconMetaTags {
        tag
        content
        attributes
      }
      favicon {
        url
      }
    }
    home {
      copyright
      introText(markdown: false)
      _seoMetaTags {
        tag
        content
        attributes
      }
      seoSettings {
        title
        twitterCard
        description
        image {
          url
        }
      }
    }
    allSocialProfiles(orderBy: position_ASC) {
      profileType
      url
    }
  }
`;

export const Row = styled.View`
  flex-direction: row;
  flex: 1;
`;
export const Main = styled.ScrollView`
  flex: 1;
`;
export const Sidebar = styled.View`
  flex: 1;
  display: ${props => (props.open ? 'flex' : 'none')};
`;
export const SidebarButton = styled.Button``;
export const SidebarTitle = styled.Text``;
export const SidebarMenu = styled.View``;
export const SidebarMenuItem = styled.View``;
export const SidebarSocial = styled.View``;
export const SidebarCopyright = styled.Text``;
export const Social = styled.View``;
export const MobileHeader = styled.View``;
export const MobileHeaderMenu = styled.View``;
export const MobileHeaderLogo = styled.View``;
export const SocialByProfile = () => <Social />;

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { loading, error, data } = useQuery(layoutQuery, { client });
  if (loading) {
    return <ErrorView>Loading...</ErrorView>;
  }
  if (error) {
    return <ErrorView>Error! {error.message}</ErrorView>;
  }

  const {
    home,
    _site,
    _seoMetaTags,
    faviconMetaTags,
    allSocialProfiles,
  } = data;
  const { siteName } = _site.globalSeo;
  const { copyright, introText } = home;

  return (
    <Row>
      <Sidebar open={sidebarOpen}>
        {isWeb ? <Helmet favicon={faviconMetaTags} seo={_seoMetaTags} /> : null}
        <SidebarTitle>
          <Link href="/">
            <Text>{siteName}</Text>
          </Link>
        </SidebarTitle>
        <Markdown>{introText}</Markdown>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/">
              <Text>Home</Text>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/about">
              <Text>About</Text>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSocial>
          {allSocialProfiles.map(({ profileType, url }) => (
            <Link key={profileType} href={url} target="blank">
              <SocialByProfile profile={profileType.toLowerCase()} />
            </Link>
          ))}
        </SidebarSocial>
        <SidebarCopyright>{copyright}</SidebarCopyright>
      </Sidebar>
      <Main>
        <MobileHeader>
          <MobileHeaderMenu>
            <SidebarButton
              onPress={() => setSidebarOpen(!sidebarOpen)}
              title="Menu"
            />
          </MobileHeaderMenu>
          <MobileHeaderLogo>
            <Link href="/">
              <Text>{siteName}</Text>
            </Link>
          </MobileHeaderLogo>
        </MobileHeader>
        <Container>{children}</Container>
      </Main>
    </Row>
  );
}
