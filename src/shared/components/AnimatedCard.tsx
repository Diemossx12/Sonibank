import React, { useEffect } from 'react';
import { Platform, StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, Easing
} from 'react-native-reanimated';
import { colors, radius, shadow } from '../theme';

const isWeb = Platform.OS === 'web';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  padding?: number;
}

export const AnimatedCard: React.FC<Props> = ({
  children, style, delay = 0, padding = 16
}) => {
  const opacity      = useSharedValue(isWeb ? 1 : 0);
  const translateY   = useSharedValue(isWeb ? 0 : 20);

  useEffect(() => {
    if (isWeb) return;
    const timer = setTimeout(() => {
      opacity.value    = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (isWeb) {
    return (
      <View style={[styles.card, { padding }, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.card, { padding }, style, animStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    ...shadow.sm,
  },
});
