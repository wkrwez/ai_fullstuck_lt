import React, { ComponentType } from 'react';
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Icon, IconTypes } from '@/src/components/icons';
import { LOTTIE_TEXT_LOADING, SEC_HEIGHT } from '@/src/constants';
import { colors, colorsUI, spacing, typography } from '../../theme';
import { Text, TextProps } from '../text';

export type Presets = keyof typeof $viewPresets;
export enum IconPosition {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface ButtonAccessoryProps {
  style: StyleProp<ViewStyle>;
  pressableState: PressableStateCallbackType;
}

export interface ButtonProps extends PressableProps {
  /**
   * 预置样式
   */
  preset?: Presets;

  /**
   *
   */

  //   size?: ''  // size preset 目前还不需要
  // loading状态
  loading?: boolean;

  text?: TextProps['text'];
  children?: React.ReactNode;
  iconText?: IconTypes;
  iconSize?: number;

  // 按钮容器样式
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  disabledStyle?: StyleProp<ViewStyle>;

  // 文本样式
  textStyle?: StyleProp<TextStyle>;
  pressedTextStyle?: StyleProp<TextStyle>;
  disabledTextStyle?: StyleProp<TextStyle>;

  // icon样式
  // iconStyle?:StyleProp<ViewStyle>
  iconPosition?: IconPosition;

  /**
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
}

export function Button(props: ButtonProps) {
  const {
    text,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    disabledStyle: $disabledViewStyleOverride,
    textStyle: $textStyleOverride,
    // pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    iconText,
    iconSize,
    iconPosition = IconPosition.LEFT,
    RightAccessory,
    LeftAccessory,
    disabled,
    loading = false,
    ...rest
  } = props;

  const preset: Presets = (props.preset || 'default') as Presets;

  function $viewStyle({ pressed }: { pressed: boolean }) {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      disabled || loading // 禁用和loading态
        ? [$disabledViewStyle, $disabledViewStyleOverride]
        : {},
      !!pressed && [{ opacity: 0.75 }, $pressedViewStyleOverride] //按下态
    ];
  }
  function $textStyle({ pressed }: { pressed: boolean }) {
    return [
      $textPresets[preset] || $baseTextStyle,
      disabled || loading ? $disabledTextStyleOverride : {},
      pressed ? $textStyleOverride : $textStyleOverride //pressed 占位脏代码
    ];
  }

  const renderInner = (state: PressableStateCallbackType) => {
    const content = text || children;
    return (
      <>
        {typeof content === 'string' ? (
          <View
            style={{
              display: 'flex',
              flexDirection:
                iconPosition === IconPosition.LEFT ? 'row' : 'row-reverse',
              alignItems: 'center'
            }}
          >
            {iconText ? (
              <Icon
                icon={iconText}
                size={iconSize || 16}
                style={
                  iconPosition === IconPosition.LEFT
                    ? { marginRight: 6 }
                    : { marginLeft: 6 }
                }
              ></Icon>
            ) : (
              ''
            )}
            <Text style={$textStyle(state)}>{children}</Text>
          </View>
        ) : (
          children
        )}
      </>
    );
  };

  return (
    <Pressable
      style={$viewStyle}
      disabled={disabled || loading}
      accessibilityRole="button"
      {...rest}
    >
      {state => renderInner(state)}
    </Pressable>
  );
}

const $baseViewStyle: ViewStyle = {
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: spacing.sm,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  overflow: 'hidden',
  height: 50
};

const $sizeViewStyle: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  // overflow: 'hidden',
  backgroundColor: colors.themeGround,
  marginBottom: 10
};

const $baseTextStyle: TextStyle = {
  // fontSize: 15,
  // lineHeight: 26,
  fontFamily: typography.primary.medium,
  fontWeight: '500',
  textAlign: 'center',
  color: '#fff'
};

const $rightAccessoryStyle: ViewStyle = { marginLeft: spacing.xs };
const $leftAccessoryStyle: ViewStyle = { marginRight: spacing.xs };

// 暂时不处理
const $sizePresets = {};

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: colors.backgroundGray
    }
  ],

  text: [
    $baseViewStyle,
    {
      borderColor: 'transparent',
      backgroundColor: 'transparent'
    }
  ],

  primary: [$baseViewStyle, { backgroundColor: colors.palette.primary }],

  outline: [
    $baseViewStyle,
    {
      borderWidth: 1.5,
      borderColor: colors.link
    }
  ],

  dangerOutline: [
    $baseViewStyle,
    {
      backgroundColor: colorsUI.Background.red.default
    }
  ],

  danger: [$baseViewStyle, { backgroundColor: colors.danger }],

  danger_ghost: [
    $baseViewStyle,
    { backgroundColor: colorsUI.Background.red.default }
  ],

  small: [
    $sizeViewStyle,
    {
      borderRadius: 13,
      height: 26,
      lineHeight: 20,
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.md,
      fontSize: 12
    }
  ],
  smallGray: [
    $sizeViewStyle,
    {
      borderRadius: 13,
      height: 26,
      lineHeight: 20,
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.md,
      fontSize: 12,
      backgroundColor: colors.backgroundGray
    }
  ],
  middle: [
    $sizeViewStyle,
    {
      borderRadius: 18,
      height: 36,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.lg,
      fontSize: 16,
      lineHeight: 20
    }
  ],
  large: [
    $sizeViewStyle,
    {
      borderRadius: 22,
      height: 44,
      paddingVertical: spacing.sm,
      width: 280,
      fontSize: 14,
      lineHeight: 44
    }
  ],

  coustom: [
    $baseViewStyle,
    { borderRadius: 22, backgroundColor: colors.warning }
  ],

  warning: [$baseViewStyle, { backgroundColor: colors.warning }],

  success: [$baseViewStyle, { backgroundColor: colors.success }]
};

const $textPresets: Partial<Record<Presets, StyleProp<TextStyle>>> = {
  default: { ...$baseTextStyle, color: colors.text },
  text: { ...$baseTextStyle, color: colors.text },
  outline: { ...$baseTextStyle, color: colors.primary },
  danger_ghost: { ...$baseTextStyle, color: colorsUI.Text.danger.default }
};

const $disabledViewStyle: ViewStyle = {
  opacity: 0.3
};
