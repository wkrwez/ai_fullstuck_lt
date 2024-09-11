import React, { ReactElement } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { colors } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { parallelWorldColors } from '../../_constants';
import UserDisplay from '../others/user-display';

export interface DanmakuItemProps<T> {
  item: T;
  style: StyleProp<TextStyle>;
}

export default function DanmakuItem<T>({
  item,
  renderItem,
  style: $style = {}
}: DanmakuItemProps<T> & { renderItem: (item: T) => ReactElement }) {
  return <View style={$style}>{renderItem(item)}</View>;
}
