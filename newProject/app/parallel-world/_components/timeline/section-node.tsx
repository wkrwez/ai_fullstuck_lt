import { TIMELINE_ACTIVE, TIMELINE_NEGATIVE } from '.';
import React, { useEffect } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { colors } from '@/src/theme';
import { createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import { formatTosUrl } from '@/src/utils/getTosUrl';

export interface SectionNodeProps<S> {
  index: number;
  activeIndex: number;
  isAvatarVisible: boolean;
  avatarUrl: string;
}

export default function SectionNode<S>({
  index,
  activeIndex,
  isAvatarVisible,
  avatarUrl
}: SectionNodeProps<S>) {
  // 使用 useAnimatedStyle 创建动画样式
  const animatedStyle = useAnimatedStyle(() => {
    const isActivated = index > activeIndex;
    const isActive = index === activeIndex;
    return {
      backgroundColor: withTiming(
        isActivated ? TIMELINE_NEGATIVE : TIMELINE_ACTIVE
      ),
      transform: [{ scale: withTiming(isActive ? 1.5 : 1) }],
      borderColor: withTiming(isActive ? colors.white : 'transparent'),
      borderWidth: 1
    };
  });

  const $avatarOpacity = useSharedValue(0);

  useEffect(() => {
    $avatarOpacity.value = isAvatarVisible ? 1 : 0;
  }, [isAvatarVisible]);

  const $avatarStyle_A = useAnimatedStyle(() => {
    return {
      opacity: withTiming($avatarOpacity.value)
    };
  });
  return (
    <Animated.View
      style={[animatedStyle, { ...createCircleStyle(7), position: 'relative' }]}
    >
      <Animated.Image
        source={{ uri: formatTosUrl(avatarUrl, { size: 'size10' }) }}
        style={[styles.$avatar, $avatarStyle_A]}
      />
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
