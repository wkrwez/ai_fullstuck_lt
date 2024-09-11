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
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { Icon } from '@Components/icons';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { BlueLinear } from '../blueLinearBg';
import { BottomInput } from '../bottomInput';
import { PAGE_TOP, PANNEL_TOP, PromptType, doubleOptions } from '../constant';
import { ANIMATE_TIME, ConfigItemType, config, options } from '../constant';
import { OptionList } from '../optionList';
import { RollButton } from '../rollButton';
import { SelectItem } from '../selectItem';
import { Tag } from '../tag';
import { useShallow } from 'zustand/react/shallow';
import { $pannelStyle, PannelBg } from './PannelBg';
import { Pot } from './Pot';
import { PromptsRec } from './PromptsRec';
import { Slots } from './Slots';
import { SubmitButton } from './SubmitButton';
import { easeEffect } from './animate';

const KEYWORD_IMAGE = require('@Assets/makephoto/keyboard.png');

const $optionStyle: ViewStyle = {
  position: 'absolute',
  right: 18,
  top: PAGE_TOP,
  width: dp2px(64),
  flex: 1,
  bottom: 0
};

const $doubleBg: ViewStyle = {
  position: 'absolute',
  top: 72,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#9CD4FF',
  backgroundColor: StyleSheet.hex('#9CD4FF', 0.2),
  width: '100%',
  height: 400
};

const $inputButton: ViewStyle = {
  position: 'absolute',
  right: 70,
  top: ($pannelStyle.top || 0) + ($pannelStyle.height || 0) * 0.72,
  ...StyleSheet.columnStyle,
  justifyContent: 'center',
  alignItems: 'center',

  width: dp2px(106 / 0.75),
  height: dp2px(52 / 0.75)
};

export function Options() {
  const { pageState, prompts, type, current, hasDouble, currentSlot } =
    useMakePhotoStoreV2(
      useShallow(state => ({
        pageState: state.pageState,
        type: state.currentSlot?.type,
        currentSlot: state.currentSlot,
        prompts: state.currentSlot?.type
          ? state.cachePrompts[state.currentSlot?.type]
          : [],
        hasDouble:
          state.role1 &&
          state.role2 &&
          state.currentSlot?.type === PromptType.action,
        current:
          state.currentSlot?.type &&
          (state.selectedRoleIndex === 0
            ? state.selectedElements[state.currentSlot?.type]
            : state.selectedElements2[state.currentSlot?.type])
      }))
    );
  const offsetY = useSharedValue(0);

  const $animateStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }]
  }));

  useEffect(() => {
    if (!type) return;
    useMakePhotoStoreV2
      .getState()
      .getPrompt(type)
      .catch(e => {
        logWarn('getPrompt error', e);
      });
  }, [type]);

  useEffect(() => {
    offsetY.value = 0;
  }, []);

  const index = useMemo(() => {
    console.log('debug---------', current, type);
    if (!current) return 0;
    if (!type) return 0;
    const list = options[type].options.concat(prompts || []);
    return options[type].options.findIndex(item => {
      if (item === current.id || item === current.text) {
        return true;
      }
      return false;
    });
  }, [type, current]);

  if (pageState !== PageState.promptselect) {
    return null;
  }
  const { height } = useScreenSize('window');

  return (
    <Animated.View
      style={[{ position: 'absolute' }, $optionStyle, { top: 0 }]}
      entering={FadeIn.duration(ANIMATE_TIME)}
      exiting={FadeOut.duration(ANIMATE_TIME)}
    >
      <>
        {/* {hasDouble && (
          <Animated.View style={[$doubleBg, $animateStyles]}></Animated.View>
        )} */}
        {type && (
          <OptionList
            config={hasDouble ? doubleOptions[type] : options[type]}
            index={index}
            // onScroll={onScroll}
          />
        )}
        {currentSlot && currentSlot.type && (
          <TouchableOpacity
            style={$inputButton}
            onPress={() => {
              const {
                currentSlot,
                changeBottomInputShow,
                setSelectedElements
              } = useMakePhotoStoreV2.getState();
              if (currentSlot) {
                changeBottomInputShow(true, currentSlot.type);
                setSelectedElements({
                  [currentSlot.type]: {
                    type: currentSlot.type,
                    id: 'custom',
                    position: { x: -100, y: -100 }
                  }
                });
              }
            }}
          >
            <Image
              source={KEYWORD_IMAGE}
              style={{ width: '100%', height: '100%' }}
            />
            {/* <Icon icon="makephoto_up" size={10}></Icon>
            <Icon icon="makephoto_editred" size={30}></Icon>
            <Text
              style={{
                fontWeight: '400',
                color: '#E9F6FF'
              }}
            >
              自由发挥
            </Text> */}
          </TouchableOpacity>
        )}
      </>
    </Animated.View>
  );

  function onScroll(y: number) {
    offsetY.value = 0 - y;
  }
}
