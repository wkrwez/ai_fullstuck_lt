import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

// fix it: 提取到外部函数
export function BounceView(props: {
  children?: ReactNode;
  duration?: number;
  ratio?: number;
  style?: ViewStyle;
}) {
  const animation = useRef(new Animated.Value(0)).current;
  const { duration = 300, ratio = 0.8 } = props;

  const startAnimation = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration,
      easing: Easing.elastic(1),
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const scale = animation.interpolate({
    inputRange: [ratio / 2, ratio, 1],
    outputRange: [ratio / 2, ratio, 1] // Adjust the values as needed
  });
  const opacity = animation.interpolate({
    inputRange: [0, ratio],
    outputRange: [0, ratio] // Adjust the values as needed
  });

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity }, props.style]}>
      {props.children}
    </Animated.View>
  );
}
