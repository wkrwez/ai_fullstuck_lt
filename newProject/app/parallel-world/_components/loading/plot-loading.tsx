import { ResizeMode, Video } from 'expo-av';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { AnimatedImage } from '@/src/components/animatedImage';
import { selectState } from '@/src/store/_utils';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { typography } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import {
  PW_LOADING_VIDEO,
  VIEWER_CARD_IMG_HEIGHT,
  getGenImgWidthByHeight
} from '../../_constants';
import InfoCard from '../info-card';
import { useShallow } from 'zustand/react/shallow';

const { width } = Dimensions.get('window');

const imgStyle = {
  height: 320,
  width: 240,
  overflow: 'hidden'
};

const loadingBgImgStyle: StyleProp<ViewStyle> & typeof imgStyle = {
  ...imgStyle,
  position: 'absolute',
  zIndex: -1,
  top: 100,
  backgroundColor: 'transparent',
  opacity: 0.5
};

const L7 = require('@Assets/apng/l7.png');

export default function PlotContentLoading() {
  const {
    plotContent,
    // toggleIsPlotContentPlaying,
    // actsBuffer,
    acts,
    newWorld,
    clearPlotContent
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'plotContent',
        'clearPlotContent',
        // 'toggleIsPlotContentPlaying',
        'acts',
        // 'actsBuffer',
        'newWorld'
      ])
    )
  );

  const textWidth = getGenImgWidthByHeight(VIEWER_CARD_IMG_HEIGHT) - 4;

  const [actContentList, setActContentList] = useState<string[]>(['']);
  const [images, setCurrentImages] = useState([]);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1.2);
  const ptrRef = useRef<number>(0);

  const textBuffer = useRef<string>('');

  textBuffer.current = plotContent;

  const intervalRef = useRef<number>();

  useEffect(() => {
    if (intervalRef.current) {
      return;
    }

    const interval = 100; // 设定时间间隔为 100ms
    let lastTime = performance.now();

    const step = (currentTime: number) => {
      intervalRef.current = requestAnimationFrame(step);

      if (currentTime - lastTime >= interval) {
        const char = textBuffer.current[ptrRef.current];
        lastTime = currentTime;

        if (char) {
          if (char === '\n') {
            setActContentList(list => [...list, '']);
          } else {
            setActContentList(list => {
              const newList = [...list];
              newList[newList.length - 1] += char;
              return newList;
            });
          }

          ptrRef.current++;
        } else {
          if (
            useParallelWorldConsumerStore.getState().plotCreateStatus ===
            PLOT_CREATE_STATUS_ENUM.CREATED
          ) {
            // setTimeout(() => {
            //   toggleIsPlotContentPlaying(false);
            // }, 1000);

            cancelAnimationFrame(intervalRef.current as number);
            return;
          }
        }
      }
    };

    intervalRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(intervalRef.current as number);
    };
  }, []);

  const carouselRef = useRef<ICarouselInstance>(null);

  useEffect(() => {
    const result = acts
      .slice(-3)
      .map(item => item?.image?.imageUrl)
      .filter(i => i);
    if (!result.length) return;
    // @ts-ignore
    setCurrentImages(result);
  }, [acts]);

  useEffect(() => {
    setShakeAnimation();
    reportExpo('world_loading');
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd();
      setTimeout(() => {
        carouselRef.current?.next();
      });
    }
  }, [actContentList?.length]);

  useEffect(() => {
    return () => {
      clearPlotContent();
    };
  }, []);

  const scrollRef = useRef<ScrollView>(null);

  const $animateStyle1 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value * 0.5
      },
      {
        translateY: translateY.value * 0.5
      },
      {
        scale: scale.value
      }
    ]
  }));

  const $animateStyle2 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: 0 - translateX.value * 0.5
      },
      {
        translateY: 0 - translateY.value * 0.5
      },
      {
        scale: scale.value
      }
    ]
  }));

  const $animateStyle3 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateY.value
      },
      {
        translateY: 0 - translateX.value
      },
      {
        scale: scale.value
      }
    ]
  }));

  return (
    <View style={loadingStyles.$container}>
      <View
        style={{
          display: 'flex',
          position: 'relative',
          top: 10,
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            fontWeight: '400',
            fontSize: 14,
            color: StyleSheet.currentColors.white,
            fontFamily: typography.fonts.world
          }}
        >
          你正在创建第
          <Text
            style={{
              fontWeight: '400',
              fontSize: 18,
              color: StyleSheet.currentColors.blue,
              fontFamily: typography.fonts.world
            }}
          >
            {newWorld?.worldNum}号
          </Text>
          平行世界，故事开始书写...
        </Text>
      </View>
      <View
        style={{ height: VIEWER_CARD_IMG_HEIGHT + 10, position: 'relative' }}
      >
        <View
          style={{
            ...(loadingBgImgStyle as object),
            transform: [{ rotate: '-12deg' }, { scale: 0.85 }],
            left: -loadingBgImgStyle.width / 2
          }}
        >
          <Video
            source={PW_LOADING_VIDEO}
            style={{ width: '100%', height: '100%' }}
            // useNativeControls
            shouldPlay
            isLooping
            resizeMode={ResizeMode.CONTAIN}
          />
          {images[1] ? (
            <Animated.View style={[StyleSheet.absoluteFill, $animateStyle1]}>
              <Image
                source={images[1]}
                tosSize="size2"
                style={{ width: '100%', height: '100%', opacity: 0.8 }}
              />
            </Animated.View>
          ) : null}
        </View>
        <View
          style={{
            ...(loadingBgImgStyle as object),
            transform: [{ rotate: '12deg' }, { scale: 0.85 }],
            right: -loadingBgImgStyle.width / 2
          }}
        >
          <Video
            source={PW_LOADING_VIDEO}
            style={{ width: '100%', height: '100%' }}
            // useNativeControls
            shouldPlay
            isLooping
            resizeMode={ResizeMode.CONTAIN}
          />
          {images[2] ? (
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0.8
                },
                $animateStyle2
              ]}
            >
              <Image
                source={images[2]}
                tosSize="size2"
                style={{ width: '100%', height: '100%' }}
              />
            </Animated.View>
          ) : null}
        </View>

        <View
          style={{
            height: '100%',
            alignItems: 'center',
            // borderWidth: 1,
            justifyContent: 'center'
          }}
        >
          <View
            style={{
              ...imgStyle,
              position: 'relative'
            }}
          >
            <Video
              source={PW_LOADING_VIDEO}
              style={{ width: '100%', height: '100%' }}
              // useNativeControls
              shouldPlay
              isLooping
              resizeMode={ResizeMode.CONTAIN}
            />
            {images[0] ? (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.9
                  },
                  $animateStyle3
                ]}
              >
                <Image
                  source={images[0]}
                  tosSize="size2"
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            ) : null}
          </View>
        </View>
      </View>
      <ScrollView
        ref={scrollRef}
        style={{ width: textWidth + 24 }}
        horizontal
        scrollEnabled={false}
      >
        {actContentList.map((content, idx) => (
          <InfoCard
            isBgPicVisible={false}
            cardStyle={{
              // borderWidth: 1,
              height: 136,
              backgroundColor: 'white'
            }}
            key={idx}
          >
            <View
              style={{
                width: textWidth,
                paddingVertical: 4,
                paddingHorizontal: 8,
                overflow: 'hidden'
              }}
            >
              <Text
                style={[
                  {
                    lineHeight: 20,
                    height: 100,
                    fontSize: 14,
                    fontWeight: '600'
                  }
                ]}
                numberOfLines={5}
              >
                {content}
              </Text>
            </View>
          </InfoCard>
        ))}
      </ScrollView>

      <AnimatedImage
        source={L7}
        duration={2000}
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            width: width,
            height: '100%',
            zIndex: 9999
          }
        ]}
      ></AnimatedImage>
    </View>
  );

  function setShakeAnimation() {
    translateX.value = withRepeat(
      withTiming(-20, { duration: 3000 }),
      -1,
      true
    );
    translateY.value = withRepeat(
      withTiming(-20, { duration: 5000 }),
      -1,
      true
    );
  }
}

const loadingStyles = createStyle({
  $container: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 60,
    zIndex: 1000
  },
  $box: {
    backgroundColor: 'white',
    // height: '100%',
    padding: 12
  }
});
