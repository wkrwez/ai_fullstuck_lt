import { View, ViewStyle } from 'react-native';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import {
  BasicSvgIconProps,
  DownloadIcon,
  GenShareImageIcon,
  LinkIcon
} from '@/assets/image/svg';
import { ShareType } from './typings';

const availableType: Record<string, React.FC<BasicSvgIconProps>> = {
  [ShareType.save]: DownloadIcon,
  [ShareType.copy]: LinkIcon,
  [ShareType.shareimage]: GenShareImageIcon
};

export function BasicChannelItem({
  theme,
  style: $customStyle,
  shareType,
  Comp,
  children
}: {
  shareType?: ShareType;
  style?: ViewStyle;
  theme?: Theme;
  Comp?: React.FC<BasicSvgIconProps>;
  children?: React.ReactNode;
}) {
  let IconComp = Comp;
  const themeConfig = getThemeColor(theme);

  if (!IconComp && shareType && availableType[shareType]) {
    IconComp = availableType[shareType];
  }

  return (
    <View
      style={[
        $iconWrapper,
        { backgroundColor: themeConfig.eleBg },
        $customStyle
      ]}
    >
      {IconComp ? (
        <IconComp
          style={$icon}
          width={30}
          height={30}
          color={themeConfig.fontColor}
        />
      ) : null}
      {children}
    </View>
  );
}

const $iconWrapper: ViewStyle = {
  width: 46,
  height: 46,
  borderRadius: 16,
  padding: 8
};

const $icon: ViewStyle = {};
