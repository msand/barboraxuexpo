import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  flex: 1;
`;
export const View = styled.View``;

export const Title = styled.Text`
  font-size: 20px;
  flex: 1;
`;
export const Text = styled.Text`
  font-size: 16px;
`;
export const DateText = styled.Text`
  font-size: 14px;
`;
export const Image = styled.Image`
  max-height: 300px;
  max-width: 300px;
`;
export const StyledScrollView = styled.ScrollView`
  padding: 5px;
`;

export const Row = styled.View`
  flex-direction: row;
  flex: 1;
`;
export const Main = styled.ScrollView`
  margin: 5px;
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

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export const ScrollView = ({ style, children, contentContainerStyle }) => (
  <StyledScrollView
    style={style}
    contentContainerStyle={
      contentContainerStyle
        ? StyleSheet.compose(styles.scrollContent, contentContainerStyle)
        : styles.scrollContent
    }
  >
    {children}
  </StyledScrollView>
);

export function ErrorView({ children }) {
  return (
    <View style={styles.container}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
}

export function DatoImage({ image: { url, alt, width, height } }) {
  return <Image alt={alt} source={{ uri: url }} style={{ width, height }} />;
}
