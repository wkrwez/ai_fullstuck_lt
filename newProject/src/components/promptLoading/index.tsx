import { ReactNode, useEffect, useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { StyleSheet } from '@/src/utils';
import { Text } from '@Components/text';

const $itemStyle = {
  width: 8,
  height: 8,
  backgroundColor: '#5EA2D3'
};

const $textStyle = {
  color: '#9EC7E5',
  fontSize: 12
};
interface LoadingProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
export function Loading(props: LoadingProps) {
  const scale1Value = useSharedValue(0.5);
  const scale2Value = useSharedValue(1);
  const scale3Value = useSharedValue(0.5);

  useEffect(() => {
    scale1Value.value = withRepeat(
      withTiming(1, { duration: 500 }),
      -1, // -1表示无限循环
      true
    );
    scale2Value.value = withRepeat(
      withTiming(0.5, { duration: 600 }),
      -1, // -1表示无限循环
      true
    );
    scale3Value.value = withRepeat(
      withTiming(1, { duration: 700 }),
      -1, // -1表示无限循环
      true
    );
  }, []);
  const $animatedStyle1 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale1Value.value
        }
      ]
    };
  });
  const $animatedStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale2Value.value
        }
      ]
    };
  });
  const $animatedStyle3 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale3Value.value
        }
      ]
    };
  });
  return (
    <View style={[StyleSheet.rowStyle, { gap: 3 }, props.style]}>
      <Animated.View style={[$itemStyle, $animatedStyle1]}></Animated.View>
      <Animated.View style={[$itemStyle, $animatedStyle2]}></Animated.View>
      <Animated.View style={[$itemStyle, $animatedStyle3]}></Animated.View>
      <Text style={$textStyle}>{props.children}</Text>
    </View>
  );
}
