import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Header, Image } from '@/src/components';
import {
  CommentEvent,
  CommentEventBus
} from '@/src/components/comment/eventbus';
// import { EMOJI_SIZE } from '@/src/components/emoji/_constants';
import { EMOJI_SIZE } from '@/src/components/emoji/_constants';
import { useImgPreview } from '@/src/components/emoji/_hooks/img-preview.hook';
import { useResetOnUnmount } from '@/src/components/emoji/_hooks/reset.hook';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { createStyle } from '@/src/utils';

export default function Preview() {
  const { emojiInfo } = useEmojiCreatorStore(state => state);

  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  const { entering, exiting, isImgLoaded, setIsImgLoaded } = useImgPreview();

  const handleBack = () => {
    router.back();
    setTimeout(() => {
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {});
    }, 300);
  };

  useResetOnUnmount();

  return (
    <View style={[styles.$container, $containerInsets]}>
      <StatusBar style="light" />
      <Header
        themeColors={{ textColor: 'white' }}
        title="表情预览"
        onBack={handleBack}
      />
      <View style={{ height: 106 }} />
      <View style={styles.$emojiContainer}>
        <View style={styles.$emojiBox}>
          <Image
            source={{ uri: emojiInfo?.wholeImageUrl }}
            onLoad={() => {
              setIsImgLoaded(true);
            }}
            style={styles.$emojiImg}
          />
          {!isImgLoaded && (
            <Animated.View
              entering={entering}
              exiting={exiting}
              style={{ position: 'absolute', zIndex: 10 }}
            >
              <Image
                tosSize="size6"
                source={{ uri: emojiInfo?.wholeImageUrl }}
                style={styles.$emojiImg}
              />
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = createStyle({
  $container: { flex: 1, backgroundColor: '#23272D' },
  $emojiContainer: {
    marginTop: 40,
    borderColor: 'green',
    flex: 1
  },
  $emojiBox: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  $emojiImg: {
    height: EMOJI_SIZE,
    width: EMOJI_SIZE
  }
});
