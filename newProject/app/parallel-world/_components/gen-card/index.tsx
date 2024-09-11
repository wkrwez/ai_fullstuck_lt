import { useMemoizedFn } from 'ahooks';
import { ResizeMode, Video } from 'expo-av';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp, // Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Image, Text } from '@/src/components';
import { Icon } from '@/src/components';
import { useImgPreview } from '@/src/components/emoji/_hooks/img-preview.hook';
import PreloadImg from '@/src/components/emoji/preload-img';
import { colors } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import {
  PW_PURE_BG_VIDEO,
  getGenImgWidthByHeight,
  parallelWorldColors
} from '../../_constants';
import LoadingImg from '../others/loading-img';
import {
  ActItem,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import ChangeImgButton from './change-img-button';
import CharacterCountdown from './character-countdown';
import { DialogValue, StoryValue } from './display-card';
import { getDialogPosition } from './display-mask-card';
import { DialogStreamItem, StoryStreamItem } from './stream-text-item';

export const abstractActStoryText = (actItems: ActItem[]) => {
  let stories = '';
  let length = actItems.length;
  for (let i = 0; i < length; i++) {
    const item = actItems[i].item;

    if (item.case === 'story') {
      stories += item.value.text + (i === length - 1 ? '' : '\n');
    }
  }
  return stories;
};

export const renderAllActItems = (actItems: ActItem[]) => {
  return (
    <View style={{ minHeight: 100 }}>
      {actItems.map(item => {
        return (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontWeight: '600',
              color:
                item.item.case === 'dialog'
                  ? parallelWorldColors.fontGlow
                  : 'black'
            }}
          >
            {item.item?.value?.text as string}
          </Text>
        );
      })}
    </View>
  );
};

export const getAllActItemsText = (actItems: ActItem[], join: string = '') => {
  return actItems.map(item => item.item?.value?.text as string).join(join);
};

export interface GenCardProps {
  act: WorldAct | null;
  imgHeight: number;
  isEdit?: boolean;
  isInView: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onStreamFinish?: (act: WorldAct | null) => void;
  textStyle?: StyleProp<TextStyle>;
  textNode?: ReactNode;
  onTextEdit?: (act: WorldAct | null) => void;
  onImgRegenerate?: (act: WorldAct | null) => void;
}

export default function GenCard({
  act,
  isEdit = false,
  isInView,
  imgHeight = 400,
  containerStyle: $containerStyle = {},
  textStyle: $textStyle = {},
  onTextEdit,
  onImgRegenerate,
  onStreamFinish
}: GenCardProps) {
  const imgWidth = getGenImgWidthByHeight(imgHeight);

  const storyText = act?.actItems ? abstractActStoryText(act?.actItems) : '';

  // 是否被查看过
  const isViewed = useRef(false);

  // 展示数据
  const [dialogList, setDialogList] = useState<DialogValue[]>([]);
  const [storyList, setStoryList] = useState<StoryValue[]>([]);

  const [isStreamFinish, setIsStreamFinish] = useState<boolean>(false);

  const [skipIndex, setSkipIndex] = useState(-1);

  const [isCountdownStart, setIsCountdownStart] = useState(false);

  const imgDynamicHeight =
    !storyText.length && !isEdit ? imgHeight + 130 : imgHeight;

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
    if (isStreamFinish) return;

    // const act = acts[actIndex];
    const actItemsLength = (act?.actItems ?? []).length ?? 0;
    // if (playedList?.includes(actIndex)) return;

    const nextIndex = index + 1;

    if (nextIndex < actItemsLength) {
      appendActItem(nextIndex, act?.actItems ?? []);
    }
    if (index === actItemsLength - 1) {
      // setPlayedList(list => [...list, actIndex]);
      setIsStreamFinish(true);
    }

    setSkipIndex(nextIndex - 1);
  });

  // 处理整篇跳过的逻辑
  useEffect(() => {
    if (isStreamFinish) {
      const length = act?.actItems?.length ?? 0;

      setSkipIndex(length);

      const allDialogList: DialogValue[] = [];
      const allStoryList: StoryValue[] = [];
      for (let i = 0; i < length; i++) {
        const actItem = act?.actItems[i].item;
        if (actItem?.case === 'dialog') {
          allDialogList.push({ value: actItem.value, index: i });
        }
        if (actItem?.case === 'story') {
          allStoryList.push({ value: actItem.value, index: i });
        }

        setDialogList(allDialogList);
        setStoryList(allStoryList);

        if (onStreamFinish) onStreamFinish(act);
      }
    }
  }, [isStreamFinish, isEdit]);

  useEffect(() => {
    if (act?.image?.imageUrl && !isStreamFinish) {
      setIsStreamFinish(true);
      if (onStreamFinish) onStreamFinish(act);
    }
  }, [act]);

  useEffect(() => {
    if (isInView) {
      if (!isViewed?.current) {
        isViewed.current = true;

        if (!act?.image?.imageUrl) {
          // 添加第一个节点
          appendActItem(0, act?.actItems ?? []);
          // 开始倒计时
          setIsCountdownStart(true);
        }
      } else {
        // 再次预览时直接显示全部内容
        // const length = act?.actItems?.length ?? 0;
        // // setSkipIndex(length);
        setIsStreamFinish(true);
      }
    }
  }, [isInView]);

  return (
    <View style={[cardStyles.$container, $containerStyle]}>
      <View style={imgStyles.$container}>
        <View
          style={[
            {
              width: imgWidth + 20
            },
            imgStyles.$changeImg
          ]}
        >
          {isEdit && (
            <ChangeImgButton
              title="换一张"
              onImgRegenerate={() => {
                onImgRegenerate && onImgRegenerate(act);
                reportClick('world_editing', {
                  world_editing_button: 2
                });
              }}
            />
          )}
        </View>
        <LoadingImg
          url={act?.image?.imageUrl ?? ''}
          isLoading={!act?.image?.imageUrl}
          style={imgStyles.$box}
          size={{
            height: imgDynamicHeight,
            width: imgWidth
          }}
        />
        <View
          style={[
            dialogStyles.$container,
            dialogList.length > 1
              ? {
                  width: imgWidth + 20,
                  left: 0
                }
              : {
                  width: imgWidth - 20
                },
            {
              opacity: act?.image?.imageUrl ? 1 : 0
            }
          ]}
        >
          {!isEdit &&
            dialogList &&
            dialogList.map((item, index) => (
              <DialogStreamItem
                key={item.value.text + index}
                index={item.index}
                dialog={item.value}
                onFinish={itemStreamFinish}
                skip={true}
                start={true}
                dialogStyle={[
                  { maxWidth: 240, gap: 4 },
                  getDialogPosition(index)
                ]}
              />
            ))}
        </View>
        {!act?.image?.imageUrl && isCountdownStart && <CharacterCountdown />}
      </View>

      {isEdit ? (
        <Pressable
          onPress={() => {
            isEdit && onTextEdit && onTextEdit(act);
          }}
          style={[
            {
              width: imgWidth
            },
            storyStyles.$container
          ]}
        >
          <ScrollView style={{ height: 100 }}>
            {renderAllActItems(act?.actItems || [])}
          </ScrollView>
          {isEdit && (
            <View style={{ alignItems: 'flex-end', paddingBottom: 4 }}>
              <Icon icon="icon_edit_pw_dark" size={16}></Icon>
            </View>
          )}
        </Pressable>
      ) : (
        <View
          style={
            storyText.length === 0
              ? {
                  height: 10,
                  overflow: 'hidden'
                }
              : {}
          }
        >
          <View
            style={[
              {
                width: imgWidth
              },
              storyStyles.$container
            ]}
          >
            <ScrollView style={{ height: 100 }}>
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
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const cardStyles = createStyle({
  $container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    height: 'auto'
  }
});

const imgStyles = createStyle({
  $container: {
    padding: 10,
    paddingBottom: 0,
    position: 'relative'
  },
  $box: {
    borderWidth: 2,
    position: 'relative',
    borderColor: colors.black
  },
  $changeImg: {
    position: 'absolute',
    zIndex: 1,
    alignItems: 'center',
    bottom: 24
  },
  $imgBasic: { height: '100%', width: '100%' },
  $imgPreviewBox: {
    position: 'absolute',
    zIndex: 10
  },
  $loading: {
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
});

const dialogStyles = createStyle({
  $container: {
    position: 'absolute',
    alignItems: 'center',
    gap: 16,
    bottom: 40
  }
});

const storyStyles = createStyle({
  $container: {
    margin: 10,
    borderWidth: 2,
    borderColor: colors.black,
    // width: imgWidth,
    paddingVertical: 8,
    paddingHorizontal: 12
  }
});
