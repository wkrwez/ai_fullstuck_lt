import React, { useMemo } from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle
} from 'react-native';
import { StyleSheet } from '@/src/utils';
import { BUTTON_HEIGHT, parallelWorldColors } from '../../_constants';

interface ButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
  disabled?: boolean;
}

export default function ParallelWorldButton({
  children = null,
  style: $styleOverwrite = {},
  title = '',
  disabled = false,
  ...pressableProps
}: ButtonProps) {
  // 外层样式
  const btnStyles = useMemo(() => {
    return disabled
      ? [buttonStyles.$button, $styleOverwrite, buttonStyles.$buttonDisable]
      : [buttonStyles.$button, $styleOverwrite];
  }, [disabled]);

  return (
    <TouchableOpacity style={btnStyles} disabled={disabled} {...pressableProps}>
      {children || <Text style={buttonStyles.$text}>{title}</Text>}
    </TouchableOpacity>
  );
}

const buttonStyles = StyleSheet.create({
  $button: {
    ...StyleSheet.rowStyle,
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 22,
    height: BUTTON_HEIGHT,
    backgroundColor: parallelWorldColors.bgMask,
    borderRadius: 12
  },
  $buttonDisable: {
    opacity: 0.6
  },
  $text: {
    lineHeight: BUTTON_HEIGHT,
    marginLeft: 4,
    fontWeight: '500',
    fontSize: 16,
    color: StyleSheet.currentColors.white
  }
});
