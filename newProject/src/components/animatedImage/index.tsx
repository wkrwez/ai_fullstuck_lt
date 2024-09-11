import { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Image, ImageProps } from '@Components/image';

interface Props {
  style: StyleProp<ViewStyle>;
  duration: number;
  source: ImageProps['source'];
  onHalf?: () => void;
  halfTime?: number;
  onFinish?: () => void;
  delay?: number;
  loop?: boolean;
  resizeMode?: 'cover' | 'contain';
}
export function AnimatedImage(props: Props) {
  const opacityVal = useSharedValue(props.delay ? 0 : 1);
  const shareVal = useSharedValue(1);
  const delayVal = useSharedValue(1);

  useEffect(() => {
    if (props.onHalf) {
      shareVal.value = withDelay(
        props.halfTime || props.duration / 2,
        withTiming(0, { duration: 10 }, () => {
          props.onHalf && runOnJS(props.onHalf)();
        })
      );
    }

    if (props.delay) {
      delay(props.delay);
    } else {
      opacityVal.value = withDelay(
        props.duration,
        withTiming(0, { duration: 10 }, () => {
          props.onFinish && runOnJS(props.onFinish)();
        })
      );
    }
  }, []);
  const $animateStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityVal.value
    };
  });
  return (
    <Animated.View style={[$animateStyle, props.style]} pointerEvents="none">
      <Image
        source={props.source}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: props.resizeMode || 'cover'
        }}
      />
    </Animated.View>
  );

  // TODO 临时
  function delay(time: number) {
    opacityVal.value = withSequence(
      withDelay(time, withTiming(1, { duration: 10 })),
      withDelay(
        props.duration,
        withTiming(0, { duration: 10 }, () => {
          if (props.loop) {
            runOnJS(delay)(time);
          }
        })
      )
    );
  }
}
