import React, { useMemo } from 'react';
import { StyleProp, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { createStyle } from '@/src/utils';
import { StrokeText } from '@charmy.tech/react-native-stroke-text';

interface BorderTextProps extends TextProps {
  text: string;
  borderWidth?: number;
  fontStyle?: StyleProp<TextStyle>;
  fontSize: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const getBorderMoveList = (borderWidth: number) => [
  { top: -borderWidth },
  { top: borderWidth },
  { left: borderWidth },
  { right: borderWidth },
  { left: -borderWidth, top: -borderWidth },
  { left: borderWidth, top: -borderWidth },
  { left: -borderWidth, top: borderWidth },
  { left: borderWidth, top: borderWidth }
];

export function BorderText({
  text,
  borderWidth = 1,
  fontStyle: $fontStyle = {},
  fontSize = 40,
  containerStyle: $containerStyle = {},
  ...textProps
}: BorderTextProps) {
  const borderMoveList = useMemo(
    () => getBorderMoveList(borderWidth),
    [borderWidth]
  );

  return (
    <View style={[styles.textWrapper, $containerStyle]}>
      <StrokeText
        text={text}
        strokeWidth={4}
        fontSize={fontSize}
        color="#ffffff"
        width={fontSize}
        strokeColor="#000000"
      ></StrokeText>
    </View>
  );
}

const styles = createStyle({
  textWrapper: {
    position: 'relative'
  },
  baseText: {
    fontSize: 40,
    color: '#ffffff' // 文字颜色
  },
  textBorder: {
    position: 'absolute',
    color: '#000000' // 边框颜色
  }
});
