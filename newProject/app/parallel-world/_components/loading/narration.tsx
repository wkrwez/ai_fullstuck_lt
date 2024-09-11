import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { reportExpo } from '@/src/utils/report';
import { screen } from '../../_constants';

const narrationList = [
  '(正在推演世界走向...)',
  '(正在重塑时间线...)',
  '(正在建造空间...)',
  '(中止一片混沌...)',
  '(召唤所有灵魂...)'
];

const NARRATION_WIDTH = screen.width - 200;

const DELAY = 3000;

export default function Narration() {
  const [narrationIdx, setNarrationIdx] = useState(0);

  const $width = useSharedValue<number>(0);
  const $heigh = useSharedValue<number>(0);

  const fn = () => {
    setNarrationIdx(idx => (++idx < narrationList.length ? idx : 0));
  };

  useEffect(() => {
    $width.value = withDelay(
      DELAY,
      withRepeat(
        withSequence(
          withTiming(NARRATION_WIDTH, { duration: 2000 }),
          withDelay(
            1000,
            withTiming(0, { duration: 0 }, () => {
              runOnJS(fn)();
            })
          )
        ),
        -1
      )
    );
    $heigh.value = withDelay(DELAY - 200, withTiming(50, { duration: 200 }));

    reportExpo('loading', {}, true);
  }, []);

  const $style_A = useAnimatedStyle(() => ({
    width: $width.value,
    height: $heigh.value
  }));

  return (
    <View
      style={{
        alignItems: 'flex-start',
        width: NARRATION_WIDTH
      }}
    >
      <Animated.View
        style={[
          {
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          },
          $style_A
        ]}
      >
        <Text
          style={{
            position: 'absolute',
            color: 'white',
            width: NARRATION_WIDTH,
            textAlign: 'center'
          }}
        >
          {narrationList[narrationIdx]}
        </Text>
      </Animated.View>
    </View>
  );
}
