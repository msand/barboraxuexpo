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
export const ScrollView = styled.ScrollView``;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export function ErrorView({ children }) {
  return (
    <View style={styles.container}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  );
}
