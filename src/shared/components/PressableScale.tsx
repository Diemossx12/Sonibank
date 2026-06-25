import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, runOnJS
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scale?: number;
}

export const PressableScale: React.FC<Props> = ({
  children, onPress, style, scale = 0.96
}) => {
  const s = useSharedValue(1);

  const tap = Gesture.Tap()
    .onBegin(() => { s.value = withSpring(scale, { damping: 15, stiffness: 400 }); })
    .onFinalize(() => {
      s.value = withSpring(1, { damping: 15, stiffness: 400 });
      if (onPress) runOnJS(onPress)();
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[style, animStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
