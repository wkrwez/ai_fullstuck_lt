import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px } from '@/src/utils';
import { reportClick, reportMakePhotoTrack } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { Image, ImageStyle } from '@Components/image';
import { BlueButton } from '@Components/makePhotoV2/button';
import { Thinking } from '@Components/makePhotoV2/thinking';
import { Text } from '@Components/text';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { hideLoading, showLoading } from '../../loading';
import { showToast } from '../../toast';
import { BlueLinear } from '../blueLinearBg';
import {
  ElementSuffix,
  MakePhotoEvents,
  PAGE_TOP,
  PANNEL_TOP
} from '../constant';
import { ConfigItemType, config, options } from '../constant';
import { OptionList } from '../optionList';
import { RollButton } from '../rollButton';
import { SelectItem } from '../selectItem';
import { Tag } from '../tag';
import { useShallow } from 'zustand/react/shallow';
import { easeEffect } from './animate';

const DEC_IMAGE = require('@Assets/makephoto/dec1.png');
const ROLL_BUTTON = require('@Assets/makephoto/thinking.png');

export const $pannelStyle = StyleSheet.createRectStyle({
  marginTop: PAGE_TOP,
  left: 18,
  right: 18,
  top: PANNEL_TOP,
  bottom: 15
});

const DEC1 = require('@Assets/makephoto/dec1.png');
const DEC3 = require('@Assets/makephoto/dec3.png');

export function PannelBg(props: {
  showLoading: (v: boolean) => void;
  loading: boolean;
}) {
  const { pageState } = useMakePhotoStoreV2(
    useShallow(state => ({ pageState: state.pageState }))
  );
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (pageState === PageState.roleselect) {
      opacity.value = withTiming(0, easeEffect);
      translateX.value = withTiming(0, easeEffect);
      translateY.value = withTiming(400, easeEffect);
      scale.value = withTiming(1, easeEffect);
      return;
    }
    if (pageState === PageState.diy) {
      opacity.value = withTiming(1, easeEffect);
      translateX.value = withTiming(0, easeEffect);
      translateY.value = withTiming(0, easeEffect);
      scale.value = withTiming(1, easeEffect);
      return;
    }

    if (pageState === PageState.promptselect) {
      translateY.value = withTiming(
        // 0.75(H/2) - H/2
        -0.125 * ($pannelStyle.height || 0),
        easeEffect
      );
      translateX.value = withTiming(
        -0.125 * ($pannelStyle.width || 0),
        easeEffect
      );
      scale.value = withTiming(0.75, easeEffect);
      return;
    }

    if (pageState === PageState.styleselect) {
      opacity.value = withTiming(0, easeEffect);
      translateX.value = withTiming(0, easeEffect);
      translateY.value = withTiming(0, easeEffect);
      scale.value = withTiming(1.28, easeEffect);
    }
  }, [pageState]);

  const $safeBottomStyle = useMemo(() => {
    return StyleSheet.withSafeBottom(
      $pannelStyle,
      Number($containerInsets.paddingBottom) || 0
    );
  }, [$containerInsets.paddingBottom]);

  const $pannelAnimateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
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

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          borderRadius: 14,
          overflow: 'hidden'
        },
        $safeBottomStyle,
        $pannelAnimateStyle
      ]}
      pointerEvents={pageState === PageState.roleselect ? 'none' : 'auto'}
    >
      <>
        <BlueLinear
          dir="topLeft"
          style={{ width: '100%', height: '100%' }}
        ></BlueLinear>

        {pageState !== PageState.promptselect ? (
          <View
            style={[
              StyleSheet.rowStyle,
              { position: 'absolute', top: 7, left: 7 }
            ]}
          >
            {/* {props.loading && <Thinking />} */}
            <View
              style={{
                position: 'absolute',
                top: 14,
                left: 126,
                width: 33,
                height: 30
              }}
            >
              <Image source={DEC1} style={{ width: '100%', height: '100%' }} />
            </View>
            <TouchableOpacity
              style={{ position: 'relative', width: 173, height: 65 }}
              onPress={onPress}
            >
              <Image
                source={ROLL_BUTTON}
                style={{ width: '100%', height: '100%' }}
              />
            </TouchableOpacity>
            {/* <RollButton text="小狸大乱炖" onPress={onPress} /> */}
          </View>
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: 0,
              width: 117,
              height: 40
            }}
          >
            <Image source={DEC3} style={{ width: '100%', height: '100%' }} />
          </View>
        )}
      </>
    </Animated.View>
  );

  function onPress() {
    Haptics.impactAsync();

    const state = useMakePhotoStoreV2.getState();
    const { promptGenerateType } = state;
    switch (promptGenerateType) {
      case 3: {
        state.setState({
          promptGenerateType: 1
        });
        break;
      }
      case 1: {
        state.setState({
          promptGenerateType: 2
        });
        break;
      }
      default:
    }
    state.setState({
      promptLoading: true
    });

    return useMakePhotoStoreV2
      .getState()
      .autoPrompts()
      .then(res => {
        useMakePhotoStoreV2.getState().setState({
          promptLoading: false
        });
        // props.showLoading(false);
        console.log(res);
      })
      .catch(() => {
        useMakePhotoStoreV2.getState().setState({
          promptLoading: false
        });
        // props.showLoading(false);
        showToast('请重炖~!');
      });
  }
}
