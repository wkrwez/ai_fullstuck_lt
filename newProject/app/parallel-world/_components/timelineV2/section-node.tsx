import { TIMELINE_ACTIVE, TIMELINE_NEGATIVE } from '.';
import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { colors } from '@/src/theme';
import { createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';

export interface SectionNodeProps<S> {
  index: number;
  activeIndex: number;
  // isAvatarVisible: boolean;
  avatarUrl: string;
  style: ViewStyle;
  totalLen: SharedValue<number>;
  hasAvatar: boolean;
  isExpanded: SharedValue<number>;
  color: string;
  // onPress: () => void;
}

export default function SectionNode<S>({
  index,
  activeIndex,
  hasAvatar,
  isExpanded,
  // isAvatarVisible,
  avatarUrl,
  style,
  totalLen,
  color
}: SectionNodeProps<S>) {
  // 使用 useAnimatedStyle 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    const isActivated = Number(style.left) > totalLen.value - 21;
    const isActive = Math.abs(Number(style.left) - totalLen.value) < 4;

    return {
      backgroundColor: withTiming(
        isActivated ? TIMELINE_NEGATIVE : hasAvatar ? color : TIMELINE_ACTIVE
      ),
      transform: [{ scale: withTiming(isActive ? 1.5 : 1) }],
      borderColor: withTiming(isActive ? colors.white : 'transparent'),
      borderWidth: 1
    };
  });

  const $avatarStyle_A = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isExpanded.value)
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        { ...createCircleStyle(7), position: 'absolute', top: -2.5 },
        style
      ]}
    >
      {hasAvatar && (
        <Animated.Image
          source={{ uri: avatarUrl }}
          style={[styles.$avatar, { borderColor: color }, $avatarStyle_A]}
        />
      )}
    </Animated.View>
  );
}

const styles = createStyle({
  $avatar: {
    ...createCircleStyle(17),
    borderWidth: 1,
    borderColor: colors.white,
    position: 'absolute',
    top: -6,
    left: -6
  }
});
