import { useEffect, useMemo, useState } from 'react';
import { Pressable, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animeted, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { useStorageStore } from '@/src/store/storage';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { PromptType } from '../constant';
import { useShallow } from 'zustand/react/shallow';
import { $pannelStyle } from './PannelBg';

const st = StyleSheet.create({
  $wrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: StyleSheet.currentColors.subset.blue.black,
    opacity: 0.7
  },
  $guide1: {
    position: 'absolute',
    width: 282,
    height: 60,
    right: 73,
    top: $pannelStyle.top || 0
  },
  $guide2: {
    position: 'absolute',
    width: 63,
    height: 63,
    top: ($pannelStyle.top || 0) + 120,
    left: ($pannelStyle.left || 0) + ($pannelStyle.width || 0) * 0.5 - 5
  }
});

const GUIDE_IMAGE = require('@Assets/makephoto/guide.png');
const GUIDE_IMAGE2 = require('@Assets/makephoto/guide2.png');
export function GuideView() {
  const { currentSlot, pageState, role2 } = useMakePhotoStoreV2(
    useShallow(state => ({
      currentSlot: state.currentSlot,
      pageState: state.pageState,
      role2: state.role2
    }))
  );

  const { visMakephotoDouble } = useStorageStore(
    useShallow(state => ({
      visMakephotoDouble: state.visMakephotoDouble
    }))
  );

  const showGuide = useMemo(() => {
    return (
      !visMakephotoDouble && currentSlot?.type === PromptType.action && role2
    );
  }, [currentSlot, pageState, role2, visMakephotoDouble]);
  return (
    showGuide && (
      <Pressable
        style={st.$wrap}
        onPress={() => {
          useStorageStore.getState().__setStorage({ visMakephotoDouble: 1 });
        }}
      >
        <Animeted.View
          style={{ width: '100%', height: '100%' }}
          entering={FadeIn.duration(1000)}
          exiting={FadeOut.duration(500)}
        >
          <Image source={GUIDE_IMAGE} style={st.$guide1 as ImageStyle} />
          <Image source={GUIDE_IMAGE2} style={st.$guide2 as ImageStyle} />
        </Animeted.View>
      </Pressable>
    )
  );
}
