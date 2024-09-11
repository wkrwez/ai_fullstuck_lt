import React from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Image } from '@/src/components';
import { colors } from '@/src/theme';
import { createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import { parallelWorldColors } from '../../_constants';

const MOCK_AVATAR = require('@Assets/mock/img1.jpg');

interface TimelineProps {
  sections: string[];
}

export default function ProgressBar({ sections = [] }: TimelineProps) {
  const pressed = useSharedValue<boolean>(false);
  const offset = useSharedValue<number>(0);
  const pointerLocation = useSharedValue<number>(12);
  const scaleSpacing = useSharedValue<number>(0);
  const scaleIndex = useSharedValue<number>(1);

  const $pointerAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      { scale: withTiming(pressed.value ? 1.2 : 1) }
    ],
    left: pointerLocation.value
  }));

  const $barAnimatedStyles = useAnimatedStyle(() => {
    const width =
      scaleIndex.value === sections.length - 1
        ? pointerLocation.value + 12 + 2
        : pointerLocation.value;

    return {
      width: withTiming(width, {
        easing: Easing.linear,
        duration: 200
      })
    };
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange(event => {
      offset.value = event.translationX;
    })
    .onFinalize(e => {
      const locationIndex = Math.round(
        (pointerLocation.value + e.translationX - 12) / scaleSpacing.value
      );

      scaleIndex.value = locationIndex;
      pointerLocation.value = locationIndex * scaleSpacing.value + 12;
      pressed.value = false;
      offset.value = 0;
    });

  return (
    <View style={styles.$timeline}>
      <Animated.View
        style={[
          {
            borderColor: parallelWorldColors.fontGlow,
            backgroundColor: parallelWorldColors.bgGlow
          },
          $barAnimatedStyles
        ]}
      ></Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.$pointer, $pointerAnimatedStyles]} />
      </GestureDetector>
      <View
        style={styles.$scaleBar}
        onLayout={e => {
          const scaleBarWidth = e.nativeEvent.layout.width;
          const spacing =
            sections.length > 1
              ? (scaleBarWidth - 24 - 2) / (sections.length - 1)
              : 0;

          scaleSpacing.value = spacing;
        }}
      >
        {sections.map((section, index) => (
          <View style={styles.$scale}>
            <Image
              source={MOCK_AVATAR}
              style={[
                styles.$avatar,
                { transform: [{ scale: index === 3 ? 1.2 : 1 }] }
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = createStyle({
  $timeline: {
    height: 48,
    flexDirection: 'row',
    backgroundColor: parallelWorldColors.bgGlow,
    borderRadius: 12,
    borderColor: parallelWorldColors.fontGlow,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  $pointer: {
    borderColor: parallelWorldColors.fontGlow,
    borderRightWidth: 2,
    position: 'absolute',
    height: '100%'
  },
  $scaleBar: {
    width: '100%',
    position: 'absolute',
    borderColor: 'red',
    bottom: 38,
    height: 4,
    overflow: 'visible',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    zIndex: 1,
    pointerEvents: 'none'
  },
  $scale: {
    width: 2,
    height: 42,
    borderBottomWidth: 4,
    borderColor: parallelWorldColors.fontGlow,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none'
  },
  $avatar: {
    ...createCircleStyle(24),
    borderWidth: 1,
    borderColor: colors.white,
    pointerEvents: 'none'
  }
});
