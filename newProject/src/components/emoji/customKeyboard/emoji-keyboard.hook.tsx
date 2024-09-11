import { useMemoizedFn } from 'ahooks';
import { ImageStyle } from 'expo-image';
import { RefObject, useEffect, useState } from 'react';
import { StyleProp, TextInput } from 'react-native';
import { selectState } from '@/src/store/_utils';
import { useEmojiStore } from '@/src/store/emoji';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportClick } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import { EmojiInputIcon } from '../EmojiInputIcon';
import { EmojiInfo } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';

export const useEmojiKeyboard = ({
  inputInstance,
  showInput,
  closeInput
}: {
  inputInstance: RefObject<TextInput>;
  showInput: () => void;
  closeInput: () => void;
}) => {
  const { selectedEmojis, changeSelectedEmojis } = useEmojiStore(state =>
    selectState(state, ['selectedEmojis', 'changeSelectedEmojis'])
  );
  const { changeEmoji } = useEmojiCreatorStore(state =>
    selectState(state, ['changeEmoji'])
  );
  const [isEmojiKeyboardVisible, setIsEmojiKeyboardVisible] =
    useState<boolean>(false);

  const switchOnEmojiKeyboard = useMemoizedFn(() => {
    reportClick('emoji_bottom_button');
    if (!isEmojiKeyboardVisible) {
      inputInstance?.current?.blur();
      reportClick('emoji_collection_load');
      setIsEmojiKeyboardVisible(true);
    }
  });

  const switchOnKeyboard = useMemoizedFn(() => {
    if (isEmojiKeyboardVisible) {
      setIsEmojiKeyboardVisible(false);
      showInput();
    }
  });

  const selectEmoji = useMemoizedFn((emoji: EmojiInfo) => {
    changeSelectedEmojis([emoji]);
  });

  const viewEmoji = useMemoizedFn((emoji: EmojiInfo) => {
    changeEmoji(emoji);
    closeInput();
  });

  const cancelSelectedEmoji = useMemoizedFn((emoji: EmojiInfo) => {
    changeSelectedEmojis(
      selectedEmojis.filter(e => e.emojiId !== emoji.emojiId)
    );
  });

  const clearSelectEmoji = useMemoizedFn(() => {
    changeSelectedEmojis([]);
  });

  const renderEmojiIcon = useMemoizedFn(
    ({
      isEmoji,
      style,
      theme = Theme.LIGHT
    }: {
      isEmoji: boolean;
      style?: StyleProp<ImageStyle>;
      theme: Theme;
    }) => {
      const iconColor = getThemeColor(theme).fontColor;
      return isEmoji ? (
        <Icon
          icon={'comment_keyboard'}
          style={[{ tintColor: iconColor }, style]}
          onPress={switchOnKeyboard}
        />
      ) : (
        <EmojiInputIcon
          style={[{ tintColor: iconColor }, style]}
          onPress={switchOnEmojiKeyboard}
        />
      );
    }
  );

  useEffect(() => {
    return () => {
      changeSelectedEmojis([]);
    };
  }, []);

  return {
    isEmojiKeyboardVisible,
    setIsEmojiKeyboardVisible,
    clearSelectEmoji,
    switchOnEmojiKeyboard,
    switchOnKeyboard,
    selectedEmojis,
    selectEmoji,
    viewEmoji,
    cancelSelectedEmoji,
    renderEmojiIcon
  };
};
