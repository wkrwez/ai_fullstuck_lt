import { useEffect } from 'react';
import {
  FlatList,
  Pressable,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SelectedItemType, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import {
  ConfigItemType,
  ELE_ANIMATE_TIME,
  OptionType,
  config,
  options
} from '../constant';
import { Portal } from '@gorhom/portal';
import { IconItem } from './Item';
import { size } from './constant';
import { OptionItemProps } from './constant';

interface AnimateItemProps extends SelectedItemType {
  //   id: string;
  //   type: string;
  //   position: {};
}

const wrapSize = dp2px(55);

export function AnimateItem(props: SelectedItemType) {
  const item = config[props.id];

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const $animateStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateX: translateX.value
      },
      {
        translateY: translateY.value
      }
    ]
  }));

  useEffect(() => {
    const { currentSlot } = useMakePhotoStoreV2.getState();
    if (!currentSlot) return;
    const { position } = props;

    const deltaX = currentSlot?.x - position.x;
    const deltaY = currentSlot?.y - position.y;

    translateX.value = withSpring(deltaX, { stiffness: 400, damping: 32 });
    translateY.value = withSpring(
      deltaY,
      { stiffness: 400, damping: 32 }
      //   () => {
      //     runOnJS(changeOpacity)();
      //   }
    );
    opacity.value = withTiming(0, { duration: ELE_ANIMATE_TIME });
  }, [props]);

  if (!item) return null;
  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.columnStyle,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: props.position.x,
          top: props.position.y - 120, // todo
          width: wrapSize,
          height: wrapSize
          //   backgroundColor: '#00ff00'
        },
        $animateStyle
      ]}
    >
      <IconItem
        type={props.id}
        color={StyleSheet.currentColors.subset.blue.text3}
      />
      {/* <Image
        source={item.icon}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />

      <Text
        style={{
          textAlign: 'center',
          fontSize: 11,
          fontWeight: '500',
          color: '#596F7F'
        }}
      >
        {item.text}
      </Text> */}
    </Animated.View>
  );
}
