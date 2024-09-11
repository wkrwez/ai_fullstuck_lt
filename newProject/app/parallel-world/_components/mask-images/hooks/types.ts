import { SharedValue } from 'react-native-reanimated';

export interface IMaskHook {
  cur: SharedValue<number>;
  height: number;
  width: number;
  dir?: AnimationDir;
}

export enum AnimationDir {
  left = 'left',
  right = 'right',
  bottom = 'bottom',
  top = 'top'
}
export const DIFF_DISTANCE = 100;

export const SPACE = 10;
