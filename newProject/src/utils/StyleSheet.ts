import {
  ImageStyle,
  StyleSheet as OriginStyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle
} from 'react-native';
import * as theme from '../theme';
import dp2px from './dp2px';
import { getScreenSize } from './getScreenSize';

export type StyleList = {
  [key in string]: TextStyle | ViewStyle | ImageStyle;
};

type StyleSheetCreated<T> = {
  [K in keyof T]: T[K];
};

export type PositionRealStyle = {
  marginTop?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number;
  height?: number;
};

export type PositionStyle = {
  marginTop?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  width?: number | ((payload: PositionStyle) => number);
  height?: number | ((payload: PositionStyle) => number);
};

export const StyleSheet = {
  ...OriginStyleSheet,
  ...theme,
  create: <T extends StyleList>(style: T) => {
    let s = { ...style };
    // 目前仅对以下的属性进行处理
    let list = [
      'width',
      'minWidth',
      'height',
      'lineHeight',
      'minHeight',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'top',
      'right',
      'bottom',
      'left',
      'gap'
      // "fontSize", // 文字大小暂时不缩放
      // "lineHeight",
    ];
    for (let outKey in s) {
      for (let innerKey in s[outKey]) {
        if (
          list.includes(innerKey) &&
          // @ts-ignore
          typeof s[outKey][innerKey] == 'number'
        ) {
          // @ts-ignore
          s[outKey][innerKey] = dp2px(s[outKey][innerKey]);
        }
      }
    }
    return OriginStyleSheet.create(s) as StyleSheetCreated<T>;
  },
  createRectStyle(
    {
      left,
      right,
      top,
      bottom,
      marginTop,
      height: originHeight,
      width: originWidth
    }: PositionStyle,
    pickAttrs?: (keyof PositionStyle)[]
  ): PositionRealStyle {
    const width = getScreenSize('width');
    const height = getScreenSize('height');

    let realTop = top || 0;
    let realLeft = left || 0;
    let realWidth = width - (left || 0) - (right || 0);
    let realHeight = height - (top || 0) - (bottom || 0) - (marginTop || 0);
    const data: PositionRealStyle = {
      top: realTop,
      left: realLeft,
      width: realWidth,
      height: realHeight
    };

    if (
      typeof left === 'undefined' &&
      typeof right !== 'undefined' &&
      typeof originWidth === 'number'
    ) {
      data.left = width - right - originWidth;
    }

    if (typeof top === 'undefined' && typeof bottom !== 'undefined') {
      data.top =
        height - bottom - (Number(originHeight) || 0) - (marginTop || 0);
    }

    if (typeof originWidth === 'number') {
      realWidth = originWidth;
      data.width = realWidth;
    }

    if (typeof originWidth === 'function') {
      realWidth = originWidth(data);
      data.width = realWidth;
    }

    if (typeof originHeight === 'number') {
      realHeight = originHeight;
      data.height = realHeight;
    }

    if (typeof originHeight === 'function') {
      realHeight = originHeight(data);
      data.height = realHeight;
    }

    if (!pickAttrs) {
      return data;
    }

    return pickAttrs.reduce((result: PositionRealStyle, key) => {
      result[key] = data[key];
      return result;
    }, {});
  },
  withSafeBottom(style: PositionRealStyle, bottom: number) {
    return {
      ...style,
      height: (Number(style.height) || 0) - (bottom || 0)
    };
  }
};
export default StyleSheet;

// 用于获取关于style的ts类型提示
export const createStyle = <T extends StyleList>(
  style: T
): StyleSheetCreated<T> => style;
