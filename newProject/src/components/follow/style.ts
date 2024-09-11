import { TextStyle, ViewStyle } from 'react-native';
import { colors } from '@/src/theme';
import { styleConfig } from './type';

const $commonTextStyle: TextStyle = {
  fontSize: 12,
  lineHeight: 18,
  fontWeight: '500'
};

// todo@linyueqiang predefine in common button
export const styles = {
  followBtn: {
    width: 'auto',
    height: 28,
    borderWidth: 1,
    borderColor: colors.palette.brand1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingLeft: 16,
    paddingRight: 16
  } as ViewStyle,
  // 面性+highlighted
  followStatus0: {
    backgroundColor: colors.palette.brand1
  },
  // 面性+weakened+实色
  followStatus1: {
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderColor: 'rgba(245, 245, 245, 1)'
  },
  // 线性+highlighted
  followStatus2: {
    backgroundColor: 'transparent',
    borderColor: colors.palette.brand1
  },
  // 线性+weakened
  followStatus3: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0, 0, 0, 0.08)'
  },
  // 面性+weakened+透明色
  followStatus4: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)'
  },
  followTextStatus0: {
    color: '#fff',
    ...$commonTextStyle
  },
  followTextStatus1: {
    color: 'rgba(0, 0, 0, 0.26)',
    ...$commonTextStyle
  },
  followTextStatus2: {
    color: colors.palette.brand1,
    ...$commonTextStyle
  },
  followTextStatus3: {
    color: 'rgba(0, 0, 0, 0.3)',
    ...$commonTextStyle
  },
  followTextStatus4: {
    color: 'rgba(255, 255, 255, 0.3)',
    ...$commonTextStyle
  }
};

export const regularAndHighlighted: styleConfig = {
  button: styles.followStatus2,
  text: styles.followTextStatus2
};

export const regularAndWeakened: styleConfig = {
  button: styles.followStatus3,
  text: styles.followTextStatus3
};

export const solidAndHighlighted: styleConfig = {
  button: styles.followStatus0,
  text: styles.followTextStatus0
};

// 适用浅色背景
export const solidAndWeakened1: styleConfig = {
  button: styles.followStatus1,
  text: styles.followTextStatus1
};

// 适用深色背景
export const solidAndWeakened2: styleConfig = {
  button: styles.followStatus4,
  text: styles.followTextStatus4
};

// 适用彩色背景
export const solidAndWeakened3: styleConfig = {
  button: styles.followStatus3,
  text: styles.followTextStatus3
};
