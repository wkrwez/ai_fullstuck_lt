import { forwardRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '@/src/theme';
import { StyleSheet, createStyle } from '@/src/utils';
import { BOTTOM_BAR_HEIGHT, BUTTON_HEIGHT } from '../../_constants';

export interface BottomBarProps {
  barLeft?: React.ReactNode;
  barRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BottomBar = forwardRef(
  (
    { barLeft, barRight, style }: BottomBarProps,
    ref: React.LegacyRef<View>
  ) => {
    return (
      <View style={[styles.$wrap, style]} ref={ref}>
        {barLeft || <View />}
        {barRight || <View />}
      </View>
    );
  }
);

const styles = createStyle({
  $wrap: {
    ...StyleSheet.rowStyle,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    height: BOTTOM_BAR_HEIGHT,
    paddingHorizontal: 16
  }
});
