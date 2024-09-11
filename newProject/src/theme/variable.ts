import { TextStyle, ViewStyle } from 'react-native';
import { CommonColor } from './colors/common';
import { typography } from './typography';

/** 样式 common */
export const $flex: ViewStyle = {
  flex: 1
};

export const $relative: ViewStyle = {
  position: 'relative'
};

export const $absolute: ViewStyle = {
  position: 'absolute'
};

export const $flexHBetween: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
};

export const $flexHCenter: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
};

export const $flexCenter: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center'
};

export const $flexRow: ViewStyle = {
  flexDirection: 'row'
};

export const $flexColumn: ViewStyle = {
  flexDirection: 'column'
};

export const $flexHStart: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row'
};

export const $basicText: TextStyle = {
  color: '#fff',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 16,
  fontWeight: '600',
  lineHeight: 24
};

export const $Z_INDEXES = {
  zm1: -1,
  z0: 0,
  z1: 1,
  z2: 2,
  z5: 5,
  z10: 10,
  z20: 20,
  z50: 50,
  z100: 100,
  z200: 200,
  z500: 500,
  z1000: 1000
};

export const $USE_FONT = (
  color?: string,
  fontFamily?: string,
  fontSize?: number,
  fontStyle?: any,
  fontWeight?: number | string,
  lineHeight?: number
) => {
  return {
    ...(color && { color }),
    ...(fontFamily && { fontFamily }),
    ...(fontSize && { fontSize }),
    ...(fontStyle && { fontStyle }),
    ...(fontWeight && { fontWeight }),
    ...(lineHeight && { lineHeight })
  };
};

// TODO: 整合：注意 theme/colors 里的和这里的 color 最好做个命名规范+整合
// TODO: 业务名 + [attr] 因为app色彩泛滥、状态很难统一，要切分小点
/** 颜色 common [后期可根据 color 分出去] */
export const $FEED_COLORS = {
  inputColor: '#764e1a',
  rippleColor: '#FFE5BC',
  onlineColor: '#2FCF96',
  userNameColor: '#727272'
};

export const $SEARCH_COLORS = {
  main: CommonColor.brand1,
  searchBg: '#F5F5F5',
  white: CommonColor.white,
  black_10: 'rgba(0, 0, 0, 0.10)',
  black_16: 'rgba(0, 0, 0, 0.16)',
  black: CommonColor.black,
  black_25: 'rgba(0, 0, 0, 0.25)',
  black_30: 'rgba(0, 0, 0, 0.30)',
  black_40: 'rgba(0, 0, 0, 0.40)',
  black_54: 'rgba(0, 0, 0, 0.54)',
  black_87: 'rgba(0, 0, 0, 0.87)',
  top1: '#C28837',
  top2: 'rgba(0, 0, 0, 0.25)',
  top3: 'rgba(0, 0, 0, 0.25)'
};

export const $MSG_COLORS = {
  creditColor: '#FFF0EB',
  creditTextColor: '#FF6A3BE5'
};

// tab lib+组件
export const $LIB_TAB_COLORS = {
  tabBgColor: '#101010'
};

export const createCircleStyle = (size: number) => ({
  width: size,
  height: size,
  borderRadius: size / 2
});
