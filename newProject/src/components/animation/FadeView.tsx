import { ReactNode, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

export function FadeView(props: {
  children?: ReactNode;
  duration?: number;
  style?: ViewStyle;
  pointerEvents?:
    | 'box-none'
    | 'none'
    | 'box-only'
    | 'auto'
    | 'none'
    | 'box-only'
    | 'auto';
}) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const $animateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Animated.View
      style={[$animateStyle, props.style]}
      pointerEvents={props.pointerEvents}
    >
      {props.children}
    </Animated.View>
  );
}
