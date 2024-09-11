import { ReactNode } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  CommonColor,
  SceneColor,
  getThemeColor
} from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { Text } from '@Components/text';

type Placement = 'top' | 'topRight';
export function Bubble({
  placement = 'topRight',
  theme,
  text,
  style,
  render,
  cornerStyle
}: {
  placement?: Placement;
  theme: Theme;
  text: string;
  style: StyleProp<ViewStyle>;
  cornerStyle?: StyleProp<ViewStyle>;
  render?: (themeConfig: SceneColor) => ReactNode;
}) {
  const themeConfig = getThemeColor(theme);
  return (
    <View
      style={[
        $bubbleContainer,
        { backgroundColor: themeConfig.bg, shadowColor: CommonColor.white1 },
        style
      ]}
    >
      {render ? (
        render(themeConfig)
      ) : (
        <Text
          style={[$bubbleText, { color: themeConfig.fontColor }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      )}

      <BubbleCorner style={cornerStyle} theme={theme} placement={placement} />
    </View>
  );
}

const TopRihgtBubbleCorner = ({ theme = Theme.LIGHT }: { theme: Theme }) => {
  return (
    <Svg width="10" height="9" viewBox="0 0 10 9" fill="none">
      <Path
        d="M7.57295 9H0L5.5 0L8.91459 6.82918C9.41327 7.82653 8.68802 9 7.57295 9Z"
        fill={getThemeColor(theme).bg}
      />
    </Svg>
  );
};

const TopBubbleCorner = ({ theme = Theme.LIGHT }: { theme: Theme }) => {
  return (
    <Svg width="15" height="5" viewBox="0 0 15 5" fill="none">
      <Path
        d="M0.5 0H15V0C13.1258 0 11.3755 0.936694 10.3359 2.49615L9.43681 3.84479C8.75329 4.87006 7.24671 4.87006 6.56319 3.84479L5.94145 2.91218C4.72854 1.09281 2.68661 0 0.5 0V0Z"
        fill={getThemeColor(theme).bg}
      />
    </Svg>
  );
};

const BubbleCorner = ({
  style,
  theme = Theme.LIGHT,
  placement
}: {
  theme: Theme;
  placement: Placement;
  style?: StyleProp<ViewStyle>;
}) => {
  switch (placement) {
    case 'topRight':
      return (
        <View style={[$topRightCornerContainer, style]}>
          <TopRihgtBubbleCorner theme={theme} />
        </View>
      );
    case 'top':
      return (
        <View style={[$topCornerContainer, style]}>
          <TopBubbleCorner theme={theme} />
        </View>
      );
  }
};
const $bubbleContainer: ViewStyle = {
  height: 28,
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  shadowOpacity: 0.8,
  shadowRadius: 5,
  shadowOffset: { width: 0, height: 2 },
  elevation: 10
};

const $topRightCornerContainer: ViewStyle = {
  position: 'absolute',
  bottom: 3,
  right: -2
};

const $topCornerContainer: ViewStyle = {
  position: 'absolute',
  bottom: -4,
  left: '50%'
};

const $bubbleText: TextStyle = {
  fontSize: 11,
  fontWeight: '600',
  lineHeight: 16,
  height: 16,
  maxWidth: 200
};
