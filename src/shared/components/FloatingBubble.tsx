import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withTiming, withDelay,
  withSequence, Easing
} from 'react-native-reanimated';

interface Props {
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
  color?: string;
}

export const FloatingBubble: React.FC<Props> = ({
  size, x, y, delay: d, duration, opacity, color = 'rgba(255,255,255,0.18)'
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale      = useSharedValue(1);
  const op         = useSharedValue(0);

  useEffect(() => {
    op.value = withDelay(d, withTiming(opacity, { duration: 800 }));

    translateY.value = withDelay(
      d,
      withRepeat(
        withSequence(
          withTiming(-18, { duration: duration * 0.5, easing: Easing.inOut(Easing.sin) }),
          withTiming(0,   { duration: duration * 0.5, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, true
      )
    );

    translateX.value = withDelay(
      d + 200,
      withRepeat(
        withSequence(
          withTiming(8,  { duration: duration * 0.7, easing: Easing.inOut(Easing.sin) }),
          withTiming(-8, { duration: duration * 0.7, easing: Easing.inOut(Easing.sin) }),
        ),
        -1, true
      )
    );

    scale.value = withDelay(
      d + 400,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: duration * 0.6, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.94, { duration: duration * 0.6, easing: Easing.inOut(Easing.quad) }),
        ),
        -1, true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   op.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position:     'absolute',
          left:         x,
          top:          y,
          width:        size,
          height:       size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth:  1,
          borderColor:  'rgba(255,255,255,0.35)',
        },
        animStyle,
      ]}
    />
  );
};
