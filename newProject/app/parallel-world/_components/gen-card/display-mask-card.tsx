import { abstractActStoryText } from '.';
import { useMemoizedFn } from 'ahooks';
import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeOut } from 'react-native-reanimated';
import { colors, typography } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { Image } from '@Components/image';
import { getGenImgWidthByHeight } from '../../_constants';
import { AnimationDir, MaskImages, MaskImagesRef } from '../mask-images';
import {
  ActDialog,
  ActItem,
  ActStory,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import {
  useDisplayMaskCardGesture,
  useDisplayMaskCardVideoInit,
  useImgAnimatedStyle,
  useMaskImageSwitch
} from './display-mask-card.hook';
import { DialogStreamItem, StoryStreamItem } from './stream-text-item';

const BTN_PREV = require('@Assets/image/parallel-world/btn-prev.png');
const BTN_NEXT = require('@Assets/image/parallel-world/btn-next.png');

const nextAnimations = [AnimationDir.right, AnimationDir.bottom];
const prevAnimations = [AnimationDir.top, AnimationDir.left];

// export const getGenImgHeightByWidth = (imgWidth: number) => (imgWidth / 2) * 3;

const PARALLEL_WORLD_ENTRY_VIDEO = require('@Assets/mp4/parallel-world/entry.mp4');

interface DialogValue {
  value: ActDialog;
  index: number;
}
interface StoryValue {
  value: ActStory;
  index: number;
}

export interface DisplayMaskCardProps {
  acts: WorldAct[];
  activeIdx: number;
  onChange: (index: number) => void;
  showLoadVideo: boolean;
  onVideoPlayed?: () => void;
  videoText?: string;
  imgHeight: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onExceed?: () => void;
}

export default function DisplayMaskCard({
  acts,
  activeIdx,
  imgHeight = 300,
  onChange,
  showLoadVideo,
  onVideoPlayed,
  videoText = '',
  containerStyle: $containerStyle = {},
  textStyle: $textStyle = {},
  onExceed
}: DisplayMaskCardProps) {
  // 计算照片宽带
  const imgWidth = getGenImgWidthByHeight(imgHeight);

  // 当前actIndex，变更逻辑交给MaskImages控制
  const [actIndex, setActIndex] = useState<number>(activeIdx);

  // 记录那些act是已经播放过的
  const [playedList, setPlayedList] = useState<number[]>([]);

  // 展示数据
  const [dialogList, setDialogList] = useState<DialogValue[]>([]);
  const [storyList, setStoryList] = useState<StoryValue[]>([]);

  // 总的story文本数
  const storyText = useMemo(
    () =>
      acts[actIndex]?.actItems?.length > 0
        ? abstractActStoryText(acts[actIndex]?.actItems)
        : '',
    [acts[actIndex]?.actItems]
  );

  // 初始化视频播放
  const { isVideoPlayed, $videoTextStyle_a } = useDisplayMaskCardVideoInit({
    showVideo: showLoadVideo,
    onVideoPlayed
  });

  // 文本展示/收起样式
  const { $textStyle_a, $imgContainerStyle_a, $imgStyle_a } =
    useImgAnimatedStyle({ storyList, imgBasicHeight: imgHeight });

  // 用来控制一条一条的文本流式
  const [skipIndex, setSkipIndex] = useState(-1);

  // 图片切换
  const {
    // currentSource, prefetchSource, swipeDir,
    // switchImg,
    images
  } = useMaskImageSwitch({ acts });

  // 添加流逝的actItem
  const appendActItem = useMemoizedFn((idx: number, actItems: ActItem[]) => {
    const actItem = actItems[idx]?.item;

    if (actItem.case === 'dialog') {
      setDialogList(dialogs => {
        return [...dialogs, { value: actItem.value, index: idx }];
      });
    }
    if (actItem.case === 'story') {
      setStoryList(stories => [
        ...stories,
        { value: actItem.value, index: idx }
      ]);
    }
  });

  // 处理每条story/dialog流逝结束
  const itemStreamFinish = useMemoizedFn((index: number) => {
    if (playedList?.includes(actIndex)) return;

    const act = acts[actIndex];
    const actItemsLength = (act?.actItems ?? []).length ?? 0;

    const nextIndex = index + 1;

    if (nextIndex < actItemsLength) {
      appendActItem(nextIndex, act?.actItems ?? []);
    }
    if (index === actItemsLength - 1) {
      setPlayedList(list => [...list, actIndex]);
    }

    setSkipIndex(nextIndex - 1);
  });

  const maskImgRef = useRef<MaskImagesRef>(null);

  // 下一条
  const handleNext = useMemoizedFn(() => {
    if (!isVideoPlayed) return;
    // 未播放完成先跳过
    if (playedList.indexOf(actIndex) < 0) {
      setPlayedList(list => [...list, actIndex]);
    } else {
      const idx = actIndex + 1;

      if (idx < acts.length) {
        // setActIndex(idx);
        maskImgRef.current?.next();
        // 没有流式过的要清空，流式过的交给skip逻辑处理
        if (playedList.indexOf(idx) < 0) {
          setSkipIndex(-1);
          setDialogList([]);
          setStoryList([]);
          appendActItem(0, acts[idx]?.actItems ?? []);
        }
        // switchImg(idx, dir || nextAnimations[actIndex % 2]);
      } else {
        onExceed && onExceed();
      }
      Haptics.impactAsync();
    }
  });

  // 滑动到下一条
  const handleSwipeNext = useMemoizedFn(() => {
    console.log('handleSwipeNext!!!!!!!!!!!!!!');
    // 未播放完成先跳过
    if (playedList.indexOf(actIndex) < 0) {
      setPlayedList(list => [...list, actIndex]);
    }

    const idx = actIndex + 1;

    if (idx < acts.length) {
      // setActIndex(idx);
      maskImgRef.current?.next();
      // 没有流式过的要清空，流式过的交给skip逻辑处理
      if (playedList.indexOf(idx) < 0) {
        setSkipIndex(-1);
        setDialogList([]);
        setStoryList([]);
        appendActItem(0, acts[idx]?.actItems ?? []);
      }
      // switchImg(idx, dir || nextAnimations[actIndex % 2]);
    } else {
      onExceed && onExceed();
    }
    Haptics.impactAsync();
  });

  // 上一条
  const handlePrev = useMemoizedFn(() => {
    // 未播放完成先跳过
    if (playedList.indexOf(actIndex) < 0) {
      setPlayedList(list => [...list, actIndex]);
    } else {
      const idx = actIndex - 1;

      if (idx >= 0) {
        // setActIndex(idx);
        maskImgRef.current?.prev();
        // 往回翻页默认跳过上一个act的播放
        if (playedList.indexOf(idx) < 0) {
          setPlayedList(list => [...list, idx]);
        }
      }
      Haptics.impactAsync();
    }
  });

  // 滑动到上一条
  const handleSwipePrev = useMemoizedFn(() => {
    if (playedList.indexOf(actIndex) < 0) {
      setPlayedList(list => [...list, actIndex]);
    }
    const idx = actIndex - 1;

    if (idx >= 0) {
      // setActIndex(idx);
      maskImgRef.current?.prev();
      // 往回翻页默认跳过上一个act的播放
      if (playedList.indexOf(idx) < 0) {
        setPlayedList(list => [...list, idx]);
      }
    }
    Haptics.impactAsync();
  });

  // 手势处理
  const { composed } = useDisplayMaskCardGesture({
    next: handleNext,
    swipeNext: handleSwipeNext,
    prev: handlePrev,
    swipePrev: handleSwipePrev,
    width: imgWidth
  });

  // 更新actIndex
  useEffect(() => {
    if (onChange) onChange(actIndex);
  }, [actIndex]);

  // 初始化第一条流式
  useEffect(() => {
    if (acts[actIndex]?.actItems?.length && isVideoPlayed) {
      appendActItem(0, acts[actIndex].actItems ?? []);
    }
  }, [isVideoPlayed]);

  // 处理整篇跳过的逻辑
  useEffect(() => {
    const act = acts[actIndex];
    if (playedList.includes(actIndex) && act?.actItems?.length) {
      setSkipIndex(act?.actItems?.length);

      const length = act.actItems.length;
      const allDialogList: DialogValue[] = [];
      const allStoryList: StoryValue[] = [];
      for (let i = 0; i < length; i++) {
        const actItem = act?.actItems[i].item;
        if (actItem.case === 'dialog') {
          allDialogList.push({ value: actItem.value, index: i });
        }
        if (actItem.case === 'story') {
          allStoryList.push({ value: actItem.value, index: i });
        }
        setDialogList(allDialogList);
        setStoryList(allStoryList);
      }
    }
  }, [playedList.join(''), actIndex]);

  return (
    <>
      <GestureDetector gesture={composed}>
        <View style={[cardStyles.$container, $containerStyle]}>
          <Animated.View
            style={[
              cardStyles.$imageContainerBasic,
              {
                width: imgWidth - 4,
                height: imgHeight - 4
              },
              $imgContainerStyle_a
            ]}
          >
            <Animated.View style={[cardStyles.$img, $imgStyle_a]}>
              <MaskImages
                ref={maskImgRef}
                sourceList={images}
                onChange={setActIndex}
                active={actIndex}
                size={{ width: imgWidth, height: imgHeight }}
              />
            </Animated.View>
          </Animated.View>

          {showLoadVideo && (
            <Animated.View
              exiting={FadeOut.duration(500)}
              style={videoStyles.$container}
            >
              <Video
                source={PARALLEL_WORLD_ENTRY_VIDEO}
                style={videoStyles.$video}
                shouldPlay
                resizeMode={ResizeMode.COVER}
              />
              <Animated.View
                style={[
                  [
                    videoStyles.$textBox,
                    {
                      top: imgHeight / 2
                    },
                    $videoTextStyle_a
                  ]
                ]}
              >
                <Text style={videoStyles.$text}>{videoText}</Text>
              </Animated.View>
            </Animated.View>
          )}

          <View
            style={[
              cardStyles.$dialogContainerBasic,
              {
                width: imgWidth + 20
              }
            ]}
          >
            {dialogList.map((item, index) => (
              <DialogStreamItem
                key={item.value.text + index}
                index={item.index}
                dialog={item.value}
                onFinish={itemStreamFinish}
                skip={item.index <= skipIndex}
                start={true}
                dialogStyle={[
                  cardStyles.$dialogBasic,
                  getDialogPosition(index)
                ]}
              />
            ))}
          </View>

          <Animated.View style={[cardStyles.$textContainerBasic, $textStyle_a]}>
            <View
              style={[
                {
                  width: imgWidth - 4
                },
                cardStyles.$textBox
              ]}
            >
              <ScrollView style={{ height: 100 }}>
                <View style={cardStyles.$text}>
                  {storyList.map((item, index) => (
                    <StoryStreamItem
                      key={item.value.text + index}
                      index={item.index}
                      story={item.value}
                      onFinish={itemStreamFinish}
                      skip={item.index <= skipIndex}
                      start={true}
                      textStyle={[
                        {
                          fontSize: storyText.length > 60 ? 13 : 14
                        },
                        $textStyle
                      ]}
                    ></StoryStreamItem>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
      {isVideoPlayed && (
        <>
          <TouchableOpacity
            style={[
              {
                left: 10
              },
              btnStyles.$btn
            ]}
            onPress={handlePrev}
          >
            <Image style={btnStyles.$icon} source={BTN_PREV} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                right: 10
              },
              btnStyles.$btn
            ]}
            onPress={handleNext}
          >
            <Image style={btnStyles.$icon} source={BTN_NEXT} />
          </TouchableOpacity>
        </>
      )}
    </>
  );
}

const cardStyles = createStyle({
  $container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 10
  },
  $imageContainerBasic: {
    borderWidth: 2,
    paddingBottom: 0,
    borderColor: 'black',
    position: 'relative',
    overflow: 'hidden'
  },
  $img: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  $dialogContainerBasic: {
    position: 'absolute',
    alignItems: 'center',
    gap: 16,
    bottom: 140 + 30
  },
  $dialogBasic: {
    maxWidth: 240,
    gap: 4
  },
  $textContainerBasic: { alignItems: 'stretch', overflow: 'hidden' },
  $textBox: {
    margin: 10,
    borderWidth: 2,
    borderColor: colors.black,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  $text: {
    minHeight: 100,
    justifyContent: 'center'
  }
});

const videoStyles = createStyle({
  $container: {
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    position: 'absolute',
    zIndex: 10
  },
  $video: { width: '100%', height: '100%' },
  $textBox: {
    position: 'absolute',
    with: '100%',
    left: 0,
    right: 0,
    zIndex: 100
  },
  $text: {
    textAlign: 'center',
    fontFamily: typography.fonts.world,
    color: 'white'
  }
});

const btnStyles = createStyle({
  $btn: { position: 'absolute', top: '50%', width: 40, height: 40 },
  $icon: { width: '100%', height: '100%' }
});

export const getDialogPosition = (index: number): StyleProp<ViewStyle> => {
  return index % 2 === 0
    ? {
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginLeft: -5
      }
    : {
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        marginRight: -5
      };
};
