import { useEffect, useMemo } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useCreditStore } from '@/src/store/credit';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { GameType, InvokeType } from '@/src/types';
import { dp2px } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { Icon } from '@Components/icons';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { BlueLinear } from '../blueLinearBg';
import {
  ANIMATE_TIME,
  ConfigItemType,
  PAGE_TOP,
  PANNEL_TOP,
  PromptType,
  config,
  options
} from '../constant';
import { OptionList } from '../optionList';
import { RollButton } from '../rollButton';
import { SelectItem } from '../selectItem';
import { Tag } from '../tag';
import { useShallow } from 'zustand/react/shallow';
import { PannelBg } from './PannelBg';
import { $pannelStyle } from './PannelBg';
import { Pot } from './Pot';
import { SubmitButton } from './SubmitButton';
import { easeEffect } from './animate';

const $selectorStyle = StyleSheet.createRectStyle({
  marginTop: PAGE_TOP,
  top: PANNEL_TOP + 13,
  right: 26,
  width: 63
  // height: payload => (230 / 236) * (Number(payload.width) || 0)
});

export function Slots() {
  const { pageState } = useMakePhotoStoreV2(
    useShallow(state => ({ pageState: state.pageState }))
  );

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (pageState === PageState.diy) {
      translateX.value = withTiming(0, easeEffect);
      translateY.value = withTiming(0, easeEffect);
      scale.value = withTiming(1, easeEffect);
    }

    if (pageState === PageState.promptselect) {
      // translateY.value = withTiming(
      //   -0.125 * ($pannelStyle.height || 0),
      //   easeEffect
      // );
      translateX.value = withTiming(
        -0.25 * ($pannelStyle.width || 0),
        easeEffect
      );
      // scale.value = withTiming(0.7, easeEffect);
    }
  }, [pageState]);

  const $animateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value
      },
      {
        translateY: translateY.value
      },
      {
        scale: scale.value
      }
    ]
  }));

  if (
    pageState === PageState.roleselect ||
    pageState === PageState.styleselect
  ) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATE_TIME).delay(ANIMATE_TIME)}
      style={[
        { position: 'absolute', ...StyleSheet.columnStyle, gap: 15 },
        $selectorStyle,
        $animateStyle
      ]}
    >
      <SelectItem type={PromptType.expression} index={0} />
      <SelectItem type={PromptType.cloth} index={1} />
      <SelectItem type={PromptType.action} index={2} />
      <SelectItem type={PromptType.scene} index={3} />
    </Animated.View>
  );
}
