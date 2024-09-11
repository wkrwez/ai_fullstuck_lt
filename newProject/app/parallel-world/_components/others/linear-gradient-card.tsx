import React from 'react';
import { ImageBackground, StyleProp, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createStyle } from '@/src/utils';
import { parallelWorldColors } from '../../_constants';

const SPOT_BG_IMG = require('@Assets/image/parallel-world/spot2.png');

export default function LinearGradientCard({
  children,
  style: $containerStyleOverwrite = {},
  innerStyle: $innerStyleOverwrite = {}
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <LinearGradient
      colors={['#141C25', '#1E4256']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.$container, $containerStyleOverwrite]}
    >
      <ImageBackground
        style={$innerStyleOverwrite}
        source={SPOT_BG_IMG}
        resizeMode="contain"
      >
        {children}
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = createStyle({
  $container: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: parallelWorldColors.fontGlow
  }
});
