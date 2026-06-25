import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSpring, Easing
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  style?: StyleProp<ViewStyle>;
}

export const FadeInView: React.FC<Props> = ({
  children, delay = 0, duration = 350, from = 'bottom', style
}) => {
  const opacity = useSharedValue(0);
  const offset  = useSharedValue(
    from === 'bottom' ? 24 : from === 'top' ? -24 :
    from === 'left'   ? -24 : from === 'right' ? 24 : 0
  );

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
    offset.value  = withDelay(delay, withSpring(0, { damping: 22, stiffness: 250 }));
  }, []);

  const animStyle = useAnimatedStyle(() => {
    const isHoriz = from === 'left' || from === 'right';
    return {
      opacity: opacity.value,
      transform: [
        isHoriz ? { translateX: offset.value } : { translateY: offset.value }
      ],
    };
  });

  return (
    <Animated.View style={[style, animStyle]}>{children}</Animated.View>
  );
};
