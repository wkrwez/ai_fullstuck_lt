import { CommonColors, Theme } from './type';

export const CommonColor: CommonColors = {
  brand1: '#FF6A3B', // 渐变深色
  brand2: '#FF8F50', // 渐变浅色
  brand3: '#FFE6DE', // 适用于元素背景
  white: '#ffffff',
  white1: 'rgba(0,0,0,0.3)',
  white2: '#EBEBEB',
  black: '#000000',
  black1: '#33373F',
  black2: '#262B33',
  black40: 'rgba(0,0,0,0.4)',
  blue: '#7FD9FF',
  blue2: '#CDEAFF',
  blue3: '#4FB8E4',
  title: '#222222',
  titleGray: 'rgba(0,0,0,0.87)',
  textGray: 'rgba(0,0,0,0.54)',
  gray1: 'rgba(255,255,255,0.6)',
  gray2: 'rgba(255,255,255,0.3)',
  red: '#ED798E'
};

// todo@linyueqiang 待整理
export const darkSceneColor = {
  bg: 'rgba(34, 34, 34, 1)',
  bg2: 'rgb(34, 34, 34)',
  border: 'rgba(255, 255, 255, 0.08)',
  fontColor: 'rgba(255, 255, 255, 0.87)',
  fontColor2: 'rgba(255, 255, 255, 0.6)',
  fontColor3: 'rgba(255, 255, 255, 0.4)',
  warningColor: 'rgba(255, 27, 72, 1)',
  eleBg: 'rgba(255, 255, 255, 0.10)',
  eleBgFill: 'rgba(54, 54, 54, 1)',
  skeletonGrey: 'rgba(255, 255, 255, 0.10)'
};

export const lightSceneColor = {
  bg: 'rgba(255, 255, 255, 1)',
  bg2: 'rgb(245, 245, 245)',
  border: 'rgba(0, 0, 0, 0.08)',
  fontColor: 'rgba(0, 0, 0, 0.87)',
  fontColor2: 'rgba(0, 0, 0, 0.6)',
  fontColor3: 'rgba(0, 0, 0, 0.4)',
  warningColor: 'rgba(255, 27, 72, 1)',
  eleBg: 'rgba(244, 244, 245, 1)',
  eleBgFill: 'rgba(244, 244, 245, 1)',
  skeletonGrey: '#EBEBEB'
};

export type SceneColor = typeof lightSceneColor;

export function getThemeColor(theme?: Theme) {
  switch (theme) {
    case Theme.DARK:
      return darkSceneColor;
    default:
      return lightSceneColor;
  }
}
