import { ViewStyle } from 'react-native';
import { StyleSheet, dp2px } from '@/src/utils';

export const size = dp2px(30);

export interface OptionItemProps {
  icon: number;
  text: string;
  id: string;
  checked?: boolean;
  style?: ViewStyle;
}

export interface IconItemProps {
  type: string;
  color?: string;
  size?: number;
  text?: string;
}
