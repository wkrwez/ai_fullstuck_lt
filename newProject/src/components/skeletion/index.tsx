import { DimensionValue, View, ViewStyle } from 'react-native';
import { CommonColor, getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';

interface SkeletonCircleProps {
  size?: number;
  theme?: Theme;
}

export function SkeletonCircle({
  size = 20,
  theme = Theme.LIGHT
}: SkeletonCircleProps) {
  const themeConfig = getThemeColor(theme);

  return (
    <View
      style={[
        $circleSkeletion,
        {
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: themeConfig.skeletonGrey
        }
      ]}
    ></View>
  );
}

const $circleSkeletion: ViewStyle = {};

interface SkeletonSpanProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  theme?: Theme;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function SkeletonSpan({
  width,
  height,
  radius,
  theme = Theme.LIGHT,
  style: $customStyle,
  children
}: SkeletonSpanProps) {
  const themeConfig = getThemeColor(theme);
  return (
    <View
      style={[
        $circleSkeletion,
        {
          width: width,
          height: height,
          borderRadius: radius,
          backgroundColor: themeConfig.skeletonGrey
        },
        $customStyle
      ]}
    >
      {children}
    </View>
  );
}

export function SkeletonRow({
  children,
  gap = 10,
  repeat,
  style: $customStyle
}: {
  children?: React.ReactNode;
  gap?: number;
  repeat?: number;
  style?: ViewStyle;
}) {
  const ele = new Array(repeat).fill(children);
  return (
    <View
      style={[
        $skeletonRow,
        { justifyContent: 'flex-start', gap: gap },
        $customStyle
      ]}
    >
      {ele}
    </View>
  );
}

const $skeletonRow: ViewStyle = {
  display: 'flex',
  flexDirection: 'row'
};

export function SkeletonColumn({
  children,
  gap = 10,
  repeat,
  style: $customStyle
}: {
  children?: React.ReactNode;
  gap?: number;
  repeat?: number;
  style?: ViewStyle;
}) {
  const ele = new Array(repeat).fill(children);
  return (
    <View
      style={[
        $skeletonColumn,
        { justifyContent: 'flex-start', gap: gap },
        $customStyle
      ]}
    >
      {ele}
    </View>
  );
}

const $skeletonColumn: ViewStyle = {
  display: 'flex',
  flexDirection: 'column'
};
