import { ReactNode } from 'react';
import { Pressable, TextStyle, ViewStyle } from 'react-native';
import { colorsUI } from '@/src/theme';
import { spacing } from '@/src/theme/spacing';
import { Text } from '@Components/text';

type ItemProps = {
  leftAccessory?: () => ReactNode;
  rightAccessory?: () => ReactNode;
  selected?: boolean;
  title?: string;
  disabled?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
  onPress?: () => void;
};

export const MenuItem = ({
  title,
  children,
  leftAccessory,
  rightAccessory,
  selected = false,
  onPress,
  disabled,
  style: $styleOverride
}: ItemProps) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        $itemContainerStyle,
        selected && $itemHighlightStyle,
        $styleOverride
      ]}
    >
      {leftAccessory && leftAccessory()}
      {title ? (
        <Text style={[$textStyles, selected && $textHighlightStyles]}>
          {title}
        </Text>
      ) : (
        children
      )}
      {rightAccessory && rightAccessory()}
    </Pressable>
  );
};

const $itemContainerStyle: ViewStyle = {
  backgroundColor: colorsUI.Card.white.default,
  marginBottom: spacing.sm,
  borderRadius: spacing.sm,
  borderWidth: 2, // 避免box 变化的抖动
  borderColor: colorsUI.Border.default.default1,
  flexDirection: 'row',
  alignItems: 'center',
  padding: spacing.md
};

const $itemHighlightStyle: ViewStyle = {
  backgroundColor: colorsUI.Background.blue.default,
  borderColor: colorsUI.Border.brand.default
};

const $textStyles: TextStyle = {
  paddingHorizontal: spacing.xs,
  color: colorsUI.Text.default.title,
  fontSize: 14,
  fontStyle: 'normal',
  fontWeight: '500',
  lineHeight: 24
};

const $textHighlightStyles: TextStyle = {
  color: colorsUI.Text.default.selected
};
