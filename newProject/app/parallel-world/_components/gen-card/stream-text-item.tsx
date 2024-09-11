import { useMemoizedFn } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from '@/src/components';
import { useStaticStreamText } from '../../_hooks/static-stream-text.hook';
import {
  ActDialog,
  ActStory
} from '@/proto-registry/src/web/raccoon/world/common_pb';

interface StreamTextPros {
  index: number;
  skip: boolean;
  start: boolean;
  onFinish: (index: number) => void;
  textStyle?: StyleProp<TextStyle>;
}

export function StoryStreamItem({
  story,
  index,
  onFinish,
  skip,
  start,
  textStyle: $textStyle = {}
}: { story: ActStory } & StreamTextPros) {
  const isFinish = useRef(false);

  const handleFinish = useMemoizedFn(() => {
    console.log('handleFinish------>', index, isFinish.current, skip);

    if (isFinish.current) {
      return;
    } else {
      isFinish.current = true;
      onFinish(index);
    }
  });

  const { streamText } = useStaticStreamText({
    skip,
    start,
    text: story.text,
    onFinish: handleFinish
  });

  return (
    <Text
      style={[{ fontSize: 14, lineHeight: 20, fontWeight: '600' }, $textStyle]}
    >
      {streamText}
    </Text>
  );
}

export const Dialog = ({
  text,
  dialogStyle
}: {
  text: string;
  dialogStyle?: StyleProp<ViewStyle>;
}) =>
  !text ? null : (
    <View
      style={[
        {
          paddingVertical: 10,
          paddingHorizontal: 8,
          backgroundColor: 'rgba(23, 30, 38, 0.90)',
          borderRadius: 10
        },
        dialogStyle
      ]}
    >
      <Text style={{ color: 'white' }}>{text}</Text>
    </View>
  );

export function DialogStreamItem({
  dialog,
  index,
  onFinish,
  skip,
  start,
  dialogStyle
}: { dialog: ActDialog; dialogStyle?: StyleProp<ViewStyle> } & StreamTextPros) {
  const isFinish = useRef(false);

  const handleFinish = useMemoizedFn(() => {
    console.log('handleFinish------>', index, isFinish.current, skip);
    if (isFinish.current) {
      return;
    } else {
      isFinish.current = true;
      onFinish(index);
    }
  });

  const { streamText } = useStaticStreamText({
    skip,
    start,
    text: dialog.text,
    onFinish: handleFinish
  });

  // 暂时不用拆分了
  // const [dialogList, setDialogList] = useState<string[]>(['']);
  // useEffect(() => {
  //   if (streamText) {
  //     const sentences = splitParagraph(streamText);
  //     setDialogList(sentences);
  //   }
  // }, [streamText]);

  return (
    // <View style={dialogStyle}>
    //   {dialogList.map((item, index) => (
    //     <Dialog text={`${index === 0 ? `${dialog.role}: ` : ''}${item}`} />
    //   ))}
    // </View>
    <Dialog text={`${dialog.role}: ${streamText}`} dialogStyle={dialogStyle} />
  );
}

export const TestStream = () => {
  const [skip, setSkip] = useState(false);
  const [start, setStart] = useState(false);
  const { streamText } = useStaticStreamText({
    skip,
    start,
    text: 'abcdefghijklmnopqrstuvwxyz',
    onFinish: () => {
      console.log('finished');
    }
  });

  return (
    <View>
      <Pressable
        onPress={() => {
          setSkip(true);
        }}
        style={{ width: 100, height: 50, borderWidth: 1 }}
      >
        <Text>skip</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setStart(true);
        }}
        style={{ width: 100, height: 50, borderWidth: 1 }}
      >
        <Text>start</Text>
      </Pressable>
      <Text style={{ borderWidth: 1 }}>{streamText}</Text>
    </View>
  );
};
