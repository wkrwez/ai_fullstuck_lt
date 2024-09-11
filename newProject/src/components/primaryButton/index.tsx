import * as Haptics from 'expo-haptics';
import React, { ReactNode, useMemo } from 'react';
import {
  ImageStyle,
  Platform,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Button, ButtonProps } from '@Components/button';
import { PrimaryBg } from '@Components/primaryBg';
import { StyleList, StyleSheet } from '@Utils/StyleSheet';

export interface PrimaryButtonProps extends ButtonProps {
  style?: ViewStyle; // button style
  textStyle?: TextStyle;
  width?: number;
  height?: number;
  children?: string | ReactNode;
  disableStyle?: 'light' | 'dark';
  useDp2px?: boolean;
}

const renderContent = (props: PrimaryButtonProps, st: StyleList) => {
  if (!props.children) return null;
  if (!React.isValidElement(props.children)) {
    return (
      <Text
        style={[
          st.$text,
          props.disabled && st.$disabledText,
          props.disableStyle === 'light' && {
            opacity: 1,
            color: StyleSheet.currentColors.white
            // backgroundColor: 'red'
          },
          props.textStyle
        ]}
      >
        {props.children}
      </Text>
    );
  }

  return props.children;
};

export function PrimaryButton(props: PrimaryButtonProps) {
  const st = useMemo(() => {
    return getStyle(props, props.useDp2px);
  }, [props.width, props.useDp2px]);

  if (props.disabled) {
    const { disabled, style, ...others } = props;
    const $disabledStyle =
      props.disableStyle === 'light'
        ? st.$disabledLightOverride
        : st.$disabledViewStyleOverride;

    return (
      <Button
        style={[st.$primaryButton, $disabledStyle, props.style]}
        disabledStyle={$disabledStyle}
        {...others}
      >
        {renderContent(props, st)}
      </Button>
    );
  }

  return (
    <Button
      style={[st.$primaryButton, { backgroundColor: 'transparent' }]}
      {...props}
      onPress={e => {
        Haptics.impactAsync();
        if (props.onPress) {
          props.onPress(e);
        }
      }}
    >
      <PrimaryBg style={st.$primaryBg}>
        {renderContent(props, st)}
        {/* <Text style={st.$text}>{props.children}</Text> */}
      </PrimaryBg>
    </Button>
  );
}

const getStyle = (props: PrimaryButtonProps, useDp2px = true) => {
  const style: Record<string, ViewStyle | ImageStyle | TextStyle> = {
    $primaryButton: {
      width: props.width || 251,
      height: props.height || 50,
      borderRadius: 500
    },
    $disabledLightOverride: {
      opacity: 1,
      color: StyleSheet.hex(StyleSheet.currentColors.white, 1),
      backgroundColor: '#E0E0E0'
    },
    $disabledViewStyleOverride: {
      backgroundColor: '#7A899F',
      opacity: 1,
      color: StyleSheet.hex(StyleSheet.currentColors.white, 0.3)
    },
    $text: {
      fontSize: 16,
      fontWeight: '500',
      color: StyleSheet.currentColors.white,
      textAlign: 'center',
      width: props.width || 251
    },
    $disabledText: {
      color: StyleSheet.hex(StyleSheet.currentColors.white, 0.3),
      fontSize: 16
      // backgroundColor: '#E0E0E0'
    },
    $primaryBg: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      width: props.width || 251,
      height: props.height || 50,
      lineHeight: props.height
    }
  };

  return useDp2px ? StyleSheet.create(style) : style;
};
