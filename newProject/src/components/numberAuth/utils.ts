import {
  DimensionValue,
  Dimensions,
  Image,
  ImageSourcePropType,
  ViewStyle
} from 'react-native';

export type RGBColor =
  | `rgba(${number},${number},${number},${number})`
  | `rgb(${number},${number},${number})`;
export type HEXColor = `#${string}`;
export type Color = RGBColor | HEXColor;
export type NumberAuthViewStyle = {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  center?: boolean;
  middle?: boolean;
};

export type NumberAuthAlignment = 'left' | 'right' | 'center';

export type NumberAuthTextStyle = {
  color?: Color;
  fontSize?: number;
  fontWeight?: string;
};

export type NumberAuthBorderRadiusStyle = {
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
};

export type NumberAuthStyle = NumberAuthViewStyle & NumberAuthBorderRadiusStyle;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function getTextStyle(style: NumberAuthTextStyle) {
  const { color, fontSize, fontWeight } = style;
  const textColor = getHex(color) || 0x000000ff;
  const textFontSize = fontSize || 14;
  const textWeight = fontWeight || '400';
  return { textColor, textFontSize, textWeight };
}

export function rgbToHex(color: string): string {
  const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;

  const match = color.match(rgbRegex);
  if (!match) {
    return color;
  }

  const [, r, g, b, a] = match;

  const hexR = parseInt(r).toString(16).padStart(2, '0');
  const hexG = parseInt(g).toString(16).padStart(2, '0');
  const hexB = parseInt(b).toString(16).padStart(2, '0');

  let hexA = '';
  if (a) {
    const alpha = parseFloat(a);
    hexA = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0');
  }

  return `#${hexR}${hexG}${hexB}${hexA}`;
}

export function hexToHexValue(hexColor: string) {
  if (!hexColor.startsWith('#')) {
    console.warn('Invalid hex color string. It should start with "#".');
    return 0x000000ff;
  }
  const hexString = hexColor.toUpperCase().slice(1);
  if (hexString.length !== 6 && hexString.length !== 8) {
    console.warn('Invalid hex color string. It should have 6 or 8 characters.');
    return 0x000000ff;
  }
  const r = hexString.slice(0, 2);
  const g = hexString.slice(2, 4);
  const b = hexString.slice(4, 6);
  const a = hexString.slice(6, 8) || 'FF';

  return parseInt(`0x${r}${g}${b}${a}`, 16);
}

export function getHex(color?: Color) {
  if (!color) return;
  const hex = hexToHexValue(rgbToHex(color));
  return hex;
}
export function getBorderRadius(style: NumberAuthStyle) {
  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderRadius,
    borderBottomRightRadius
  } = style;
  return [
    borderTopLeftRadius || borderRadius || 0,
    borderBottomLeftRadius || borderRadius || 0,
    borderBottomRightRadius || borderRadius || 0,
    borderTopRightRadius || borderRadius || 0
  ];
}

export function getBoundingRect(style: NumberAuthStyle) {
  const { width, height, top, left, right, bottom, center, middle } = style;
  let newWidth = width || 0;
  let newHeight = height || 0;
  let newTop = top || 0;
  let newLeft = left || 0;
  if (typeof width === 'undefined') {
    // 根据屏幕计算宽度
    newWidth = screenWidth - newLeft - (right || 0);
  }
  if (typeof height === 'undefined') {
    // 根据屏幕计算高度
    newHeight = screenHeight - newTop - (bottom || 0);
  }
  if (typeof top === 'undefined' && typeof bottom !== 'undefined') {
    newTop = Math.max(screenHeight - newHeight - bottom, 0);
  }

  if (typeof left === 'undefined' && typeof right !== 'undefined') {
    newLeft = Math.max(screenWidth - newWidth - right, 0);
  }
  if (center && newWidth) {
    newLeft = screenWidth / 2 - newWidth / 2;
  }
  if (middle && newHeight) {
    newTop = screenHeight / 2 - newHeight / 2;
  }
  return [newLeft, newTop, newWidth, newHeight];
}
export function resolveImageURL(uriId: ImageSourcePropType) {
  return Image.resolveAssetSource(uriId).uri;
}

export function getAlign(type: NumberAuthAlignment) {
  const map = {
    left: 1,
    center: 0,
    right: 2
  };
  return map[type];
}
