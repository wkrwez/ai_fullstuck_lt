/**
 * 1. 要加动画
 * 2. item支持children传入
 */
import React, { ReactNode, useMemo } from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { styles } from '@/src/utils/index';

export interface ItemProps {
  label: string;
  key: string;
}

export interface Props {
  items: ItemProps[];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  activeStyle?: StyleProp<ViewStyle>;
  activeTextStyle?: StyleProp<TextStyle>;
  activeNode?: ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  animationDuration?: number;
  onChange?: (v: string) => void;
  current: string;
}

export function Tabs(props: Props) {
  return (
    <View style={props.style}>
      {props.items.map(item => (
        <Pressable
          key={item.key}
          style={styles(
            props.itemStyle,
            props.current === item.key && props.activeStyle
          )}
          onPress={() => props.onChange && props.onChange(item.key)}
        >
          {props.current === item.key && props.activeNode}
          <Text
            style={[
              props.itemTextStyle,
              props.current === item.key && props.activeTextStyle
            ]}
          > 
            {item.label}
          </Text>
        </Pressable>
      ))}
      {props.children}
    </View>
  );
}
