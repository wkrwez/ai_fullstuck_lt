import { ReactNode, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// fix it: 提取到外部函数
export function SlideView(props: {
  children?: ReactNode;
  duration?: number;
  style?: ViewStyle;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(240, { duration: 250 });
  }, []);

  const $animateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY:translateY.value,}]
  }));

  return (
    <Animated.View
      style={[
        $animateStyle,
        props.style,
      ]}
    >
      {props.children}
    </Animated.View>
  );
}
