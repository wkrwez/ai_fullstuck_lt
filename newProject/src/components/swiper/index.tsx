import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import {
  SwiperFlatList,
  SwiperFlatListProps
} from 'react-native-swiper-flatlist';

interface SwiperHandle {
  scrollTo: (index: number) => void;
}
interface SwiperProps<T> extends SwiperFlatListProps<T> {
  onChangeIndex: (index: number) => void;
}

export const Swiper = forwardRef<SwiperHandle, SwiperProps>((props, ref) => {
  const swiperRef = useRef<SwiperFlatList>(null);
  const [index, setIndex] = useState(0);
  const { onChangeIndex: onChangeIndexProps, ...others } = props;

  useImperativeHandle(
    ref,
    () => ({
      scrollTo
    }),
    []
  );
  return (
    <View>
      {/** @ts-ignore */}
      <SwiperFlatList
        ref={swiperRef}
        {...(Platform.OS === 'android'
          ? { onChangeIndex: onChangeAndroidIndex }
          : { onViewableItemsChanged: onChangeIndex })}
        {...others}
      ></SwiperFlatList>
    </View>
  );

  function onChangeIndex(params: { changed: { index: number }[] }) {
    if (!swiperRef.current) return;
    const index = params.changed?.[0]?.index + 1;
    setIndex(index);
    onChangeIndexProps(index);
  }
  function onChangeAndroidIndex({ index }: { index: number }) {
    setIndex(index + 1);
    onChangeIndexProps(index + 1);
  }

  function scrollTo(index: number) {
    if (swiperRef.current) {
      swiperRef.current.scrollToIndex({ index });
    }
  }
});
