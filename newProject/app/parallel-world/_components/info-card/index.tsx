import React, { ReactNode } from 'react';
import {
  ImageBackground,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { colors } from '@/src/theme';
import { createStyle } from '@/src/utils';

const SPOT_BG_IMG = require('@Assets/image/parallel-world/spot.png');

export default function InfoCard({
  children,
  cardStyle: $cardStyleOverwrite = {},
  isBgPicVisible = true
}: {
  children: ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  isBgPicVisible?: boolean;
}) {
  return isBgPicVisible ? (
    <ImageBackground
      source={SPOT_BG_IMG}
      style={[style.$card, $cardStyleOverwrite]}
    >
      <View style={style.$wireframe}>{children}</View>
    </ImageBackground>
  ) : (
    <View style={[style.$card, $cardStyleOverwrite]}>
      <View style={style.$wireframe}>{children}</View>
    </View>
  );
}

const style = createStyle({
  $card: {
    padding: 10,
    alignItems: 'stretch'
  },
  $wireframe: {
    borderWidth: 2,
    borderColor: colors.black,
    position: 'relative'
  }
});
