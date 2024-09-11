import * as Haptics from 'expo-haptics';
import { forwardRef, useEffect, useMemo, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedRef
} from 'react-native-reanimated';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px } from '@/src/utils';
import { StyleSheet } from '@/src/utils/StyleSheet';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { PromptType, options } from '../constant';
import { ANIMATE_TIME, ELE_ANIMATE_TIME } from '../constant';
import { IconItem } from '../optionList/Item';
import { $pannelStyle } from '../pannel/PannelBg';
import { useShallow } from 'zustand/react/shallow';

type SelectItemProps = {
  type: PromptType;
  index: number;
};

const SIZE = 55;
const st = StyleSheet.create({
  $wrapStyle: {
    ...StyleSheet.columnStyle,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    paddingTop: 5
  },
  $itemStyle: {
    ...StyleSheet.columnStyle,
    alignItems: 'center',
    justifyContent: 'center',
    width: SIZE,
    height: SIZE,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#A0BED3',
    borderStyle: 'dashed'
  },
  $itemCheckedStyle: {
    borderWidth: 2,
    borderColor: '#459ADA'
    // shadowOffset: {
    //   width: 5,
    //   height: 5
    // },
    // shadowRadius: 20,
    // shadowColor: '#000000'
  }
});
const $itemStyle = {
  width: SIZE
};

const iconSize = dp2px(SIZE / 2.5);

export interface SelectItemHandle {
  // onMeasure: () => Promise<unknown>;
}

export const SelectItem = forwardRef<SelectItemHandle, SelectItemProps>(
  (props, ref) => {
    const config = options[props.type];
    const itemRef = useAnimatedRef<TouchableOpacity>();
    const { item, presetPrompts, currentSlot } = useMakePhotoStoreV2(
      useShallow(state => ({
        presetPrompts:
          state.selectedRoleIndex === 0
            ? state.presetPrompts
            : state.presetPrompts2,
        item:
          state.selectedRoleIndex === 0
            ? state.selectedElements[props.type]
            : state.selectedElements2[props.type],
        currentSlot: state.currentSlot
      }))
    );

    const checked = useMemo(() => {
      return currentSlot?.type === props.type;
    }, [currentSlot]);

    const xRef = useRef(0);
    const yRef = useRef(0);
    useEffect(() => {
      const timer = setTimeout(() => {
        if (!itemRef.current) return;
        itemRef.current.measure((x, y, width, height, pageX, pageY) => {
          xRef.current = pageX - 0.25 * ($pannelStyle.width || 0);
          yRef.current = pageY;
        });
      }, 0);
      return () => {
        clearTimeout(timer);
      };
    }, []);
    return (
      <TouchableOpacity
        style={[st.$itemStyle, checked && st.$itemCheckedStyle]}
        onPress={onPress}
        ref={itemRef}
      >
        {item ? (
          <Animated.View
            entering={FadeIn.duration(ELE_ANIMATE_TIME)}
            exiting={FadeOut.duration(ANIMATE_TIME)}
            style={st.$wrapStyle}
          >
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                width: 16,
                height: 16
              }}
              onPress={onRemove}
            >
              <Icon icon="makephoto_remove" size={16} />
            </TouchableOpacity>
            <IconItem
              type={item.id}
              text={presetPrompts[props.type]?.text}
              color={StyleSheet.currentColors.subset.blue.text3}
            />
          </Animated.View>
        ) : (
          <>
            <Icon icon="makephoto_add" size={30} style={{ marginBottom: -5 }} />
            <Text
              style={{
                fontSize: 11,
                fontWeight: '500',
                color: StyleSheet.currentColors.subset.blue.text3,
                textAlign: 'center'
              }}
            >
              {config.label}
            </Text>
            <View
              style={{
                position: 'absolute',
                top: -iconSize / 3,
                right: -iconSize / 3,
                width: iconSize,
                height: iconSize
              }}
            >
              <Image
                source={config.icon}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </>
        )}
      </TouchableOpacity>
    );

    function onPress() {
      const {
        changePageState,
        setCurrentSlot,
        selectedElements,
        selectedElements2,
        selectedRoleIndex,
        presetPrompts,
        presetPrompts2,
        changeBottomInputShow
      } = useMakePhotoStoreV2.getState();
      const element = selectedRoleIndex === 0 ? presetPrompts : presetPrompts2;
      changePageState(PageState.promptselect);
      if (element[config.key]?.type === 'custom') {
        changeBottomInputShow(true, config.key, element[config.key]?.text);
      }

      if (!itemRef.current) return;
      itemRef.current.measure((x, y, width, height, pageX, pageY) => {
        setCurrentSlot({
          type: config.key,
          x: xRef.current,
          y: yRef.current
        });
      });
      Haptics.impactAsync();
    }

    function onRemove() {
      useMakePhotoStoreV2.getState().removePrompt(config.key);
    }
  }
);
