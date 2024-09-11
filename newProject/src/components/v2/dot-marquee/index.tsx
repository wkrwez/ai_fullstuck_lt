import { useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { $Z_INDEXES } from '@/src/theme/variable';
import { useIsFocused } from '@react-navigation/native';

interface IDotMarquee {
  length: number;
  activeIndex?: number;
  defaultColor?: string;
  highlightColor?: string;
  gapDuration?: number;
  autoLoop?: boolean;
  dotRender?: (isActive: boolean, index: number) => React.ReactNode;
  onPress?: (e: GestureResponderEvent, index: number) => void;
  handleIndexChange?: (index: number) => void;
}

function Dot({
  isActive,
  defaultColor = '#000',
  highlightColor = '#000000cc'
}: Partial<IDotMarquee> & { isActive: boolean }) {
  const dotColor = useSharedValue('rgba(255, 255, 255,0.8)');
  const dotWidth = useSharedValue(4);
  const dotHeight = useSharedValue(4);
  const dotRadius = useSharedValue(2);

  const TRANS_DURATION = 200;

  // TODO: 如果更通用就要暴露 size
  useEffect(() => {
    if (isActive) {
      dotColor.value = withTiming(highlightColor, {
        duration: TRANS_DURATION
      });
      dotWidth.value = withTiming(12, {
        duration: TRANS_DURATION
      });
      dotHeight.value = withTiming(4, {
        duration: TRANS_DURATION
      });
      dotRadius.value = withTiming(20, {
        duration: TRANS_DURATION
      });
    } else {
      dotColor.value = withTiming(defaultColor, {
        duration: TRANS_DURATION
      });
      dotWidth.value = withTiming(4, {
        duration: TRANS_DURATION
      });
      dotHeight.value = withTiming(4, {
        duration: TRANS_DURATION
      });
      dotRadius.value = withTiming(2, {
        duration: TRANS_DURATION
      });
    }
  }, [isActive]);

  const $dotAnimate = useAnimatedStyle(() => ({
    backgroundColor: dotColor.value,
    width: dotWidth.value,
    height: dotHeight.value,
    borderRadius: dotRadius.value
  }));

  return <Animated.View style={[$dot, $dotAnimate]}></Animated.View>;
}

export default function DotMarquee({
  dotRender,
  length,
  activeIndex = 0,
  autoLoop = false,
  gapDuration = 2500,
  onPress,
  handleIndexChange,
  defaultColor,
  highlightColor
}: IDotMarquee) {
  const loopTimer = useRef<NodeJS.Timeout>();

  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (autoLoop && isFocused) {
      loopTimer.current = setInterval(() => {
        setCurrentIndex(c => (c + 1) % length);
      }, gapDuration);
    } else {
      clearInterval(loopTimer.current);
      loopTimer.current = undefined;
    }
  }, [isFocused, autoLoop]);

  useEffect(() => {
    setCurrentIndex(activeIndex);
  }, [activeIndex]);

  useEffect(() => {
    handleIndexChange?.(currentIndex);
  }, [currentIndex]);

  const pressIndex = (e: GestureResponderEvent, index: number) => {
    onPress?.(e, index);
    setCurrentIndex(index);
  };

  return (
    <View style={$dotView}>
      {Array.from({ length: length })
        .fill('')
        .map((dot, dotIndex) => {
          const isActive = dotIndex === currentIndex;
          return dotRender ? (
            dotRender(isActive, dotIndex)
          ) : (
            <TouchableOpacity
              key={dotIndex}
              activeOpacity={1}
              onPress={e => pressIndex(e, dotIndex)}
            >
              <Dot
                isActive={isActive}
                defaultColor={defaultColor}
                highlightColor={highlightColor}
              ></Dot>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const $dotView: ViewStyle = {
  flex: 1,
  height: 8,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: $Z_INDEXES.z100
};

const $dot: ViewStyle = {
  marginHorizontal: 3
};
