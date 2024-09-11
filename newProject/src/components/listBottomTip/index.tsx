import { Text, TextStyle } from 'react-native';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';

export function ListBottomTip({ theme = Theme.LIGHT }: { theme?: Theme }) {
  const themeConfig = getThemeColor(theme);
  return (
    <Text style={[$bottomTip, { color: themeConfig.fontColor3 }]}>
      小狸也是有底线的～
    </Text>
  );
}

const $bottomTip: TextStyle = {
  width: '100%',
  textAlign: 'center',
  alignItems: 'center'
};
