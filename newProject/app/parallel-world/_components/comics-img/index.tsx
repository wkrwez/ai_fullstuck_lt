import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Path, PathProps, Svg } from 'react-native-svg';
import MaskedView from '@step.ai/masked-view';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ComicsImgProps<T> {
  data: T;
  index?: number;
  changeX?: SharedValue<number>;
  curIndex: number;
  render: (
    item: T,
    size: { width: number; height: number },
    index: number
  ) => ReactElement;
  onCosmicPlayed?: (data: T, index: number) => void;
}

const DIFF_DISTANCE = 50;

const IMG_WIDTH = 300;
const IMG_HEIGHT = 400;

function ComicsImg<T>({
  data,
  render,
  curIndex,
  index = -1,
  onCosmicPlayed
}: ComicsImgProps<T>) {
  const $curX = useSharedValue(IMG_WIDTH);

  const panGesture = Gesture.Pan()
    .minDistance(30)
    .onStart(e => {
      console.log('onStart', e);
      // $curX.value = withTiming(e.x - DIFF_DISTANCE);
    })
    .onChange(e => {
      let targetX = e.changeX + $curX.value;
      if (targetX > IMG_WIDTH) {
        targetX = IMG_WIDTH;
      } else if (targetX < -DIFF_DISTANCE) {
        targetX = -DIFF_DISTANCE;
      }
      $curX.value = targetX;
    })
    .onEnd(e => {
      const { translationX } = e;

      const origin = IMG_WIDTH;
      const destination = -DIFF_DISTANCE;

      if (translationX < 0) {
        if (e.translationX < -IMG_WIDTH / 5) {
          $curX.value = withTiming(destination);
        } else {
          $curX.value = withTiming(origin);
        }
      } else {
        if (e.translationX > IMG_WIDTH / 5) {
          $curX.value = withTiming(origin);
        } else {
          $curX.value = withTiming(destination);
        }
      }

      if (onCosmicPlayed) {
        runOnJS(onCosmicPlayed)(data, index);
      }
    });

  const curPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M ${$curX.value} 0 H ${IMG_WIDTH} V ${IMG_HEIGHT} H ${$curX.value + DIFF_DISTANCE} L ${$curX.value} 0 Z`;
    return {
      d: d
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={{
          position: 'absolute',
          borderColor: 'red',
          zIndex: index === curIndex + 1 ? 100 : index - curIndex
        }}
      >
        <MaskedView
          style={{
            width: IMG_WIDTH,
            height: IMG_HEIGHT
          }}
          maskElement={
            <Svg height={IMG_HEIGHT} width={IMG_WIDTH}>
              <AnimatedPath animatedProps={curPathProps} />
            </Svg>
          }
        >
          {render(data, { width: IMG_WIDTH, height: IMG_HEIGHT }, index)}
        </MaskedView>
      </View>
    </GestureDetector>
  );
}

export default ComicsImg;
