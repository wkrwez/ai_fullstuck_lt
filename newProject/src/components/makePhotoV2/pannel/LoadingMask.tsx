import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { StyleSheet } from '@Utils/StyleSheet';
import { Loading } from './Loading';
import { $pannelStyle } from './PannelBg';

const BG_COLOR = StyleSheet.hex('#E9F6FF', 0.5);
export function LoadingMask() {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const $safeBottomStyle = useMemo(() => {
    return StyleSheet.withSafeBottom(
      $pannelStyle,
      Number($containerInsets.paddingBottom) || 0
    );
  }, [$containerInsets.paddingBottom]);
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={[
        $safeBottomStyle,
        {
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          position: 'absolute',
          borderRadius: 14,
          backgroundColor: BG_COLOR
        }
      ]}
    >
      <Loading>小狸正在绞尽脑汁...</Loading>
    </Animated.View>
  );
}
