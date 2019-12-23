import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import styled from 'styled-components/native';

export const isWeb = Platform.OS === 'web';

export const Container = styled.View`
  align-items: center;
  max-width: 100%;
  width: 400px;
`;
export const View = styled.View`
  max-width: 100%;
`;
export const NewsContainer = styled(View)`
  justify-content: center;
`;
export const AbsoluteFill = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #fff;
`;
export const Title = styled(Text)`
  font-size: 20px;
`;
export const CenterText = styled(Text)`
  text-align: center;
`;
export const DateText = styled(Text)`
  font-size: 14px;
`;

// prettier-ignore
export const Image = styled.Image`
  resizeMode: contain;
  align-self: center;
  max-height: 300px;
  max-width: 100%;
`;

// prettier-ignore
export const FlexImage = styled(Image)`
  resizeMode: contain;
  min-height: 300px;
  width: 100%;
  flex: 1;
`;

export const StyledScrollView = styled.ScrollView`
  max-width: 100%;
  padding: 5px;
`;

export const Spacer = styled.View`
  height: ${props => props.h || '1px'};
  width: ${props => props.w || '1px'};
`;
export const Row = styled.View`
  flex-direction: row;
  flex: 1;
`;
export const Root = styled(Row)`
  background: #000;
`;
export const Main = styled.ScrollView`
  padding: 10px;
  flex: 1;
`;
export const Sidebar = styled.View`
  flex: 1;
  display: ${props => (props.open ? 'flex' : 'none')};
`;
export const SidebarScrollView = styled.ScrollView`
  margin-horizontal: 10;
  margin-vertical: 50;
`;
export const SidebarButton = styled.Button``;
export const SidebarTitle = styled(Text)``;
export const SidebarMenu = styled.View``;
export const SidebarMenuItem = styled.View`
  margin-bottom: 20px;
`;
export const SidebarSocial = styled.View``;
export const SidebarCopyright = styled(Text)``;
export const Social = styled.View``;
export const MobileHeader = styled.View``;
export const MobileHeaderMenu = styled.View`
  position: absolute;
  left: 5px;
  top: 5px;
`;
export const MobileHeaderLogo = styled.View``;
export const SocialByProfile = () => <Social />;

export const mainStyles = StyleSheet.create({
  scrollContent: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingBottom: 40,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export const ScrollView = ({ style, children, contentContainerStyle }) => (
  <StyledScrollView
    style={style}
    contentContainerStyle={
      contentContainerStyle
        ? StyleSheet.compose(mainStyles.scrollContent, contentContainerStyle)
        : mainStyles.scrollContent
    }
  >
    {children}
  </StyledScrollView>
);

export function LoadingView({ children }) {
  return (
    <View style={mainStyles.container}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
}

export function ErrorView({ children }) {
  return (
    <View style={mainStyles.container}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
}

export function DatoImage({ image: { url, alt, width, height }, style }) {
  const dim = { width, height };
  return (
    <Image alt={alt} source={{ uri: url }} style={style ? [dim, style] : dim} />
  );
}
