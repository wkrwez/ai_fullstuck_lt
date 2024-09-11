import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle
} from 'react-native';
import { StyleSheet, dp2px } from '@/src/utils';
import { colors, typography } from '../../theme';

type Sizes = keyof typeof $sizeStyles;
type Weights = keyof typeof typography.primary;
type Presets = keyof typeof $presets;

export interface TextProps extends RNTextProps {
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;

  color?: string;
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;
  /**
   * One of the different types of text presets.
   */
  preset?: Presets | 'default';
  /**
   * Text weight modifier.
   */
  weight?: Weights;
  /**
   * Text size modifier.
   */
  size?: Sizes;
  /**
   * Children components.
   */
  children?: React.ReactNode;
}

export function Text(props: TextProps) {
  const {
    weight,
    size,
    text,
    children,
    color,
    style: $styleOverride,
    ...rest
  } = props;

  const content = text || children;

  const preset: Presets =
    props.preset && $presets[props.preset] ? props.preset : 'default';

  const $styles = [
    $rtlStyle,
    $presets[preset],
    $fontWeightStyles[weight as Weights],
    $sizeStyles[size as Sizes],
    color ? { color: color } : null,
    $styleOverride
  ];

  return (
    <RNText allowFontScaling={false} {...rest} style={$styles}>
      {content}
    </RNText>
  );
}

const $sizeStyles = {
  xxl: { fontSize: 32, lineHeight: 40 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 32 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 30 } satisfies TextStyle,
  md: { fontSize: 16, lineHeight: 28 } satisfies TextStyle,
  sm: { fontSize: 14, lineHeight: 22 } satisfies TextStyle,
  xs: { fontSize: 13, lineHeight: 22 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 20 } satisfies TextStyle
};

const $fontWeightStyles = Object.entries(typography.primary).reduce(
  (acc, [weight, fontFamily]) => {
    return { ...acc, [weight]: { fontFamily } };
  },
  {}
) as Record<Weights, TextStyle>;

const $baseStyle: StyleProp<TextStyle> = [
  $sizeStyles.sm,
  //   $fontWeightStyles.normal,
  { color: colors.text }
];

const $presets = {
  default: $baseStyle,
  link: [$baseStyle, { color: colors.link }] as StyleProp<TextStyle>,
  gray: [$baseStyle, { color: colors.textGray }] as StyleProp<TextStyle>,
  bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,
  title: [
    $baseStyle,
    {
      color: StyleSheet.currentColors.titleGray,
      fontWeight: '600',
      fontSize: dp2px(16), //todo
      lineHeight: dp2px(22)
    }
  ] as StyleProp<TextStyle>,
  heading: [
    $baseStyle,
    $sizeStyles.xxl,
    $fontWeightStyles.bold
  ] as StyleProp<TextStyle>,

  subheading: [
    $baseStyle,
    $sizeStyles.lg,
    $fontWeightStyles.medium
  ] as StyleProp<TextStyle>,
  // 上面是stepchat的 要改要删，下面为业务新加
  text: [
    $baseStyle,
    { color: StyleSheet.currentColors.white, fontSize: 14, lineHeight: 20 }
  ]
};

const $rtlStyle: TextStyle = {};
