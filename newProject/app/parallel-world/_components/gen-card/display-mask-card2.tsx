import { abstractActStoryText } from '.';
import { useMemoizedFn, useMount } from 'ahooks';
import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeOut,
  runOnJS,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import PreloadImg from '@/src/components/emoji/preload-img';
import { PreviewImage } from '@/src/components/previewImage';
import { colors, typography } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import {
  VIEWER_CARD_IMG_HEIGHT,
  getGenImgWidthByHeight
} from '../../_constants';
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

const MASK_MOUNT_DELAY = Platform.OS === 'ios' ? 0 : 1000;

const PARALLEL_WORLD_ENTRY_VIDEO = require('@Assets/mp4/parallel-world/entry.mp4');

interface DialogValue {
  value: ActDialog;
  index: number;
}
interface StoryValue {
  value: ActStory;
  index: number;
}

const getAllList = (act: WorldAct) => {
  const length = act.actItems.length;
  const allDialogList: DialogValue[] = [];
  const allStoryList: StoryValue[] = [];

  for (let i = 0; i < length; i++) {
    const actItem = act?.actItems[i].item;
    if (actItem.case === 'dialog') {
      const idx = allDialogList.length;
      allDialogList.push({ value: actItem.value, index: idx });
    }
    if (actItem.case === 'story') {
      const idx = allStoryList.length;
      allStoryList.push({ value: actItem.value, index: idx });
    }
  }

  return {
    allDialogList,
    allStoryList
  };
};

export interface DisplayMaskCardProps {
  acts: WorldAct[];
  activeIdx: number;
  onChange: (index: number) => void;
  showLoadVideo: boolean;
  onVideoPlayed?: () => void;
  videoText?: string;
  isBtnVisible?: boolean;
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
  isBtnVisible = true,
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

  // 全部的【dialog】列表
  const [allDialogList, setAllDialogList] = useState<DialogValue[]>([]);
  // 全部的【story】列表
  const [allStoryList, setAllStoryList] = useState<StoryValue[]>([]);

  // 流式展示的【dialog】列表
  const [dialogList, setDialogList] = useState<DialogValue[]>([]);

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

  // 用来控制一条一条的文本流式
  const [skipIndex, setSkipIndex] = useState(-1);

  // 初始化【story】&【dialog】列表
  const initAllActItemLists = (idx: number) => {
    const { allStoryList, allDialogList } = getAllList(acts[idx]);
    setAllStoryList(allStoryList);
    setAllDialogList(allDialogList);
    if (!allDialogList.length) {
      setPlayedList(list => [...list, idx]);
      setDialogList([]);
    } else {
      setDialogList([allDialogList[0]]);
    }
  };

  // 文本展示/收起样式
  const { $textStyle_a, $imgContainerStyle_a, $imgStyle_a } =
    useImgAnimatedStyle({ storyList: allStoryList, imgBasicHeight: imgHeight });

  // 图片切换
  const { images } = useMaskImageSwitch({ acts });

  const [isCardMounted, setIsCardMounted] = useState(false);

  // 处理每条story/dialog流逝结束
  const itemStreamFinish = useMemoizedFn((index: number) => {
    if (playedList?.includes(actIndex)) return;

    const nextIndex = index + 1;

    if (nextIndex < allDialogList.length) {
      setDialogList(list => [...list, allDialogList[nextIndex]]);
    }
    if (index === allDialogList.length - 1) {
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
        initAllActItemLists(idx);
        // 没有流式过的要清空，流式过的交给skip逻辑处理
        if (playedList.indexOf(idx) < 0) {
          setSkipIndex(-1);

          // setDialogList([]);
        }
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
      initAllActItemLists(idx);
      // 没有流式过的要清空，流式过的交给skip逻辑处理
      if (playedList.indexOf(idx) < 0) {
        setSkipIndex(-1);
        // setDialogList([]);
      }
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
        initAllActItemLists(idx);
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
      initAllActItemLists(idx);
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
      initAllActItemLists(actIndex);
      // 初始化时，如果不在第一幕，说明已经播放过
      if (actIndex > 0) {
        setPlayedList(list => [...list, actIndex]);
      }
    }
  }, [isVideoPlayed]);

  const $opacity = useSharedValue(1);

  useMount(() => {
    setTimeout(() => {
      setIsCardMounted(true);
    }, MASK_MOUNT_DELAY);
  });

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
        // setAllStoryList(allStoryList);
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
            {isCardMounted && (
              <Animated.View style={[cardStyles.$img, $imgStyle_a]}>
                <MaskImages
                  ref={maskImgRef}
                  sourceList={images}
                  onChange={setActIndex}
                  onLoaded={() => {
                    $opacity.value = withTiming(0, {
                      duration: 600,
                      easing: Easing.in(Easing.quad)
                    });
                  }}
                  active={actIndex}
                  size={{ width: imgWidth, height: imgHeight }}
                />
              </Animated.View>
            )}
            {/* {!isCardMounted && ( */}
            <Animated.View
              style={[
                {
                  position: 'absolute',
                  zIndex: 10,
                  transform: [{ scale: 1.1 }],
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                },
                { opacity: $opacity }
              ]}
            >
              <PreloadImg
                url={acts[activeIdx].image?.imageUrl ?? ''}
                size={{ width: '100%', height: '100%' }}
                contentFit="cover"
              />
            </Animated.View>
            {/* )} */}
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
                  {allStoryList.map((item, index) => (
                    <StoryStreamItem
                      key={item.value.text + index}
                      index={item.index}
                      story={item.value}
                      onFinish={() => {}}
                      // onFinish={itemStreamFinish}
                      // skip={item.index <= skipIndex}
                      skip={true}
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
      {isBtnVisible && isVideoPlayed && isCardMounted && (
        <>
          {actIndex > 0 && (
            <TouchableOpacity
              style={[
                {
                  left: 10
                },
                btnStyles.$btn
              ]}
              // onPress={handlePrev}
              onPress={() => {
                handleSwipePrev();
                reportClick('content_page', {
                  interactive_behavior: '4',
                  content_state: playedList.indexOf(actIndex) < 0 ? 2 : 1
                });
              }}
            >
              <Image style={btnStyles.$icon} source={BTN_PREV} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              {
                right: 10
              },
              btnStyles.$btn
            ]}
            // onPress={handleNext}
            onPress={() => {
              handleSwipeNext();
              reportClick('content_page', {
                interactive_behavior: '4',
                content_state: playedList.indexOf(actIndex) < 0 ? 2 : 1
              });
            }}
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
  $btn: {
    position: 'absolute',
    top: VIEWER_CARD_IMG_HEIGHT,
    width: 40,
    height: 40
  },
  $icon: { width: '100%', height: '100%' }
});

const getDialogPosition = (index: number): StyleProp<ViewStyle> => {
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
