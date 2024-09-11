import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from '@/src/components';
import { colors, typography } from '@/src/theme';
import { StyleSheet, createStyle } from '@/src/utils';
import { createCircleStyle } from '../../../../src/theme/variable';
import { AVATAR_SIZE, parallelWorldColors } from '../../_constants';
import AiPressableInput from '../others/ai-pressable-input';
import UserDisplay from '../others/user-display';

interface WorldLineAiCardProps {
  onInput: () => void;
}

export default function ChoiceInputCard({ onInput }: WorldLineAiCardProps) {
  return (
    <AiPressableInput
      labelNode={<UserDisplay />}
      textNode={
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={inputStyles.$enterNewWorldPlaceHolder}>
            输入一条新的世界线...
          </Text>
          <Icon icon="icon_edit_glow" size={16} />
        </View>
      }
      onInputPress={onInput}
    />
  );
}

const inputStyles = StyleSheet.create({
  $enterNewWorldPlaceHolder: {
    color: parallelWorldColors.fontGlow,
    fontSize: 18,
    fontFamily: typography.fonts.world,
    fontWeight: '400'
  },
  $avatar: {
    ...createCircleStyle(AVATAR_SIZE),
    borderWidth: 1,
    borderColor: colors.white
  }
});
