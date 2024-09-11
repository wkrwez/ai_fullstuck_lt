import * as Haptics from 'expo-haptics';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef
} from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { ImageItem } from '@/src/types';
import { StyleSheet, dp2px } from '@/src/utils';
import { Image } from '@Components/image';

const THUMB_BORDER = require('@Assets/image/brand-border.png');

interface ThumbListProps {
  itemSize: number;
  containerWidth: number;
  list: ImageItem[];
  goto?: (index: number) => void;
}

interface scorllListItem {
  offset: number;
  index: number;
}

export interface ThumbListHandle {
  gotoIndex: (v: number, animated?: boolean) => void;
}

export const ThumbList = forwardRef<ThumbListHandle, ThumbListProps>(
  (props, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        gotoIndex
      }),
      []
    );

    // 记录thumblist展示位移
    const scrollX = useSharedValue(0);
    // 记录每轮拖动前thumblist的位移
    const lastScrollRef = useRef(0);
    // 指向 scorllList，保证每次访问是最新值
    const scorllListRef = useRef<scorllListItem[]>([]);
    // 记录每轮滚动手指滑动起点
    const currentScrollRef = useRef(0);

    const indexRef = useRef(0);

    const realItemWidth = useMemo(() => {
      return dp2px(props.itemSize);
    }, [props.itemSize]);

    const space = useMemo(() => {
      return props.containerWidth / 2 - dp2px(props.itemSize / 2);
    }, [props.containerWidth, props.itemSize]);

    const scorllList = useMemo(() => {
      return props.list.map((item, index) => ({
        index,
        offset: 0 - dp2px(index * (props.itemSize + 4))
      }));
    }, [props.list]);
    scorllListRef.current = scorllList;

    const $listAnimationStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: scrollX.value
        }
      ]
    }));
    const pan = Gesture.Pan();
    pan
      .enabled(true)
      .onStart(e => {
        currentScrollRef.current = e.absoluteX;
        lastScrollRef.current = scrollX.value;
      })
      .onUpdate(e => {
        let diff = e.translationX + (lastScrollRef.current || 0);
        if (diff >= 0) {
          scrollX.value = 0;
        } else if (
          diff <=
          -1 * (realItemWidth + dp2px(4)) * (props.list.length - 1)
        ) {
          scrollX.value =
            -1 * (realItemWidth + dp2px(4)) * (props.list.length - 1);
        } else {
          if (
            Math.abs(e.absoluteX - currentScrollRef.current) > realItemWidth
          ) {
            Haptics.selectionAsync();
            currentScrollRef.current = e.absoluteX;
          }
          scrollX.value = diff;
        }
      })
      .onEnd(e => {
        const item = getNest(
          // 加上惯性距离
          e.translationX + e.velocityX / 50 + (lastScrollRef.current || 0)
        );
        gotoDis(item);

        //   const animateEffect = Easing.in(Easing.ease);
        //   const easeEffect = {
        //     duration: 300,
        //     easing: animateEffect
        //   };
        //   scrollX.value = withTiming(item.offset || 0, easeEffect);
        //   lastScrollRef.current = scrollX.value;
        //   Haptics.selectionAsync();
        //   props.goto(item.index);
      });
    return (
      <GestureDetector gesture={pan}>
        <View
          style={[
            st.$wrap,
            {
              width: props.containerWidth,
              height: realItemWidth + dp2px(2),
              paddingTop: dp2px(1),
              paddingBottom: dp2px(1)
            }
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.rowStyle,
              { width: props.containerWidth, height: '100%' },
              $listAnimationStyle
            ]}
          >
            {props.list.map((item, index) => (
              <Pressable
                onPress={() => {
                  gotoIndex(index);
                }}
                key={item.photoId}
                style={[
                  !index && { marginLeft: space },
                  st.$thumbItem,
                  { width: realItemWidth, height: realItemWidth }
                ]}
              >
                <Image
                  source={item.url}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  tosSize="size10"
                />
              </Pressable>
            ))}
          </Animated.View>
          {/* <FlatList
          data={props.list}
          style={{ width: props.containerWidth, height: '100%' }}
          horizontal={true}
          renderItem={({ item, index }) => {
            return (
              <View
                style={[
                  !index && { marginLeft: space },
                  st.$thumbItem,
                  { width: realItemWidth, height: realItemWidth }
                ]}
              >
                <Image
                  source={item.url}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            );
          }}
          ref={listRef}
          keyExtractor={(item, index) => (item.photoId || '') + index + ''}
        ></FlatList> */}
          <View
            style={[
              st.$borderWrap,
              {
                height: realItemWidth + dp2px(2)
              }
            ]}
            pointerEvents="none"
          >
            <View
              style={[
                st.$selectBorder,
                {
                  width: realItemWidth + dp2px(2)
                }
              ]}
            ></View>
          </View>
        </View>
      </GestureDetector>
    );

    function getNest(scrollX?: number) {
      if (!scrollX) {
        return {
          offset: 0,
          index: 0
        };
      }
      const x = scrollX;
      if (x > 0) {
        return {
          offset: 0,
          index: 0
        };
      }

      let closestIndex = 0;
      let minDiff = Math.abs(scorllListRef.current[0].offset - x);
      for (let i = 1; i < scorllListRef.current.length; i++) {
        const currentDiff = Math.abs(scorllListRef.current[i].offset - x);
        if (currentDiff < minDiff) {
          closestIndex = i;
          minDiff = currentDiff;
        }
      }

      return scorllListRef.current[closestIndex];
    }

    function gotoDis(item: scorllListItem, animated = true) {
      if (!item) return;
      if (item.index === indexRef.current) {
        return;
      }

      const animateEffect = Easing.in(Easing.ease);
      const easeEffect = {
        duration: 300,
        easing: animateEffect
      };

      if (animated) {
        scrollX.value = withTiming(item.offset || 0, easeEffect);
      } else {
        scrollX.value = item.offset || 0;
      }

      lastScrollRef.current = scrollX.value;

      props.goto && props.goto(item.index);
      indexRef.current = item.index;
    }

    function gotoIndex(index: number, animated?: boolean) {
      gotoDis(scorllListRef.current[index], animated);
    }
  }
);

const st = StyleSheet.create({
  $wrap: {
    position: 'relative',
    overflow: 'scroll',
    zIndex: 9999
  },
  $thumbItem: {
    borderRadius: dp2px(8),
    marginRight: 4,
    overflow: 'hidden'
  },
  $borderWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    ...StyleSheet.rowStyle,
    justifyContent: 'center'
  },
  $selectBorder: {
    height: '100%',
    borderColor: '#FF6A3B',
    borderWidth: dp2px(2),
    borderRadius: dp2px(8)
  }
});
