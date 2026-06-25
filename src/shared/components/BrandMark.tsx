import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  size?: number;
  style?: ViewStyle;
  variant?: 'white' | 'color';
}

export const BrandMark: React.FC<Props> = ({
  size = 32, style, variant = 'white'
}) => (
  <View style={[
    styles.wrap,
    {
      width: size,
      height: size,
      borderRadius: size * 0.22,
      backgroundColor: variant === 'white'
        ? 'rgba(255,255,255,0.20)'
        : '#FFFFFF',
    },
    style
  ]}>
    <Image
      source={require('../assets/logo2.png')}
      style={{ width: size * 0.65, height: size * 0.65 }}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
