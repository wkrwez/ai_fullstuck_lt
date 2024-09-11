import * as Haptics from 'expo-haptics';
import React, {
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View,
  ViewStyle
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { createStyle } from '@/src/utils';
import { TIMELINE_HEIGHT, parallelWorldColors } from '../../_constants';
import colors from './colors';

// TODO: 空状态处理 -> 暂时在数据加载完后渲染组件

export const TIMELINE_ACTIVE = 'rgba(75, 107, 137, 1)';
export const TIMELINE_NEGATIVE = 'rgba(39, 52, 66, 1)';

const TIMELINE_BG = 'rgba(67, 95, 124, 0.12)';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export interface TimelineProps<S> {
  sections: S[];
  collapseDelay?: number;
  // 激活状态外部控制
  active: number;
  renderItem: (item: {
    style: ViewStyle;
    section: S;
    index: number;
    active: number;
    isExpanded: SharedValue<number>;
    totalLen: SharedValue<number>;
    color: string;
  }) => ReactElement;
  onActive: (active: number) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  color: string;
  avatarVisibleIndexList: number[];
  // onSectionChange: (section: S, idx: number) => void;
}

export default function Timeline<S>({
  sections = [],
  collapseDelay = 2000,
  active,
  onActive,
  renderItem,
  onExpand,
  onCollapse,
  color
}: TimelineProps<S>) {
  const pressed = useSharedValue<boolean>(false);
  const offset = useSharedValue<number>(0);

  const { width } = useScreenSize('window');
  const lastLocationRef = useRef(21);
  const scaleBarWidthRef = useRef(width - 21 * 2 - 36);
  const pointerLocation = useSharedValue<number>(21);
  // const [scaleSpacing, setScaleSpacing] = useState<number>(0);
  const $isExpanded = useSharedValue<number>(1);

  const panStartXRef = useRef(0);
  const pointsPosRef = useRef<number[]>([]);

  const collapseTimerRef = useRef<NodeJS.Timeout>();

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearInterval(collapseTimerRef.current);
    }
  };

  const $timelineBgStye_A = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        $isExpanded.value ? TIMELINE_BG : 'transparent'
      )
    };
  });

  // 指针样式
  const $pointerStyles_A = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value + 2 }],
    left: pointerLocation.value + 21,
    opacity: withTiming($isExpanded.value ? 1 : 0)
  }));

  // 指针高亮样式
  const $highlightStyles_A = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value - 16 }],
    left: pointerLocation.value + 21,
    opacity: withTiming($isExpanded.value ? 1 : 0)
  }));

  // 箭头指针样式
  const $arrowPointerStyle_A = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 1.2 : 1) }]
  }));

  // 线条样式
  const $axisStyles_A = useAnimatedStyle(() => {
    const width = pointerLocation.value;
    return {
      width: withTiming(width, {
        easing: Easing.linear,
        duration: 200
      })
    };
  });

  const press = Gesture.Tap()
    .onTouchesDown(e => {
      $isExpanded.value = 1;
      onExpand && runOnJS(onExpand)();
    })
    .onTouchesUp(e => {
      pointerLocation.value = e.allTouches[0].absoluteX;
      runOnJS(goEnd)(0);
    });

  const pan = Gesture.Pan()
    .onStart(e => {
      panStartXRef.current = e.absoluteX;
      pointerLocation.value = e.absoluteX;
      $isExpanded.value = 1;
      onExpand && runOnJS(onExpand)();
      runOnJS(Haptics.impactAsync)();
      // onExpand && runOnJS(onExpand)();
    })
    .onUpdate(e => {
      const diff = e.absoluteX + e.velocityX / 50 - panStartXRef.current;
      // pointerLocation.value = lastLocationRef.current + diff;
      pointerLocation.value = e.absoluteX;
    })
    .onEnd(e => {
      runOnJS(goEnd)(e.velocityX);
    });

  const scaleSpacing = useMemo(() => {
    return sections.length >= 1
      ? scaleBarWidthRef.current / (sections.length - 1)
      : -1;
  }, [sections]);

  const pointsPos = useMemo(() => {
    // const len = sections.length + 1;
    // const interval = (width - 42) / len;
    return sections.map((_, index) => index * scaleSpacing);
  }, [sections, scaleSpacing]);

  // useEffect(() => {
  //   const spacing =
  //     sections.length >= 1
  //       ? scaleBarWidthRef.current / (sections.length - 1)
  //       : -1;
  //   setScaleSpacing(spacing);
  // }, [sections]);

  useEffect(() => {
    pointsPosRef.current = pointsPos;
  }, [pointsPos]);

  useEffect(() => {
    if (sections[active] && scaleSpacing) {
      pointerLocation.value = active * scaleSpacing;
      lastLocationRef.current = active * scaleSpacing;
      offset.value = 0;
    }
  }, [active, scaleSpacing]);

  // useEffect(() => {
  //   $isExpanded.value = isExpanded;
  // }, [isExpanded]);

  // 定时折叠
  useEffect(() => {
    $isExpanded.value = 1;
    $isExpanded.value = withDelay(
      3000,
      withTiming(0, { duration: 300 }, () => {
        onCollapse && runOnJS(onCollapse)();
      })
    );
    // collapse();
  }, []);

  const composed = Gesture.Exclusive(
    pan,
    press
    // pan
  );

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.$timeline, $timelineBgStye_A]}>
        <AnimatedLinearGradient
          colors={[
            'rgba(127, 217, 255, 0)',
            'rgba(127, 217, 255, 0.5)',
            'rgba(127, 217, 255, 0)'
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[styles.$highlight, $highlightStyles_A]}
        ></AnimatedLinearGradient>
        <Animated.View style={[styles.$pointer, $pointerStyles_A]}>
          <Animated.View style={[styles.$arrowPointer, $arrowPointerStyle_A]} />
        </Animated.View>
        <View style={{ paddingHorizontal: 21 }}>
          <View
            style={styles.$axis}
            onLayout={e => {
              const scaleBarWidth = e.nativeEvent.layout.width;
              scaleBarWidthRef.current = scaleBarWidth;
              // setTotalWidth(scaleBarWidth)
              // const spacing =
              //   sections.length >= 1
              //     ? scaleBarWidth / (sections.length - 1)
              //     : -1;
              // setScaleSpacing(spacing);
            }}
          >
            <Animated.View style={[$axisStyles_A, styles.$axisActive]} />
            {sections.map((section, index) =>
              renderItem({
                style: { left: pointsPos[index] },
                totalLen: pointerLocation,
                section,
                index,
                active,
                color: colors[index % colors.length],
                isExpanded: $isExpanded
              })
            )}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );

  function goEnd(v: number) {
    const closestIndex = Math.min(
      findClosestIndex(pointsPosRef.current, pointerLocation.value, v),
      sections.length - 1
    );
    const endVal = pointsPosRef.current[closestIndex] + 3;
    console.log(999999, sections.length - 1, pointsPosRef.current.length);
    pointerLocation.value = withTiming(endVal, { duration: 300 }, () => {
      runOnJS(onActive)(closestIndex);
    });
    lastLocationRef.current = endVal;
    $isExpanded.value = 0;
    // alert(closestIndex);
    // onActive(closestIndex);
    // collapse();
    onCollapse && runOnJS(onCollapse)();
    Haptics.impactAsync();
    // setIsExpanded(false);
  }

  function onPress(index: number) {}
}

function findClosestIndex(arr: number[], target1: number, v: number) {
  // console.log('findClosestIndex--------->', arr, target);
  const target = target1 + v / 50;
  let closestIndex = 0;
  let closestValue = arr[closestIndex];
  let closestDiff = Math.abs(arr[0] - target);

  if (target > arr[arr.length - 1]) {
    closestIndex = arr.length - 1;
  } else {
    for (let i = 1; i < arr.length; i++) {
      const diff = Math.abs(arr[i] - target);

      if (diff < closestDiff) {
        closestDiff = diff;
        closestValue = arr[i];
        closestIndex = i;
      }
    }
  }

  console.log('findClosestIndex--------->', closestIndex, v);

  // if (!v) {
  //   return closestIndex;
  // }

  // if (v > 0) {
  //   if (
  //     arr[closestIndex + 1] &&
  //     Math.abs(arr[closestIndex + 1] - target) > closestDiff
  //   )
  //     return closestIndex + 1;
  // }

  // if (
  //   arr[closestIndex - 1] &&
  //   Math.abs(arr[closestIndex - 1] - target) > closestDiff
  // ) {
  //   return closestIndex - 1;
  // }
  if (v < 0 && closestIndex === 1 && arr[1] - target > 0) {
    return 0;
  }
  return Math.max(closestIndex, 0);
}

const styles = createStyle({
  $timeline: {
    height: TIMELINE_HEIGHT,
    alignItems: 'stretch',
    justifyContent: 'center',
    borderRadius: 21,
    overflow: 'hidden',
    position: 'relative'
  },
  $highlight: {
    position: 'absolute',
    height: '100%',
    width: 36,
    backgroundColor: 'transparent',
    transform: [{ translateX: -50 }],
    pointerEvents: 'none'
  },
  $pointer: {
    backgroundColor: 'transparent',
    width: 1,
    position: 'absolute',
    height: '100%'
  },
  $arrowPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    borderRightWidth: 4,
    borderRightColor: 'transparent',
    borderTopWidth: 4,
    borderTopColor: parallelWorldColors.fontGlow,
    left: -4,
    zIndex: 100
  },
  $axis: {
    height: 2,
    backgroundColor: TIMELINE_NEGATIVE,
    // alignItems: 'center',
    // overflow: 'visible',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    zIndex: 1,
    position: 'relative',
    pointerEvents: 'none'
  },
  $axisActive: {
    height: 2,
    position: 'absolute',
    backgroundColor: TIMELINE_ACTIVE,
    zIndex: 0
  },
  $scale: {
    width: 1,
    height: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
    // pointerEvents: 'none'
  }
});
