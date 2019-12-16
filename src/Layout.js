import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Seo from './Seo';
import Link from './Link';
import Markdown from './Markdown';
import { client } from './data/datocms';
import {
  Container,
  ErrorView,
  Main,
  MobileHeader,
  MobileHeaderLogo,
  MobileHeaderMenu,
  Row,
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
    <Row>
      <Seo favicon={faviconMetaTags} seo={_seoMetaTags} />
      <Sidebar open={sidebarOpen}>
        {sidebarOpen ? (
          <SidebarScrollView>
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
          </SidebarScrollView>
        ) : null}
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

export default Layout;
