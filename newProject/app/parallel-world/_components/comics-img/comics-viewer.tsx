import ComicsImg from '.';
import React, { ReactElement, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  FlatList,
  Gesture,
  GestureDetector,
  ScrollView
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Circle, Path, PathProps, Svg } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DIFF_DISTANCE = 50;

const IMG_WIDTH = 300;
const IMG_HEIGHT = 400;

interface ComicsViewer<T> {
  data: T[];
  size: { width: number; height: number };
  curIndex: number;
  onPlayed: (data: T, index: number) => void;
  renderItem: (
    item: T,
    size: { width: number; height: number },
    index: number
  ) => ReactElement;
}

export default function ComicsViewer<T>({
  data,
  renderItem,
  onPlayed,
  curIndex,
  size
}: ComicsViewer<T>) {
  return (
    <View
      style={{
        // position: 'relative',
        borderColor: 'blue',
        borderWidth: 1,
        ...size
      }}
    >
      <View
        style={{
          position: 'absolute',
          borderColor: 'red',
          zIndex: -1
        }}
      >
        {renderItem(data[0], { width: IMG_WIDTH, height: IMG_HEIGHT }, 0)}
      </View>
      {data.slice(1).map((item, index) => (
        <ComicsImg
          key={index}
          data={item}
          curIndex={curIndex}
          render={renderItem}
          index={index}
          onCosmicPlayed={onPlayed}
        />
      ))}
    </View>
  );
}
