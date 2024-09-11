import React, { ReactNode } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Icon } from '@/src/components';
import { colors } from '@/src/theme';
import { $flexCenter, $flexHCenter, $flexRow } from '@/src/theme/variable';
import InfoCard from '../info-card';

export const CHANGE_IMG_BUTTON_HEIGHT = 40;

export default function ChangeImgButton({
  title,
  onImgRegenerate
}: {
  title: string;
  onImgRegenerate?: () => void;
}) {
  return (
    <Pressable
      onPress={onImgRegenerate}
      style={{
        ...$flexHCenter,
        justifyContent: 'center',
        gap: 4,
        height: CHANGE_IMG_BUTTON_HEIGHT,
        borderRadius: 20,
        width: 112,
        backgroundColor: 'rgba(20, 28, 37, 0.5)'
      }}
    >
      <Icon icon="icon_ai" size={16} />
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: colors.white
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
