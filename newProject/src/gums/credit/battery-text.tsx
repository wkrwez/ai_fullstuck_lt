import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Icon } from '@/src/components';
import { PLUS_COLOR } from '@/src/components/credit-cas';
import { typography } from '@/src/theme';
import {
  $flex,
  $flexCenter,
  $flexHCenter,
  $flexRow
} from '@/src/theme/variable';

export enum EIconLightTheme {
  GRAY = 'gray_lightning',
  GREEN = 'green_lightning'
}

interface IBatteryTextProps {
  $customTextStyle?: TextStyle;
  theme: EIconLightTheme;
  text: string;
}

export default function BatteryText({
  $customTextStyle = {},
  theme,
  text
}: IBatteryTextProps) {
  const textColors = {
    [EIconLightTheme.GRAY]: 'rgba(255, 255, 255, 0.40)',
    [EIconLightTheme.GREEN]: PLUS_COLOR
  };

  return (
    <View style={$grayLight}>
      <Icon size={12} icon={theme}></Icon>
      <Text
        style={[
          $basicText,
          {
            color: textColors[theme]
          },
          $customTextStyle
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const $grayLight: ViewStyle = {
  ...$flexHCenter,
  height: 20,
  marginHorizontal: 2
};

const $basicText: TextStyle = {
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 13,
  fontWeight: '400',
  lineHeight: 20
};
