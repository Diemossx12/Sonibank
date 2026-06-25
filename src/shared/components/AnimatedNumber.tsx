import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedProps, withTiming, Easing
} from 'react-native-reanimated';

interface Props {
  value: number;
  style?: TextStyle;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatter?: (n: number) => string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export const AnimatedNumber: React.FC<Props> = ({
  value, style, prefix = '', suffix = '',
  duration = 800, formatter
}) => {
  const animValue = useSharedValue(0);

  useEffect(() => {
    animValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animProps = useAnimatedProps(() => {
    const formatted = formatter
      ? formatter(Math.round(animValue.value))
      : new Intl.NumberFormat('fr-FR').format(Math.round(animValue.value));
    return { children: `${prefix}${formatted}${suffix}` } as any;
  });

  return <AnimatedText animatedProps={animProps} style={style} />;
};
