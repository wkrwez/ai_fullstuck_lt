import { useState } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { config } from '../constant';
import { AnimateItem } from '../optionList/AnimateItem';
import { useShallow } from 'zustand/react/shallow';

const $wrap: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
  //   backgroundColor: '#ff0000'
};

export function AnimationElementsView() {
  const { elements } = useMakePhotoStoreV2(
    useShallow(state => ({
      elements: Object.values(state.selectedElements).filter(i => !!i)
    }))
  );

  return (
    <View style={$wrap} pointerEvents="none">
      {elements.map((item, index) => (
        <AnimateItem key={item?.id + `${index}`} {...item} />
      ))}
    </View>
  );
}
