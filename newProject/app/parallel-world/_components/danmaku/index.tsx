import React, { ReactElement, useMemo } from 'react';
import { Dimensions, LayoutChangeEvent, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { $flexHCenter } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import DanmakuItem, { DanmakuItemProps } from './danmaku-item';

const speed = 1 / 12;

const { width: screenW } = Dimensions.get('window');

function divideList<T>(list: T[]) {
  const dividedArr: DanmakuItemProps<T>[][] = Array(5)
    .fill(null)
    .map(() => new Array());

  list.forEach((item, index) => {
    const targetIndex = index % 5;
    dividedArr[targetIndex].push({
      item: item,
      style: { marginHorizontal: Math.random() * 50 }
    });
  });
  return dividedArr;
}

export function DanmakuLine<T>({
  list,
  renderItem
}: {
  list: DanmakuItemProps<T>[];
  renderItem: (item: T) => ReactElement;
}) {
  return (
    <View style={{ ...$flexHCenter }}>
      {list.map((item, index) => {
        return (
          <DanmakuItem
            key={index}
            item={item.item}
            style={item.style}
            renderItem={renderItem}
          />
        );
      })}
    </View>
  );
}

interface DanmakuDisplayProps<T> {
  list: DanmakuItemProps<T>[][];
  renderItem: (item: T) => ReactElement;
}
function DanmakuFront<T>({ list, renderItem }: DanmakuDisplayProps<T>) {
  const translateX = useSharedValue(screenW);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  const handleLayout = (event: LayoutChangeEvent) => {
    const layoutW =
      event.nativeEvent.layout.width > screenW
        ? event.nativeEvent.layout.width
        : screenW;

    const startPosition1 = screenW;
    const startPosition2 = layoutW;
    const endPosition = -layoutW;

    const distance1 = startPosition1 - endPosition;
    const distance2 = startPosition2 - endPosition;

    translateX.value = withSequence(
      withTiming(endPosition, {
        easing: Easing.linear,
        duration: distance1 / speed
      }),
      withTiming(startPosition2, {
        easing: Easing.linear,
        duration: 0
      }),
      withRepeat(
        withTiming(endPosition, {
          easing: Easing.linear,
          duration: distance2 / speed
        }),
        -1,
        false
      )
    );
  };

  return (
    <Animated.View
      style={[
        animatedStyles,
        danmakuStyles.danmaku
        // { borderWidth: 1, borderColor: 'red' }
      ]}
      onLayout={handleLayout}
    >
      {list.map((item, index) => (
        <DanmakuLine key={index} list={item} renderItem={renderItem} />
      ))}
    </Animated.View>
  );
}

function DanmakuBack<T>({ list, renderItem }: DanmakuDisplayProps<T>) {
  const translateX = useSharedValue(screenW);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  // TODO: 后面再调整
  const handleLayout = (event: LayoutChangeEvent) => {
    const layoutW =
      event.nativeEvent.layout.width > screenW
        ? event.nativeEvent.layout.width
        : screenW;

    const starPosition = screenW;
    const starPosition2 = 0;
    const endPosition = -layoutW * 2;

    const distance1 = starPosition - endPosition;
    const distance2 = starPosition2 - endPosition;

    translateX.value = withSequence(
      withTiming(endPosition, {
        easing: Easing.linear,
        duration: distance1 / speed
      }),
      withTiming(starPosition2, {
        easing: Easing.linear,
        duration: 0
      }),
      withRepeat(
        withTiming(endPosition, {
          easing: Easing.linear,
          duration: distance2 / speed
        }),
        -1,
        false
      )
    );
  };

  return (
    <Animated.View
      style={[
        animatedStyles,
        danmakuStyles.danmaku
        // { borderWidth: 1, borderColor: 'blue' }
      ]}
      onLayout={handleLayout}
    >
      {list.map((item, index) => (
        <DanmakuLine key={index} list={item} renderItem={renderItem} />
      ))}
    </Animated.View>
  );
}

interface DanmakuProps<T> {
  list: T[];
  renderItem: (item: T) => ReactElement;
}
export default function Danmaku<T>({ list, renderItem }: DanmakuProps<T>) {
  const dividedList = useMemo<DanmakuItemProps<T>[][]>(
    () => divideList(list),
    [list]
  );
  return (
    <View style={danmakuStyles.container}>
      <DanmakuFront list={dividedList} renderItem={renderItem} />
      <DanmakuBack list={dividedList} renderItem={renderItem} />
    </View>
  );
}

const danmakuStyles = createStyle({
  container: {
    // position: 'absolute',
    top: 80,
    width: screenW - 44,
    overflow: 'hidden',
    flexDirection: 'row',
    height: screenW - 150
  },
  danmaku: {
    height: '100%',
    justifyContent: 'space-between'
  }
});
