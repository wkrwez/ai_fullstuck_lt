import { abstractActStoryText } from '.';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '@/src/theme';
import { Image } from '@Components/image';
import { getGenImgWidthByHeight } from '../../_constants';
import {
  ActDialog,
  ActStory,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { DialogStreamItem, StoryStreamItem } from './stream-text-item';

export interface DialogValue {
  value: ActDialog;
  index: number;
}
export interface StoryValue {
  value: ActStory;
  index: number;
}

export interface DisplayCardProps {
  act?: WorldAct;
  isPlay: boolean;
  isSkip?: boolean;
  onFinished: (idx: number) => void;
  cardIndex?: number;
  // onTap?: (isFinished: boolean, index: number) => void;
  imgHeight: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textNode?: ReactNode;
}

export default function DisplayCard({
  act,
  imgHeight = 300,
  onFinished,
  containerStyle: $containerStyle = {},
  textStyle: $textStyle = {},
  textNode,
  isPlay = false,
  isSkip: isCardSkip = false,
  cardIndex = -1
  // onTap
}: DisplayCardProps) {
  const imgWidth = getGenImgWidthByHeight(imgHeight);

  const [dialogList, setDialogList] = useState<DialogValue[]>([]);
  const [storyList, setStoryList] = useState<StoryValue[]>([]);
  const [renderIndex, setRenderIndex] = useState(0);

  const displayStory = act?.actItems ? abstractActStoryText(act?.actItems) : '';

  // 可以用来控制一条一条的文本流式
  const [skipIndex, setSkipIndex] = useState(-1);

  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const handleItemStreamFinish = (index: number) => {
    renderIndex < (act?.actItems ?? []).length && setRenderIndex(index + 1);

    if (index === (act?.actItems?.length as number) - 1) {
      onFinished(cardIndex);
    }
  };

  // 处理图片轮播逻辑
  useEffect(() => {
    if (act?.actItems?.length && renderIndex < act?.actItems.length) {
      const actItem = act?.actItems[renderIndex].item;
      if (actItem.case === 'dialog') {
        setDialogList([
          ...dialogList,
          { value: actItem.value, index: renderIndex }
        ]);
      }
      if (actItem.case === 'story') {
        setStoryList([
          ...storyList,
          { value: actItem.value, index: renderIndex }
        ]);
      }
    }
    setSkipIndex(renderIndex - 1);

    // console.log(1234, act?.image?.imageUrl);
  }, [renderIndex]);

  // 处理整片跳过的逻辑
  useEffect(() => {
    if (isCardSkip && act?.actItems?.length) {
      setRenderIndex(act.actItems.length);

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
        // setIsFinished(true);
        onFinished(cardIndex);
      }
    }
  }, [isCardSkip]);

  return (
    <View
      style={[
        {
          backgroundColor: colors.white,
          alignItems: 'center'
        },
        $containerStyle
      ]}
    >
      <View
        style={{
          padding: 10,
          paddingBottom: 0,
          position: 'relative'
        }}
      >
        <Image
          source={{ uri: act?.image?.imageUrl }}
          // resizeMode="cover"
          style={{
            borderWidth: 2,
            borderColor: colors.black,
            width: imgWidth,
            height: !displayStory.length ? imgHeight + 130 : imgHeight
          }}
          onLoad={() => {
            setIsImgLoaded(true);
          }}
        />
        {!isImgLoaded && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={{ position: 'absolute', top: 10, left: 10 }}
          >
            <Image
              source={{ uri: act?.image?.imageUrl }}
              tosSize="size10"
              style={{
                position: 'absolute',
                borderWidth: 2,
                borderColor: colors.black,
                width: imgWidth,
                height: !displayStory.length ? imgHeight + 130 : imgHeight
              }}
            />
          </Animated.View>
        )}
        <View
          style={[
            {
              position: 'absolute',
              alignItems: 'center',
              gap: 16,
              bottom: 20,
              width: imgWidth + 20,
              left: 0
            }
          ]}
        >
          {dialogList.map((item, index) => (
            <DialogStreamItem
              key={item.index}
              index={item.index}
              dialog={item.value}
              onFinish={handleItemStreamFinish}
              skip={item.index <= skipIndex}
              start={isPlay}
              dialogStyle={[
                {
                  maxWidth: 240,
                  gap: 4
                },
                index % 2 === 0
                  ? {
                      alignItems: 'flex-start',
                      alignSelf: 'flex-start',
                      marginLeft: -5
                    }
                  : {
                      alignItems: 'flex-end',
                      alignSelf: 'flex-end',
                      marginRight: -5
                    }
              ]}
            />
          ))}
        </View>
      </View>

      <View
        style={
          displayStory.length === 0
            ? {
                height: 10,
                overflow: 'hidden'
              }
            : {}
        }
      >
        <View
          style={{
            margin: 10,
            borderWidth: 2,
            borderColor: colors.black,
            width: imgWidth,
            paddingVertical: 8,
            paddingHorizontal: 12
          }}
        >
          <ScrollView style={{ height: 100 }}>
            <View
              style={{
                minHeight: 100,
                justifyContent: 'center'
              }}
            >
              {textNode ||
                storyList.map(item => (
                  <StoryStreamItem
                    key={item.index}
                    index={item.index}
                    story={item.value}
                    onFinish={handleItemStreamFinish}
                    skip={item.index <= skipIndex}
                    start={isPlay}
                    textStyle={[
                      $textStyle,
                      {
                        fontSize: displayStory.length > 60 ? 13 : 14
                      }
                    ]}
                  ></StoryStreamItem>
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
