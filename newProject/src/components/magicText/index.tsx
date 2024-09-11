import { ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { IconMagicWard } from '@Components/icons';
import { Text } from '@Components/text';

interface MagicTextProps {
  children?: string;
}

const st = StyleSheet.create({
  $wrap: {
    ...StyleSheet.rowStyle,
    alignItems: 'center'
  },
  $text: {
    marginLeft: 3,
    color: StyleSheet.currentColors.blue,
    fontSize: 13,
    fontWeight: '500'
  }
});
export function MagicText(props: MagicTextProps) {
  return (
    <View style={st.$wrap}>
      <IconMagicWard />
      <Text style={st.$text}>{props.children}</Text>
    </View>
  );
}
