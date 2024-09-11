import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { $flexHCenter, createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import { parallelWorldColors } from '../../_constants';

interface GalleryPaginationProps<T> {
  data: T[];
  activeIndex: number;
  onPageChange: (d: T, index: number) => void;
  renderItem?: (d: T, index: number) => React.ReactElement;
  getKey?: (d: T) => string | number;
  style?: StyleProp<ViewStyle>;
}

export default function GalleryPagination<T>({
  data,
  activeIndex,
  onPageChange,
  renderItem,
  getKey,
  style: $styleOverwrite = {}
}: GalleryPaginationProps<T>) {
  return (
    <View style={[styles.$container, $styleOverwrite]}>
      {renderItem
        ? data.map((d, i) => renderItem(d, i))
        : data.map((d, i) => (
            <Pressable
              key={getKey ? getKey(d) : i}
              style={styles.$pressArea}
              onPress={() => {
                onPageChange(d, i);
              }}
            >
              <View
                style={i === activeIndex ? styles.$activeItem : styles.$item}
              />
            </Pressable>
          ))}
    </View>
  );
}

const styles = createStyle({
  $container: { ...$flexHCenter },
  $pressArea: { padding: 4 },
  $item: {
    ...createCircleStyle(8),
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  $activeItem: {
    ...createCircleStyle(8),
    backgroundColor: parallelWorldColors.fontGlow
  }
});
