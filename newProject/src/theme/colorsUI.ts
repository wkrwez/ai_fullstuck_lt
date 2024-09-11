// todo 暂时先保留，逐步迁
export const palette = {
  white: '#FFFFFF',
  brand1: '#FF6A3B', // 渐变深色
  brand2: '#FF8F50', // 渐变浅色


  // todo: stepchat的，怕直接移除有报错，暂时先保留
  text: '#1E2539',

  neutral9: '#FAFCFF',
  black: '#000', //rgba(30, 37, 57, 1)
  black100: 'rgba(0, 0, 0, 0.1)',
  black200: 'rgba(0, 0, 0, 0.2)',
  gray: '#8595B0', // rgba(133, 149, 176, 1)
  subtle: '#5D6B88', //

  primary: '#005AFF', //rgba(0, 90, 255, 1)
  brandDisable: '#8BBFFF',

  success100: '#EBFFE8' /* 浅色背景 */,
  success200: '#AFF0B5' /* 特殊场景 */,
  success300: '#7BE188' /* 禁用 */,
  success400: '#4CD263' /* 特殊场景 */,
  success500: '#23C343' /* 悬浮 */,
  success600: '#00B42A' /* 常规 */,
  success700: '#009A29' /* 点击 */,

  warning100: '#FFF7EB' /* 浅色背景 */,
  warning200: '#FFE4BA' /* 特殊场景 */,
  warning300: '#FFCF8B' /* 禁用 */,
  warning400: '#FFB65D' /* 特殊场景 */,
  warning500: '#FF9A2E' /* 悬浮 */,
  warning600: '#FF7D00' /* 常规 */,
  warning700: '#D25F00' /* 点击 */,

  danger100: '#FFECE8' /* 浅色背景 */,
  danger200: '#FDCDC5' /* 特殊场景 */,
  danger300: '#FBACA3' /* 禁用 */,
  danger400: '#F98981' /* 特殊场景 */,
  danger500: '#F76560' /* 悬浮 */,
  danger600: '#F53F3F' /* 常规 */,
  danger700: '#CB2634' /* 点击 */,

  // overlay20: 'rgba(25, 16, 21, 0.2)',
  // overlay50: 'rgba(25, 16, 21, 0.5)',
} as const;

export const colors = {
  palette,

  primary: palette.primary,
  white: palette.white,
  black: palette.black,
  transparent: 'rgba(0, 0, 0, 0)',
  text: palette.black,
  textGray: palette.gray,
  textSubtle: palette.subtle,
  textSubtlest: palette.gray,
  // themeGround:'rgba(255, 106, 59, 1)',
  themeGround:'#FF6A3B',
  lightTheme:'#FFD8CB',
  /**
   * The default color of the screen background.
   */
  background: '#1E2539',
  backgroundGray: '#f5f7f8',
  link: palette.primary,
  border: palette.black100,

  success: palette.success600,
  danger: palette.danger600,
  error: palette.danger600,
  warning: palette.warning600,

  successBackground: palette.success100,
  dangerBackground: palette.danger100,
  errorBackground: palette.danger100,
  warningBackground: palette.warning100,
};

export const paletteUI = {
  Light: {
    Brand: {
      Brand1: '#e8f4ff',
      Brand2: '#badbff',
      Brand3: '#8bbfff',
      Brand4: '#5da0ff',
      Brand5: '#2e7eff',
      Brand6: '#005aff',
      Brand7: '#0043d2',
    },
    Red: {
      Red1: '#ffece8',
      Red2: '#ffcdc5',
      Red3: '#ffaca3',
      Red4: '#ff8980',
      Red5: '#ff635e',
      Red6: '#ff3b3b',
      Red7: '#d2252a',
    },
    Green: {
      Green1: '#e8ffef',
      Green2: '#b4f7ca',
      Green3: '#82efaa',
      Green4: '#54e68e',
      Green5: '#28de77',
      Green6: '#00d663',
      Green7: '#00b45a',
    },
    Orange: {
      Orange1: '#fff7eb',
      Orange2: '#ffe4ba',
      Orange3: '#ffcf8b',
      Orange4: '#ffb65d',
      Orange5: '#ff9a2e',
      Orange6: '#ff7a00',
      Orange7: '#d25f00',
    },
    Blue: {
      Blue1: '#e8f4ff',
      Blue2: '#badbff',
      Blue3: '#8bbfff',
      Blue4: '#5da0ff',
      Blue5: '#2e7eff',
      Blue6: '#005aff',
      Blue7: '#0043d2',
    },
    White: {
      White1: '#ffffff',
      White2: 'rgba(255, 255, 255, 0.80)',
      White3: 'rgba(255, 255, 255, 0.60)',
      White4: 'rgba(255, 255, 255, 0.40)',
      White5: 'rgba(255, 255, 255, 0.20)',
      White6: 'rgba(255, 255, 255, 0.10)',
    },
    Netutral: {
      Neutral1: '#1e2539',
      Neutral2: '#3a4661',
      Neutral3: '#5d6b88',
      Neutral4: '#8595b0',
      Neutral5: '#b3c2d7',
      Neutral6: '#e2e7ee',
      Neutral7: '#ebf0f6',
      Neutral8: '#f5f7fb',
      Neutral9: '#fafcff',
    },
    Black: {
      Black1: '#000000',
      Black2: 'rgba(0, 0, 0, 0.80)',
      Black3: 'rgba(0, 0, 0, 0.60)',
      Black4: 'rgba(0, 0, 0, 0.40)',
      Black5: 'rgba(0, 0, 0, 0.30)',
      Black6: 'rgba(0, 0, 0, 0.20)',
      Black7: 'rgba(0, 0, 0, 0.10)',
    },
    Alpha: {
      neutral: {
        neutral1: 'rgba(30, 37, 57, 0.5)',
        neutral2: 'rgba(30, 37, 57, 0.10)',
        neutral3: 'rgba(30, 37, 57, 0.20)',
        neutral4: 'rgba(30, 37, 57, 0.40)',
        neutral5: 'rgba(30, 37, 57, 0.60)',
        neutral6: 'rgba(30, 37, 57, 0.80)',
      },
    },
    Cyan: {
      Cyan1: '#e8ffff',
      Cyan2: '#c5fcff',
      Cyan3: '#a1f7ff',
      Cyan4: '#7ef0ff',
      Cyan5: '#5ae6ff',
      Cyan6: '#37dbff',
      Cyan7: '#22acd2',
    },
  },
};
export const colorsUI = {
  Text: {
    brand: {
      brand: paletteUI.Light.Brand.Brand6,
      hover: paletteUI.Light.Brand.Brand5,
      disable: paletteUI.Light.Brand.Brand3,
      pressed: paletteUI.Light.Brand.Brand7,
    },
    danger: {
      default: paletteUI.Light.Red.Red6,
      hover: paletteUI.Light.Red.Red5,
      disable: paletteUI.Light.Red.Red3,
      pressed: paletteUI.Light.Red.Red7,
    },
    warning: {
      default: paletteUI.Light.Orange.Orange6,
      hover: paletteUI.Light.Orange.Orange5,
      disable: paletteUI.Light.Orange.Orange3,
      pressed: paletteUI.Light.Orange.Orange7,
    },
    success: {
      default: paletteUI.Light.Green.Green6,
      hover: paletteUI.Light.Green.Green5,
      disable: paletteUI.Light.Green.Green3,
      pressed: paletteUI.Light.Green.Green7,
    },
    information: {
      default: paletteUI.Light.Blue.Blue6,
      hover: paletteUI.Light.Blue.Blue5,
      disable: paletteUI.Light.Blue.Blue3,
      pressed: paletteUI.Light.Blue.Blue7,
    },
    default: {
      title: paletteUI.Light.Netutral.Neutral1,
      body: paletteUI.Light.Netutral.Neutral2,
      subtle: paletteUI.Light.Netutral.Neutral3,
      subtlest: paletteUI.Light.Netutral.Neutral4,
      disable: paletteUI.Light.Netutral.Neutral5,
      selected: paletteUI.Light.Brand.Brand6,
      inverse: paletteUI.Light.White.White1,
    },
  },
  Link: {
    default: paletteUI.Light.Blue.Blue6,
    pressed: paletteUI.Light.Blue.Blue7,
  },
  Icon: {
    netutral: {
      default: paletteUI.Light.Netutral.Neutral1,
      body: paletteUI.Light.Netutral.Neutral2,
      subtlest: paletteUI.Light.Netutral.Neutral4,
      subtle: paletteUI.Light.Netutral.Neutral3,
      inverse: paletteUI.Light.White.White1,
      selected: paletteUI.Light.Brand.Brand6,
      disable: paletteUI.Light.Netutral.Neutral5,
    },
    default: paletteUI.Light.Cyan.Cyan6,
    hover: paletteUI.Light.Cyan.Cyan5,
    disable: paletteUI.Light.Cyan.Cyan3,
    pressed: paletteUI.Light.Cyan.Cyan7,
    red: {
      default: paletteUI.Light.Red.Red6,
      hover: paletteUI.Light.Red.Red5,
      disable: paletteUI.Light.Red.Red3,
      pressed: paletteUI.Light.Red.Red7,
    },
    orange: {
      default: paletteUI.Light.Orange.Orange6,
      hover: paletteUI.Light.Orange.Orange5,
      disable: paletteUI.Light.Orange.Orange3,
      pressed: paletteUI.Light.Orange.Orange7,
    },
    green: {
      default: paletteUI.Light.Green.Green6,
      hover: paletteUI.Light.Green.Green5,
      disable: paletteUI.Light.Green.Green3,
      pressed: paletteUI.Light.Green.Green7,
    },
    blue: {
      default: paletteUI.Light.Blue.Blue6,
      hover: paletteUI.Light.Blue.Blue5,
      disable: paletteUI.Light.Blue.Blue3,
      pressed: paletteUI.Light.Blue.Blue7,
    },
    brand: {
      defatult: paletteUI.Light.Brand.Brand6,
      hover: paletteUI.Light.Brand.Brand5,
      disable: paletteUI.Light.Brand.Brand3,
      pressed: paletteUI.Light.Brand.Brand7,
    },
  },
  Shadow: {
    shadow: paletteUI.Light.Alpha.neutral.neutral2,
  },
  Background: {
    brand: {
      default: paletteUI.Light.Brand.Brand1,
      hover: paletteUI.Light.Brand.Brand2,
      pressed: paletteUI.Light.Brand.Brand3,
    },
    orange: {
      default: paletteUI.Light.Orange.Orange1,
      hover: paletteUI.Light.Orange.Orange2,
      pressed: paletteUI.Light.Orange.Orange3,
    },
    green: {
      default: paletteUI.Light.Green.Green1,
      hover: paletteUI.Light.Green.Green2,
      pressed: paletteUI.Light.Green.Green3,
    },
    blue: {
      default: paletteUI.Light.Blue.Blue1,
      hover: paletteUI.Light.Blue.Blue2,
      pressed: paletteUI.Light.Blue.Blue3,
    },
    red: {
      default: paletteUI.Light.Red.Red1,
      hover: paletteUI.Light.Red.Red2,
      pressed: paletteUI.Light.Red.Red3,
    },
    gray: {
      default: paletteUI.Light.Netutral.Neutral8,
      hover: paletteUI.Light.Netutral.Neutral7,
      pressed: paletteUI.Light.Netutral.Neutral6,
    },
  },
  Card: {
    green: {
      default: paletteUI.Light.Green.Green6,
      hover: paletteUI.Light.Green.Green5,
      pressed: paletteUI.Light.Green.Green7,
      disable: paletteUI.Light.Green.Green3,
    },
    white: {
      default: paletteUI.Light.White.White1,
      hover: paletteUI.Light.Netutral.Neutral8,
      pressed: paletteUI.Light.Netutral.Neutral7,
    },
    brand: {
      default: paletteUI.Light.Brand.Brand6,
      hover: paletteUI.Light.Brand.Brand5,
      pressed: paletteUI.Light.Brand.Brand7,
      disable: paletteUI.Light.Brand.Brand3,
    },
    neutral: {
      default: paletteUI.Light.Netutral.Neutral1,
      hover: paletteUI.Light.Netutral.Neutral3,
      pressed: paletteUI.Light.Netutral.Neutral1,
      disable: paletteUI.Light.Netutral.Neutral6,
    },
    blue: {
      default: paletteUI.Light.Blue.Blue6,
      hover: paletteUI.Light.Blue.Blue5,
      pressed: paletteUI.Light.Blue.Blue7,
      disable: paletteUI.Light.Blue.Blue3,
    },
    red: {
      defaul: paletteUI.Light.Red.Red6,
      hover: paletteUI.Light.Red.Red5,
      pressed: paletteUI.Light.Red.Red7,
      disable: paletteUI.Light.Red.Red3,
    },
    orange: {
      default: paletteUI.Light.Orange.Orange6,
      hover: paletteUI.Light.Orange.Orange5,
      pressed: paletteUI.Light.Orange.Orange7,
      disable: paletteUI.Light.Orange.Orange3,
    },
  },
  Border: {
    default: {
      default1: paletteUI.Light.Alpha.neutral.neutral2,
      inverse: paletteUI.Light.White.White1,
    },
    brand: {
      default: paletteUI.Light.Brand.Brand4,
      disable: paletteUI.Light.Brand.Brand3,
    },
    danger: {
      default: paletteUI.Light.Red.Red4,
      disable: paletteUI.Light.Red.Red3,
    },
    warning: {
      warning: paletteUI.Light.Orange.Orange4,
      warningDisable: paletteUI.Light.Orange.Orange3,
    },
    success: {
      default: paletteUI.Light.Green.Green4,
      successDisable: paletteUI.Light.Green.Green3,
    },
    information: {
      default: paletteUI.Light.Blue.Blue4,
      disable: paletteUI.Light.Blue.Blue3,
    },
  },
};
