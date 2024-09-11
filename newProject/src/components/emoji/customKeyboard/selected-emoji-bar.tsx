import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Button, Icon, Image, Text } from '@/src/components';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { EmojiInfo } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';

function EmojiSelection({
  emoji,
  onPress,
  onCancel
}: {
  emoji: EmojiInfo;
  onPress: (emoji: EmojiInfo) => void;
  onCancel: (emoji: EmojiInfo) => void;
}) {
  return (
    <View
      style={{
        position: 'relative',
        width: 50,
        height: 50
      }}
    >
      <Pressable
        onPress={() => {
          onPress(emoji);
        }}
      >
        <Image
          source={emoji?.wholeImageUrl ?? ''}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#EEE'
          }}
          contentFit="contain"
          tosSize="size10"
        />
      </Pressable>
      <Pressable
        style={{
          position: 'absolute',
          right: -10,
          top: -10,
          padding: 3
        }}
        onPress={() => {
          onCancel(emoji);
        }}
      >
        <Icon icon="close" size={14} />
      </Pressable>
    </View>
  );
}

export default function SelectedEmojiBar({
  emojiList,
  theme = Theme.LIGHT,
  onCancel,
  onPreview
}: {
  emojiList: EmojiInfo[];
  theme?: Theme;
  onCancel: (emoji: EmojiInfo) => void;
  onPreview: (emoji: EmojiInfo) => void;
}) {
  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;
  const handlePreview = (emoji: EmojiInfo) => {
    onPreview && onPreview(emoji);
    router.push(`/emoji/preview`);
  };
  return (
    <View
      style={{
        paddingBottom: 12,
        paddingHorizontal: 12,
        gap: 6,
        backgroundColor: themeConfig.bg2,
        // borderWidth: 1,
        flexDirection: 'row'
      }}
    >
      {emojiList.map(emoji => (
        <EmojiSelection
          emoji={emoji}
          key={emoji?.emojiId}
          onPress={handlePreview}
          onCancel={onCancel}
        />
      ))}
    </View>
  );
}
