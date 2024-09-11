import React, { ReactNode, useMemo } from 'react';
import { Platform, Text, TextStyle, View, ViewStyle } from 'react-native';

import { Button, ButtonProps } from '@Components/button';

import { StyleList, StyleSheet } from '@Utils/StyleSheet';

import { BlueLinear } from '../blueLinearBg';

export interface BlueButtonProps extends ButtonProps {
  style?: ViewStyle; // button style
  textStyle?: TextStyle;
  width?: number;
  height?: number;
  children?: string | ReactNode;
  disableStyle?: 'light' | 'dark';
}

const style = StyleSheet.currentColors;
const subset = style.subset.blue;
const renderContent = (props: BlueButtonProps, st: StyleList) => {
  if (!props.children) return null;
  if (!React.isValidElement(props.children)) {
    return (
      <Text
        style={[
          st.$text,
          props.disabled && st.$disabledText,
          props.disableStyle === 'light' && {
            opacity: 1,
            color: subset.text2
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

export function BlueButton(props: BlueButtonProps) {
  const st = useMemo(() => {
    return getStyle(props);
  }, [props.width]);

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
    >
      <BlueLinear style={st.$primaryBg}>
        {renderContent(props, st)}
        {/* <Text style={st.$text}>{props.children}</Text> */}
      </BlueLinear>
    </Button>
  );
}

const getStyle = (props: BlueButtonProps) =>
  StyleSheet.create({
    $primaryButton: {
      width: props.width || 251,
      height: props.height || 50,
      borderRadius: 500
    },
    $disabledLightOverride: {
      backgroundColor: '#E0E0E0',
      opacity: 1,
      color: StyleSheet.hex(subset.text2, 1)
    },
    $disabledViewStyleOverride: {
      backgroundColor: '#7A899F',
      opacity: 1,
      color: StyleSheet.hex(subset.text2, 0.3)
    },
    $text: {
      fontSize: 16,
      color: subset.text2,
      fontWeight: '600',
      textAlign: 'center',
      width: props.width || 251,
      height:
        Platform.OS === 'android' ? (props.height || 50) - 2 : props.height,
      lineHeight:
        Platform.OS === 'android' ? (props.height || 50) - 2 : props.height
    },
    $disabledText: {
      color: StyleSheet.hex(subset.text2, 0.3),
      fontSize: 16
    },
    $primaryBg: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      width: props.width || 251,
      height: props.height || 50,
      lineHeight: props.height,
      top: 0,
      left: 0
    }
  });
