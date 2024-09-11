import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useBrandStore } from '@/src/store/brand';
import { SwitchName, useControlStore } from '@/src/store/control';
import { BrandInfo } from '@/src/types';
import { getMarqueeIPColor } from '@/src/utils/color';
import { Image } from '@Components/image';
import { BlueLinear } from '@Components/makePhotoV2/blueLinearBg';
import { Tabs } from '@Components/tabs';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { useShallow } from 'zustand/react/shallow';

const style = StyleSheet.currentColors;
const subset = style.subset.blue;
interface IPTabItemType {
  text: string;
  id: number;
  active: boolean;
  onPress: (ip: number) => void;
}

const $itemStyle: ViewStyle = {
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 6,
  paddingBottom: 6,
  borderRadius: 12
};

const $textStyle: TextStyle = {
  fontWeight: '600',
  fontSize: 14
};

const $iconStyle: ViewStyle = {
  borderRadius: 500,
  width: 22,
  height: 22,
  overflow: 'hidden'
};

interface IPTabItemInnerProps {
  text: string;
  bgColor: string;
  iconUrl: string;
  textColor: string;
  iconBgColor: string;
}

function IPTabItemInner(props: IPTabItemInnerProps) {
  return (
    <View
      style={[
        $itemStyle,
        {
          backgroundColor: props.bgColor,
          ...StyleSheet.rowStyle,
          gap: 4
        }
      ]}
    >
      <View
        style={[
          {
            backgroundColor: props.iconBgColor
          },
          $iconStyle
        ]}
      >
        <Image
          source={props.iconUrl}
          tosSize="size10"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      <Text style={[$textStyle, { color: props.textColor }]}>{props.text}</Text>
    </View>
  );
}

export function IPTabItem(props: IPTabItemType) {
  const [brandInfo, setBrandInfo] = useState<BrandInfo>();

  const { hideIPIcon } = useControlStore(
    useShallow(state => ({
      hideIPIcon: state.checkIsOpen(SwitchName.DISABLE_DRAWING_IP)
    }))
  );

  useEffect(() => {
    useBrandStore
      .getState()
      .getBrandInfo(props.id)
      .then(res => {
        setBrandInfo(res);
      });
  });

  const bgColor = useMemo(() => {
    return getMarqueeIPColor((brandInfo && brandInfo.bgColor) || '#19321C');
  }, [brandInfo]);
  return (
    <Pressable
      style={{ position: 'relative', display: 'flex', marginRight: 10 }}
      onPress={() => {
        Haptics.impactAsync();
        props.onPress(props.id);
      }}
    >
      <IPTabItemInner
        bgColor="rgba(255,255,255,0.1)"
        iconBgColor={bgColor}
        iconUrl={hideIPIcon ? '' : brandInfo?.iconUrl || ''}
        text={props.text}
        textColor={StyleSheet.currentColors.white}
      />

      {props.active && (
        <View
          style={{
            position: 'absolute',
            top: 0
          }}
        >
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <IPTabItemInner
              bgColor={bgColor}
              iconBgColor={StyleSheet.currentColors.white}
              iconUrl={hideIPIcon ? '' : brandInfo?.iconUrl || ''}
              text={props.text}
              textColor="#222222"
            />
          </Animated.View>
        </View>
      )}
    </Pressable>
  );
}
