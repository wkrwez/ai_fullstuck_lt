import * as Haptics from 'expo-haptics';
import { JSXElementConstructor, ReactElement, useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  PressableProps,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { TouchableProps } from 'react-native-svg';
import { colors, colorsUI, typography } from '@/src/theme';
import {
  $basicText,
  $flexCenter,
  $flexHCenter,
  $flexRow
} from '@/src/theme/variable';
import { StyleSheet } from '@/src/utils';

export enum EButtonType {
  NORMAL = 'normal',
  LINEAR = 'linear'
}

type INormalButtonProps = {
  children: string | ReactElement;
};

type ILinearButtonProps = {
  children: string | ReactElement;
  linearColors?: string[];
  linearLocations?: number[];
  linearStart?: { x: number; y: number };
  linearEnd?: { x: number; y: number };
  themeColor?: string;
  style?: ViewStyle;
};

interface IButtonProps extends PressableProps {
  type?: EButtonType;
  creditContainer?: ReactElement;
  $customBtnStyle?: ViewStyle;
  $customBtnTextStyle?: TextStyle;
  pressOpacity?: number;
}

type IUnionLinearProps = ILinearButtonProps & IButtonProps;
type IUnionNormalProps = INormalButtonProps & IButtonProps;

const $AnimateDuration = {
  $Opacity: {
    duration: 150,
    easing: Easing.in(Easing.ease)
  }
};

export const NormalButton = ({
  children,
  $customBtnStyle = {},
  $customBtnTextStyle = {},
  pressOpacity = 0.7,
  ...props
}: IUnionNormalProps) => {
  const doPress = (e: GestureResponderEvent) => {
    Haptics.impactAsync();
    props?.onPress?.(e);
  };

  const activeOpacity = useSharedValue(1);

  const $Anime = {
    $buttonOpacity: useAnimatedStyle(() => ({
      opacity: activeOpacity.value
    }))
  };

  return (
    <Animated.View style={$Anime.$buttonOpacity}>
      <Pressable
        onPress={doPress}
        onPressIn={e => {
          activeOpacity.value = withTiming(
            pressOpacity,
            $AnimateDuration.$Opacity
          );
          props?.onPressIn?.(e);
        }}
        onPressOut={e => {
          activeOpacity.value = withTiming(1, $AnimateDuration.$Opacity);
          props?.onPressOut?.(e);
        }}
        {...props}
      >
        <View style={[$normalButton, $customBtnStyle]}>
          {typeof children === 'string' ? (
            <Text style={[$normalBtnText, $customBtnTextStyle]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const LinearButton = (props: IUnionLinearProps) => {
  const {
    children = '',
    linearColors = ['#FF6A3B', '#FF8F50'],
    linearStart = { x: 0, y: 0 },
    linearEnd = { x: 1, y: 0 },
    linearLocations = [0.147, 0.9273],
    themeColor = StyleSheet.currentColors.brand1,
    creditContainer = <></>
  } = props;

  const doPress = (e: GestureResponderEvent) => {
    Haptics.impactAsync();
    props?.onPress?.(e);
  };

  const activeOpacity = useSharedValue(1);

  const $Anime = {
    $buttonOpacity: useAnimatedStyle(() => ({
      opacity: activeOpacity.value
    }))
  };

  return (
    <Animated.View style={$Anime.$buttonOpacity}>
      <Pressable
        onPress={doPress}
        onPressIn={e => {
          activeOpacity.value = withTiming(0.7, $AnimateDuration.$Opacity);
          props?.onPressIn?.(e);
        }}
        onPressOut={e => {
          activeOpacity.value = withTiming(1, $AnimateDuration.$Opacity);
          props?.onPressOut?.(e);
        }}
      >
        <LinearGradient
          colors={linearColors}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={[
            $flexRow,
            $flexCenter,
            {
              borderRadius: 500,
              paddingHorizontal: 68,
              paddingVertical: 14
            },
            props.style
          ]}
        >
          {typeof children === 'string' ? (
            <Text style={$basicText}></Text>
          ) : (
            <View style={[$flexCenter, $flexRow]}>
              {children}
              {creditContainer}
            </View>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default function Button(props: IUnionLinearProps & INormalButtonProps) {
  const { type = EButtonType.NORMAL } = props;
  let rootView = <View></View>;
  switch (type) {
    case EButtonType.LINEAR: {
      rootView = (
        <LinearButton {...(props as ILinearButtonProps)}></LinearButton>
      );
      break;
    }
    default: {
      rootView = (
        <NormalButton {...(props as IUnionNormalProps)}></NormalButton>
      );
      break;
    }
  }
  return rootView;
}

const $normalButton: ViewStyle = {
  ...$flexHCenter,
  paddingHorizontal: 16,
  paddingVertical: 4,
  backgroundColor: '#FF6A3B',
  borderRadius: 100
};

const $normalBtnText: TextStyle = {
  color: '#FFF',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 12,
  fontWeight: '600',
  lineHeight: 18
};
