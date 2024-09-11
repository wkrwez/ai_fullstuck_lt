import { useEffect, useRef } from 'react';
import { Easing, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const COLOR = '#ccf0fe';
const $squre1: ViewStyle = {
  position: 'absolute',
  left: 0,
  top: 10,
  width: 11,
  height: 11,
  borderRadius: 2,
  backgroundColor: COLOR
};
const $squre2: ViewStyle = {
  position: 'absolute',
  left: 9,
  top: 5,
  width: 4,
  height: 4,
  borderRadius: 500,
  backgroundColor: COLOR
};

const $squre3: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 15,
  width: 8,
  height: 6,
  borderRadius: 2,
  backgroundColor: COLOR
};

const $squre4: ViewStyle = {
  position: 'absolute',
  top: 21,
  left: 21,
  width: 10,
  height: 12,
  borderRadius: 2,
  backgroundColor: COLOR
};

interface ThinkingItemProps {
  style: ViewStyle;
  time: number;
}

export function ThinkingItem(props: ThinkingItemProps) {
  const opacityValue = useSharedValue(1);
  const translateX = useSharedValue(0);
  useEffect(() => {
    opacityValue.value = withDelay(
      props.time || 0,
      withRepeat(
        withTiming(0, { duration: 2000 }),
        -1 // -1表示无限循环
      )
    );
    translateX.value = withDelay(
      props.time || 0,
      withRepeat(
        withTiming(100, { duration: 2000 }),
        -1 // -1表示无限循环
      )
    );
  });
  const $animatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
    transform: [
      {
        translateX: translateX.value
      }
    ]
  }));
  return <Animated.View style={[props.style, $animatedStyle]}></Animated.View>;
}
export function Thinking() {
  return (
    <View
      style={{
        position: 'absolute',
        left: 140,
        top: 15
      }}
    >
      <ThinkingItem style={$squre1} time={100} />
      <ThinkingItem style={$squre2} time={300} />
      <ThinkingItem style={$squre3} time={500} />
      <ThinkingItem style={$squre4} time={700} />
    </View>
  );
}
