import React from 'react';
import { Pressable, Text } from 'react-native';
import { Icon } from '@/src/components';
import { $flexHCenter } from '@/src/theme/variable';
import { parallelWorldColors } from '../../_constants';

export const CHOICE_LOADING_TIP = '绞尽脑汁中...';
export const CHOICE_FAIL_TIP = '小狸脑子裂开咯～请重试';

export default function LiHelp({
  onPress,
  disabled = false
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={{ ...$flexHCenter, gap: 4, opacity: disabled ? 0.6 : 1 }}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon icon="li_help" />
      <Text
        style={{
          color: parallelWorldColors.fontGlow,
          fontSize: 14,
          fontWeight: '500'
        }}
      >
        小狸帮想
      </Text>
    </Pressable>
  );
}
