import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@/src/components';
import { colors, typography } from '@/src/theme';
import { createCircleStyle } from '@/src/theme/variable';
import { StyleSheet, createStyle } from '@/src/utils';
import { AVATAR_SIZE, parallelWorldColors } from '../../_constants';

interface AiPressableInputProps {
  children: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
}

const AiTag = () => (
  <LinearGradient
    colors={['#4CF5C2', '#4BF5F5', '#3DB9FF']}
    start={{ x: 1.57537 / 8.98713, y: 2.0899 / 15.0605 }}
    end={{ x: 1, y: 1 }}
    locations={[0, 0.396549, 0.99]}
    style={aiTagStyles.$aiLabel}
  >
    <Text
      style={{
        color: colors.white,
        lineHeight: 16,
        fontSize: 12,
        fontFamily: typography.fonts.world,
        fontWeight: '400'
      }}
    >
      AI
    </Text>
  </LinearGradient>
);

export default function AiGenTextarea({
  children,
  containerStyle: $containerStyleOverwrite = {},
  outlineStyle: $outlineStyleOverwrite = {}
}: AiPressableInputProps) {
  return (
    <LinearGradient
      colors={['#141C25', '#1E4256']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[$containerStyleOverwrite]}
    >
      <View style={[aiTextStyles.$wireframe, $outlineStyleOverwrite]}>
        <AiTag />
        {children}
      </View>
    </LinearGradient>
  );
}

const aiTextStyles = createStyle({
  $wireframe: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: parallelWorldColors.fontGlow
  }
});

const aiTagStyles = createStyle({
  $aiLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    paddingHorizontal: 6,
    borderTopLeftRadius: 4,
    borderBottomRightRadius: 4
  }
});
