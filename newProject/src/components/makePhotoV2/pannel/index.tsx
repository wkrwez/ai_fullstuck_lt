import { useEffect, useMemo, useState } from 'react';
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
import { Icon, IconChecked } from '@Components/icons';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { showToast } from '../../toast';
import { BlueLinear } from '../blueLinearBg';
import { BottomInput } from '../bottomInput';
import {
  ConfigItemType,
  PAGE_TOP,
  PANNEL_TOP,
  PromptType,
  config,
  options
} from '../constant';
import { LoadingView } from '../loadingView';
import { OptionList } from '../optionList';
import { PreviewView } from '../previewView';
import { RollButton } from '../rollButton';
import { SelectItem } from '../selectItem';
import { StyleList } from '../styleList';
import { Tag } from '../tag';
import { useShallow } from 'zustand/react/shallow';
import { AnimationDunElementsView } from './AnimationDunElementsView';
import { AnimationElementsView } from './AnimationElementsView';
import { GuideView } from './GuideView';
import { LoadingMask } from './LoadingMask';
import { Options } from './Options';
import { $pannelStyle, PannelBg } from './PannelBg';
import { Pot } from './Pot';
import { PromptsRec } from './PromptsRec';
import { SelectedTags } from './SelectedTags';
import { Slots } from './Slots';
import { SubmitButton } from './SubmitButton';
import { easeEffect } from './animate';

export function Pannel() {
  const [loading, showLoading] = useState(false);
  const { pageState, changeBottomInputShow, promptLoading, inputVisible } =
    useMakePhotoStoreV2(
      useShallow(state => ({
        promptLoading: state.promptLoading,
        pageState: state.pageState,
        inputVisible: state.inputVisible,
        changeBottomInputShow: state.changeBottomInputShow
      }))
    );
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const $safeBottomStyle = useMemo(() => {
    return StyleSheet.withSafeBottom(
      $pannelStyle,
      Number($containerInsets.paddingBottom) || 0
    );
  }, [$containerInsets.paddingBottom]);

  // const [showBottomInput, setShowBottomInput] = useState(false);

  return (
    <>
      <PannelBg loading={loading} showLoading={showLoading} />
      <Slots />
      <PromptsRec />
      {promptLoading && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              borderRadius: 14,
              overflow: 'hidden',
              backgroundColor: StyleSheet.hex('#d1ecfe', 0.8)
            },
            $safeBottomStyle
          ]}
        ></Animated.View>
      )}
      <Pot />
      <SelectedTags />
      <GuideView />
      <SubmitButton />
      {pageState === PageState.promptselect && <Options />}

      {/* 置底输入 */}
      {inputVisible && (
        <BottomInput
          onSubmit={onAddPrompt}
          onClose={() => {
            changeBottomInputShow(false);
          }}
        />
      )}
      <StyleList />
      {/* todo 用完即扔，不保留单独图层组 */}
      <AnimationElementsView />
      {/* {pageState === PageState.styleselect && <AnimationDunElementsView />} */}

      {/* {loading && <LoadingMask />} */}
    </>
  );

  function onAddPrompt(text: string) {
    if (!text) {
      showToast('请输入补充文本');
      return;
    }
    useMakePhotoStoreV2.getState().addPrompt(PromptType.addition, {
      type: 'custom',
      text: text
    });
    changeBottomInputShow(false);
  }
}
