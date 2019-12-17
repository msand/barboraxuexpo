import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Seo from './Seo';
import Link from './Link';
import Markdown from './Markdown';
import { client } from './data/datocms';
import {
  CenterText,
  Container,
  ErrorView, isWeb,
  Main,
  mainStyles,
  MobileHeader,
  MobileHeaderLogo,
  MobileHeaderMenu,
  Root,
  Sidebar,
  SidebarButton,
  SidebarCopyright,
  SidebarMenu,
  SidebarMenuItem,
  SidebarScrollView,
  SidebarSocial,
  SidebarTitle,
  SocialByProfile,
  Text,
} from './presentational';

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
      introText(markdown: ${isWeb})
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

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { loading, error, data } = useQuery(layoutQuery, { client });
  if (loading) {
    return (
      <ErrorView>
        <Text>Loading...</Text>
      </ErrorView>
    );
  }
  if (error) {
    return (
      <ErrorView>
        <Text>Error! {error.message}</Text>
      </ErrorView>
    );
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
    <Root>
      <Seo favicon={faviconMetaTags} seo={_seoMetaTags} />
      <Sidebar open={sidebarOpen}>
        {sidebarOpen ? (
          <SidebarScrollView>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/">
                  <Text>Home</Text>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/news">
                  <Text>News</Text>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/about">
                  <Text>About</Text>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTitle>
              <Link href="/">
                <Text>{siteName}</Text>
              </Link>
            </SidebarTitle>
            <Markdown>{introText}</Markdown>
            <SidebarSocial>
              {allSocialProfiles.map(({ profileType, url }) => (
                <Link key={profileType} href={url}>
                  <SocialByProfile profile={profileType.toLowerCase()} />
                </Link>
              ))}
            </SidebarSocial>
            <SidebarCopyright>{copyright}</SidebarCopyright>
          </SidebarScrollView>
        ) : null}
      </Sidebar>
      <Main contentContainerStyle={mainStyles.scrollContent}>
        <MobileHeader>
          <MobileHeaderLogo>
            <Link href="/">
              <CenterText>{siteName}</CenterText>
            </Link>
          </MobileHeaderLogo>
        </MobileHeader>
        <Container>{children}</Container>
      </Main>
      <MobileHeaderMenu>
        <SidebarButton
          onPress={() => setSidebarOpen(!sidebarOpen)}
          title="Menu"
        />
      </MobileHeaderMenu>
    </Root>
  );
}

export default Layout;
