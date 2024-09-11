import { Dialog, abstractActStoryText, getGenImgWidthByHeight } from '.';
import { ResizeMode, Video } from 'expo-av';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions, // Image,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { colors, typography } from '@/src/theme';
import { Image } from '@Components/image';
import { AnimationDir, MaskImages } from '../mask-images';
import {
  ActDialog,
  ActItem,
  ActStory,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { ActType } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { DialogStreamItem, StoryStreamItem } from './stream-text-item';

const PARALLEL_WORLD_ENTRY_VIDEO = require('@Assets/mp4/parallel-world/entry.mp4');

export const DEFAULT_TEXT_DISPLAY_DELAY = 1000;
export const DEFAULT_TEXT_DISPLAY_DUR = 1000;

export default function EnterVideo({
  isLoading,
  videoText,
  onFinish,
  textDisplayDelay = DEFAULT_TEXT_DISPLAY_DELAY,
  textDisplayDur = DEFAULT_TEXT_DISPLAY_DUR
}: {
  isLoading: boolean;
  videoText: string;
  onFinish?: () => void;
  textDisplayDelay?: number;
  textDisplayDur?: number;
}) {
  const $firstImgTextOpacity = useSharedValue(0);

  const $firstTextStyle_a = useAnimatedStyle(() => {
    return { opacity: $firstImgTextOpacity.value };
  });

  useEffect(() => {
    $firstImgTextOpacity.value = withDelay(
      textDisplayDelay,
      withTiming(1, { duration: textDisplayDur }, isAnimationFinished => {
        if (isAnimationFinished) onFinish && runOnJS(onFinish)();
      })
    );
  }, []);

  return (
    isLoading && (
      <Animated.View
        exiting={FadeOut.duration(200)}
        style={{
          top: 12,
          bottom: 12,
          left: 12,
          right: 12,
          position: 'absolute',
          zIndex: 10
        }}
      >
        <Video
          source={PARALLEL_WORLD_ENTRY_VIDEO}
          style={{ width: '100%', height: '100%' }}
          // useNativeControls
          shouldPlay
          resizeMode={ResizeMode.COVER}
        />
        <Animated.View
          style={[
            [
              {
                position: 'absolute',
                with: '100%',
                left: 0,
                right: 0,
                top: '40%',
                zIndex: 100
              },
              $firstTextStyle_a
            ]
          ]}
        >
          <Text
            style={{
              textAlign: 'center',
              fontFamily: typography.fonts.world,
              color: 'white'
            }}
          >
            {videoText}
          </Text>
        </Animated.View>
      </Animated.View>
    )
  );
}
