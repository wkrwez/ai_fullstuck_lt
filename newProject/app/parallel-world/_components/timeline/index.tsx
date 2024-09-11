import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { createStyle } from '@/src/utils';
import { parallelWorldColors } from '../../_constants';

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
    section: S;
    index: number;
    active: number;
    isExpanded: boolean;
  }) => ReactElement;
  onActive: (active: number) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  // onSectionChange: (section: S, idx: number) => void;
}

export default function Timeline<S>({
  sections = [],
  collapseDelay = 2000,
  active,
  onActive,
  renderItem,
  onExpand,
  onCollapse
}: TimelineProps<S>) {
  const pressed = useSharedValue<boolean>(false);
  const offset = useSharedValue<number>(0);
  const pointerLocation = useSharedValue<number>(21);
  const [scaleSpacing, setScaleSpacing] = useState<number>(0);
  const $isExpanded = useSharedValue<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const collapseTimerRef = useRef<NodeJS.Timeout>();

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearInterval(collapseTimerRef.current);
    }
  };

  // 设置延迟折叠
  const collapse = () => {
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(() => {
      // isExpanded.value = false;
      setIsExpanded(false);
      onCollapse && onCollapse();
    }, collapseDelay);
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
    transform: [{ translateX: offset.value }],
    left: pointerLocation.value,
    opacity: withTiming($isExpanded.value ? 1 : 0)
  }));

  // 指针高亮样式
  const $highlightStyles_A = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value - 18 }],
    left: pointerLocation.value,
    opacity: withTiming($isExpanded.value ? 1 : 0)
  }));

  // 箭头指针样式
  const $arrowPointerStyle_A = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 1.2 : 1) }]
  }));

  // 线条样式
  const $axisStyles_A = useAnimatedStyle(() => {
    const width = pointerLocation.value - 21;
    return {
      width: withTiming(width, {
        easing: Easing.linear,
        duration: 200
      })
    };
  });

  const handleSelectionSelectByPress = (locationX: number) => {
    if (!sections.length) return;

    console.log('handleSelectionSelectByPress--------------->', locationX);

    const fixedOffset = locationX - 21 > 0 ? locationX - 21 : 0;
    const locationIndex = Math.round(fixedOffset / scaleSpacing);
    pressed.value = false;

    onActive(locationIndex);
    collapse();
  };

  const handleLongPressExpand = (locationX: number) => {
    console.log('handleLongPressExpand--------------->', locationX);

    // 处理press逻辑
    handleSelectionSelectByPress(locationX);
    // 处理长按逻辑
    setIsExpanded(true);
    onExpand && onExpand();
    collapse();
  };

  // TODO
  const pan = Gesture.Pan()
    .minDistance(20)
    .onBegin(() => {
      pressed.value = true;
      runOnJS(clearCollapseTimer)();
    })
    .onChange(event => {
      offset.value = event.translationX;
    })
    .onFinalize(e => {
      runOnJS(collapse)();
      pressed.value = false;

      if (scaleSpacing < 0) return;

      const locationIndex = Math.round(
        (pointerLocation.value + e.translationX - 21) / scaleSpacing
      );

      runOnJS(onActive)(locationIndex);
    });

  const longPress = Gesture.LongPress().onStart(e => {
    runOnJS(handleLongPressExpand)(e.x);
  });

  const press = Gesture.Tap().onEnd(e => {
    runOnJS(handleSelectionSelectByPress)(e.x);
  });

  const composed = Gesture.Exclusive(
    press,
    longPress
    // pan
  );

  useEffect(() => {
    if (sections[active] && scaleSpacing) {
      pointerLocation.value = active * scaleSpacing + 21;
      offset.value = 0;
    }
  }, [active, scaleSpacing]);

  useEffect(() => {
    $isExpanded.value = isExpanded;
  }, [isExpanded]);

  // 定时折叠
  useEffect(() => {
    collapse();
  }, []);

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
              const spacing =
                sections.length >= 1
                  ? scaleBarWidth / (sections.length - 1)
                  : -1;
              setScaleSpacing(spacing);
            }}
          >
            <Animated.View style={[$axisStyles_A, styles.$axisActive]} />
            {sections.map((section, index) => (
              <View style={styles.$scale}>
                {renderItem({
                  section,
                  index,
                  active,
                  isExpanded: isExpanded
                })}
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = createStyle({
  $timeline: {
    height: 42,
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
    alignItems: 'center',
    overflow: 'visible',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
