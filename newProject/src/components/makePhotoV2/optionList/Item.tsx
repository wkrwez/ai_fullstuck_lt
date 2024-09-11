import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { useStorageStore } from '@/src/store/storage';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { PromptType, config } from '../constant';
import { useShallow } from 'zustand/react/shallow';
import { IconItemProps, OptionItemProps, size } from './constant';

const st = StyleSheet.create({
  $optionStyle: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 10
  },
  $optionBorderStyle: {
    borderWidth: 1,
    borderColor: '#6DA1C6',
    borderRadius: 10
  },
  $optionChecked: {
    ...StyleSheet.rowStyle,
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 17,
    height: 17,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#6DA1C6'
  }
});

const $iconItemStyle: ViewStyle = {
  ...StyleSheet.columnStyle,
  paddingTop: 5,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
};

const $textNoraml: TextStyle = {
  color: '#459ADA',
  fontWeight: '500',
  textAlign: 'center'
};

export function IconItem(props: IconItemProps) {
  const { icon, text } = config[props.type] || {};
  if (!icon) return;
  if (props.type === 'custom') {
    const $textAdapterStyle = useMemo(() => {
      const len = (props.text || '').length;
      if (len <= 4) {
        return [$textNormalSize, { paddingHorizontal: 8 }];
      }
      if (len <= 6) {
        return $textSmallSize;
      }
      return $textMiniSize;
    }, [props.text?.length]);
    return (
      <Text style={[$textNoraml, $textAdapterStyle]}>{props.text || text}</Text>
    );
  }
  return (
    // <View style={$iconItemStyle}>
    <>
      <Image
        source={icon}
        style={{
          width: props.size || size,
          height: props.size || size,
          resizeMode: 'contain'
        }}
      />

      <Text
        style={{
          flexWrap: 'nowrap',
          fontSize: 11,
          fontWeight: '500',
          color: props.color || '#E9F6FF'
        }}
      >
        {text}
      </Text>
    </>
    // </View>
  );
}

interface TextItemProps {
  text: string;
}

const $textItemWrap: ViewStyle = {
  backgroundColor: '#36393B',
  width: 54,
  height: 54,
  borderRadius: 14,
  ...StyleSheet.centerStyle
};
const $textNormal: TextStyle = {
  fontWeight: '500',
  color: '#CAE8FF',
  textAlign: 'center'
};
const $textNormalSize: TextStyle = {
  paddingHorizontal: 6,
  fontSize: 14,
  lineHeight: 15
};
const $textSmallSize: TextStyle = {
  paddingHorizontal: 3,
  fontSize: 12,
  lineHeight: 12
};
const $textMiniSize: TextStyle = {
  padding: 3,
  fontSize: 10,
  lineHeight: 10
};
export function TextItem(props: TextItemProps) {
  const $textAdapterStyle = useMemo(() => {
    const len = props.text.length;
    if (len <= 4) {
      return $textNormalSize;
    }
    if (len <= 6) {
      return $textSmallSize;
    }
    return $textMiniSize;
  }, [props.text.length]);
  return (
    <View style={$textItemWrap}>
      <Text style={[$textNormal, $textAdapterStyle]} ellipsizeMode="middle">
        {props.text}
      </Text>
    </View>
  );
}

const blue = StyleSheet.currentColors.subset.blue;
const LIGHT1_BLUE = StyleSheet.hex(blue.blue, 0.2);
const LIGHT2_BLUE = StyleSheet.hex(blue.blue, 0.12);
export function OptionItem(props: OptionItemProps) {
  const iconRef = useAnimatedRef<Animated.View>();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const { visMakephotoDouble } = useStorageStore(
    useShallow(state => ({
      visMakephotoDouble: state.visMakephotoDouble
    }))
  );

  const $animateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value
      },
      {
        translateY: translateY.value
      }
    ]
  }));

  const $decStyle = useMemo(() => {
    if (!config[props.id]?.double) return null;
    const baseStyle = {
      position: 'absolute',
      width: '100%',
      height: '100%'
    };
    let normarlStyle = {};
    let currentStyle = {};
    let borderStyle = {};

    if (config[props.id]?.doubleFirst) {
      currentStyle = {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12
      };
    }

    if (config[props.id]?.doubleLast) {
      currentStyle = {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
      };
    }

    if (visMakephotoDouble) {
      normarlStyle = { backgroundColor: LIGHT2_BLUE };
    } else {
      normarlStyle = { backgroundColor: LIGHT1_BLUE };
      borderStyle = {
        borderWidth: 1,
        borderColor: blue.blue
      };
      if (config[props.id]?.doubleFirst) {
        borderStyle = { ...borderStyle, borderBottomWidth: 0 };
      } else if (config[props.id]?.doubleLast) {
        borderStyle = { ...borderStyle, borderTopWidth: 0 };
      } else {
        borderStyle = {
          ...borderStyle,
          borderBottomWidth: 0,
          borderTopWidth: 0
        };
      }
    }

    return [baseStyle, normarlStyle, currentStyle, borderStyle];
  }, [props.id, visMakephotoDouble]);

  return (
    <>
      <Animated.View
        ref={iconRef}
        style={[st.$optionStyle, $animateStyle, props.style]}
      >
        {config[props.id]?.double && <View style={$decStyle}></View>}
        {props.checked && (
          <View
            style={[StyleSheet.absoluteFill, st.$optionBorderStyle]}
            pointerEvents="none"
          >
            <View style={st.$optionChecked}>
              <Icon icon="makephoto_checked" size={7} />
            </View>
          </View>
        )}

        <TouchableOpacity style={$iconItemStyle} onPress={onPress}>
          {props.id ? (
            <IconItem type={props.id} text={props.text} />
          ) : (
            <TextItem text={props.text} />
          )}
        </TouchableOpacity>
        <ChoicedText text={props.text} />
      </Animated.View>
    </>
  );

  function onPress() {
    if (!iconRef.current) return;
    Haptics.impactAsync();
    iconRef.current.measure((x, y, width, height, pageX, pageY) => {
      const {
        currentSlot,
        changeBottomInputShow,
        setSelectedElements,
        addPrompt
      } = useMakePhotoStoreV2.getState();
      if (!currentSlot) return;

      if (!props.id) {
        setSelectedElements({
          [currentSlot.type]: {
            type: currentSlot.type,
            id: 'custom',
            position: { x: pageX, y: pageY }
          }
        });

        addPrompt(currentSlot.type, { type: 'custom', text: props.text });
        return;
      }

      setSelectedElements({
        [currentSlot.type]: {
          type: currentSlot.type,
          id: props.id,
          position: { x: pageX, y: pageY }
        }
      });

      if (props.id === 'custom') {
        changeBottomInputShow(true, currentSlot.type);
      } else {
        addPrompt(currentSlot.type, { type: 'preset', text: props.text });
      }

      // const deltaX = currentSlot?.x - pageX;
      // const deltaY = currentSlot?.y - pageY;
      // translateX.value = withSpring(deltaX, { stiffness: 400, damping: 32 });
      // translateY.value = withSpring(deltaY, { stiffness: 400, damping: 32 });
      console.log('onPress------', currentSlot, pageX, pageY);
    });
  }
}

function ChoicedTextPure(props: { text: string }) {
  return (
    <View style={[StyleSheet.rowStyle, { justifyContent: 'center', gap: 2 }]}>
      <View
        style={{
          width: 6,
          height: 6,
          backgroundColor: '#FF6A3B',
          borderRadius: 500
        }}
      ></View>
      <Text style={{ fontSize: 9, fontWeight: '500', color: '#7FD9FF' }}>
        {props.text}已选
      </Text>
    </View>
  );
}

function ChoicedText(props: { text: string }) {
  const { role2, role1, index, current, presetPrompts2, presetPrompts } =
    useMakePhotoStoreV2(
      useShallow(state => ({
        role1: state.role1,
        role2: state.role2,
        index: state.selectedRoleIndex,
        presetPrompts: state.presetPrompts,
        presetPrompts2: state.presetPrompts2,
        current: state.currentSlot
      }))
    );
  if (current?.type !== PromptType.scene || !role2) {
    return null;
  }

  if (index === 0 && props.text === presetPrompts2.scene?.text) {
    return <ChoicedTextPure text={role2?.name} />;
  }

  if (index === 1 && props.text === presetPrompts.scene?.text) {
    return <ChoicedTextPure text={role1?.name || ''} />;
  }

  return null;
}
