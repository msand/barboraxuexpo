import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  flex: 1;
`;
export const View = styled.View``;
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
  flex: 1;
`;
export const CenterText = styled(Text)`
  text-align: center;
`;
export const DateText = styled(Text)`
  font-size: 14px;
`;
export const Image = styled.Image`
  resizeMode: contain;
  max-height: 300px;
  max-width: 100%;
`;
export const FlexImage = styled(Image)`
  resizeMode: contain;
  min-height: 300px;
  width: 100%;
  flex: 1;
`;
export const StyledScrollView = styled.ScrollView`
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
  padding: 5px;
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
  left: 0;
`;
export const MobileHeaderLogo = styled.View``;
export const SocialByProfile = () => <Social />;

export const mainStyles = StyleSheet.create({
  scrollContent: {
    marginBottom: 40,
    paddingBottom: 40,
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
