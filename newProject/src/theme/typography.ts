import { Platform } from 'react-native';

const fonts = {
  helveticaNeue: {
    // iOS only font.
    thin: 'HelveticaNeue-Thin',
    light: 'HelveticaNeue-Light',
    normal: 'Helvetica Neue',
    medium: 'HelveticaNeue-Medium',
    bold: 'HelveticaNeue-Bold'
  },
  sansSerif: {
    // Android only font.
    thin: 'sans-serif-thin',
    light: 'sans-serif-light',
    normal: 'sans-serif',
    medium: 'sans-serif-medium',
    bold: 'sans-serif-medium'
  },
  monaco: {
    // iOS only font.
    normal: 'Menlo'
  },
  monospace: {
    // Android only font.
    normal: 'monospace'
  },
  campton: 'Campton',
  feed: 'LipuFeed',
  ip: 'LipuIP',
  baba: {
    medium: 'AlibabaPuHuiTiMedium',
    bold: 'AlibabaPuHuiTiBold',
    heavy: 'AlibabaPuHuiTiHeavy'
  },
  wishcard: 'LipuWishCard',
  world: 'LipuWorld',
  pingfangSC: {
    normal: 'PingFang SC'
  },
  SourceHanSerif: {
    bold: 'SourceHanSerifBold'
  }
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: Platform.OS === 'ios' ? fonts.helveticaNeue : fonts.sansSerif,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({
    ios: fonts.helveticaNeue,
    android: fonts.sansSerif
  }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.OS === 'ios' ? fonts.monaco : fonts.monospace
};
