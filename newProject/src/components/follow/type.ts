import { TextStyle, ViewStyle } from 'react-native';

export enum FollowStatus {
  DEFAULT = 'default',
  FOLLOWING = 'following',
  BEING_FOLLOWED = 'beingFollowed',
  FOLLOW_EACH_OTHER = 'followEachOther'
}

export enum FollowBtnTheme {
  // 线性
  REGULAR = 'regularStyle',
  // 面性(适用于浅色背景)
  SOLID = 'solidStyleForLightMode',
  // 面性(适用于深色背景)
  SOLID_DARK_MODE = 'solidStyleInDarkMode',
  // 面性(适用于彩色背景)
  SOLID_COLOR_MODE = 'solidStyleInColorMode'
}

export type styleConfig = {
  text: TextStyle;
  button: ViewStyle;
};
