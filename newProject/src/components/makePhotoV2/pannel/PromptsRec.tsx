import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import {
  GenFeaturePrompt,
  GenFeaturePrompts,
  GetMyPhotos,
  TakePhoto
} from '@/src/api/makephotov2';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { logWarn } from '@Utils/error-log';
import { hideLoading, showLoading } from '../../loading';
import { BlueLinear } from '../blueLinearBg';
import { PAGE_TOP, PANNEL_TOP, PromptType } from '../constant';
import { ConfigItemType, config, options } from '../constant';
import { ANIMATE_TIME } from '../constant';
import { OptionList } from '../optionList';
import { RollButton } from '../rollButton';
import { SelectItem } from '../selectItem';
import { Tag } from '../tag';
import { useShallow } from 'zustand/react/shallow';
import { PannelBg } from './PannelBg';
import { Pot } from './Pot';
import { Slots } from './Slots';
import { SubmitButton } from './SubmitButton';
import { easeEffect } from './animate';

const $promptsStyle = StyleSheet.createRectStyle(
  {
    marginTop: PAGE_TOP,
    // top: PANNEL_TOP + 240,
    left: 33,
    right: 20,
    bottom: 140
  },
  ['left', 'top', 'width']
);

const BTN_IMAGE = require('@Assets/makephoto/input_btn.png');

interface PromptsRecProps {
  // onInput: () => void;
}
function InputButton(props: PromptsRecProps) {
  const { pageState } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState
    }))
  );
  return (
    <TouchableOpacity
      disabled={pageState === PageState.promptselect}
      style={{ width: 94, height: 32 }}
      onPress={onPress}
    >
      <Image source={BTN_IMAGE} style={{ width: '100%', height: '100%' }} />
    </TouchableOpacity>
  );

  function onPress() {
    useMakePhotoStoreV2
      .getState()
      .changeBottomInputShow(true, PromptType.addition);
  }
}

const placeholder = '||||||'.split('');

export function PromptsRec(props: PromptsRecProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const { pageState, currentRole, promptLoading } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      currentRole: state.currentRole,
      promptLoading: state.promptLoading
    }))
  );
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!currentRole) return;
    getPrompt();
  }, [currentRole]);

  useEffect(() => {
    if (pageState === PageState.promptselect) {
      opacity.value = withTiming(0, easeEffect);
    }
    if (pageState === PageState.diy) {
      opacity.value = withTiming(1, easeEffect);
    }
  }, [pageState]);

  const $animateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  if (
    promptLoading ||
    pageState === PageState.roleselect ||
    pageState === PageState.styleselect
  ) {
    return null;
  }
  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATE_TIME).delay(ANIMATE_TIME)}
      style={[
        { position: 'absolute' },
        $promptsStyle,
        {
          top:
            ($promptsStyle.top || 0) -
            Number($containerInsets.paddingBottom || 0)
        },
        $animateStyle
      ]}
      pointerEvents={pageState === PageState.promptselect ? 'none' : 'auto'}
    >
      <View
        style={[
          StyleSheet.rowStyle,
          {
            marginBottom: 8,
            justifyContent: 'space-between',
            alignContent: 'flex-start'
          }
        ]}
      >
        <View style={{ position: 'relative', ...StyleSheet.rowStyle }}>
          <View
            style={{ width: 2, backgroundColor: '#83A9C4', height: 14 }}
          ></View>
          <Text
            style={{
              color: '#83A9C4',
              fontSize: 14,
              fontWeight: '400',
              paddingLeft: 6
            }}
          >
            细节补充
          </Text>
        </View>

        <TouchableOpacity
          style={[
            StyleSheet.rowStyle,
            {
              marginRight: 8,
              borderRadius: 500,
              backgroundColor: StyleSheet.hex('#83A9C4', 0.3),
              paddingVertical: 6,
              paddingHorizontal: 9
            }
          ]}
          onPress={getPrompt}
        >
          <Icon
            icon="makephoto_refresh"
            size={14}
            color={StyleSheet.currentColors.white}
          />
          <Text
            style={{
              marginLeft: 4,
              color: StyleSheet.currentColors.white,
              fontSize: 14,
              fontWeight: '500'
            }}
          >
            换一批
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[StyleSheet.rowStyle, { gap: 8, flexWrap: 'wrap' }]}>
        {loading ? (
          placeholder.map((_, index) => (
            <Tag key={index} text={''} loading={loading} />
          ))
        ) : (
          <>
            {prompts.slice(0, 5).map((item, index) => (
              <Tag text={item} key={index} />
            ))}
            <InputButton {...props} />
          </>
        )}
      </View>
    </Animated.View>
  );

  function getPrompt() {
    if (pageState === PageState.promptselect) return;
    if (loading) return;
    Haptics.selectionAsync();
    // showLoading();
    setLoading(true);
    useMakePhotoStoreV2
      .getState()
      .getPrompt(PromptType.addition)
      .then(res => {
        setPrompts(res);
        setLoading(false);
        Haptics.impactAsync();
        // hideLoading();
      })
      .catch(e => {
        console.log('获取细节失败---', e);
        showToast('获取细节失败');
        logWarn('获取细节失败', e);
        setLoading(false);
        // hideLoading();
      });
    reportClick('switch');
  }
}
