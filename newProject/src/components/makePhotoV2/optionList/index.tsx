import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { StyleSheet } from '@Utils/StyleSheet';
import { OptionType, config } from '../constant';
import { $pannelStyle } from '../pannel/PannelBg';
import { useShallow } from 'zustand/react/shallow';
import { OptionItem } from './Item';

interface OptionListProps {
  config: OptionType;
  index?: number;
  onScroll?: (y: number) => void;
}

const theme = StyleSheet.currentColors.subset.blue;
const linearOpts = {
  colors: [
    theme.black,
    StyleSheet.hex(theme.black, 0),
    StyleSheet.hex('#282C35', 0),
    '#282C35'
  ],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
  locations: [0, 0.2, 0.8, 1]
};

export function OptionList(props: OptionListProps) {
  const flatListRef = useRef<FlatList>(null);
  const canLoadMore = useRef<boolean>(true);
  const { height } = useScreenSize('window');

  const { prompts } = useMakePhotoStoreV2(
    useShallow(state => ({
      prompts: state.cachePrompts[props.config.key]
    }))
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: Math.max(0, props.index || 0),
        viewPosition: 0
      });
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [props.index]);
  // const $containerInsets = useSafeAreaInsetsStyle(['bottom']);

  // const
  // console.log('prompts-------', prompts);
  const options = useMemo(() => {
    return props.config.options.concat(prompts || []);
  }, [prompts, props.config.options]);
  return (
    <>
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={options}
        renderItem={({ item, index }) => {
          return (
            <OptionItem
              style={index === 0 ? { marginTop: 104 } : undefined}
              key={item}
              // @ts-ignore
              text={item}
              {...config[item]}
              checked={props.index === index}
            />
          );
        }}
        keyExtractor={item => item}
        ref={flatListRef}
        onEndReachedThreshold={0.1}
        contentContainerStyle={
          {
            // flex: 1,
            // height: height
          }
        }
        onEndReached={() => {
          if (!canLoadMore.current) return;
          onEndReached();
        }}
      ></FlatList>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
        pointerEvents="none"
      >
        <LinearGradient
          style={{ width: '100%', height: '100%' }}
          {...linearOpts}
        ></LinearGradient>
      </View>
    </>
  );

  function onEndReached() {
    canLoadMore.current = false;
    useMakePhotoStoreV2
      .getState()
      .getPrompt(props.config.key)
      .then(() => {
        console.log('getPrompt-------');
        canLoadMore.current = true;
      })
      .catch(() => {
        canLoadMore.current = true;
      });
  }
}
