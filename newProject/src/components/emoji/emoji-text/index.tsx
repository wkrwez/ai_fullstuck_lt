import React, { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { createStyle } from '@/src/utils';
import { EmojiFontInfo, getEmojiFontInfo, isEmoji } from '../_utils';
import { BorderText } from '../border-text';

export default function EmojiText({
  text,
  isCursorVisible,
  onFocus,
  onLayout
}: {
  text: string;
  isCursorVisible: boolean;
  onFocus: () => void;
  onLayout: () => void;
}) {
  const fontInfo = useMemo<EmojiFontInfo>(() => getEmojiFontInfo(text), [text]);

  const $opacity = useSharedValue(1);
  useEffect(() => {
    $opacity.value = withRepeat(
      withSequence(
        withTiming(0, {
          duration: 500,
          easing: Easing.linear
        }),
        withTiming(1, {
          duration: 500,
          easing: Easing.linear
        })
      ),
      -1,
      true
    );
  }, []);

  return (
    <View style={textStyles.$container} onLayout={onLayout}>
      <Pressable
        onPress={onFocus}
        style={[
          textStyles.$pressArea,
          fontInfo.lines > 1
            ? { flexWrap: 'wrap', alignContent: 'flex-end' }
            : { alignItems: 'flex-end' }
        ]}
      >
        {Array.from(text).map(char =>
          isEmoji(char) ? (
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontInfo.size,
                fontWeight: '500'
              }}
            >
              {char}
            </Text>
          ) : (
            <BorderText
              text={char}
              fontSize={fontInfo.size}
              fontStyle={{
                textAlign: 'center',
                fontSize: fontInfo.size,
                fontWeight: '500'
              }}
              borderWidth={2}
              containerStyle={{ height: fontInfo.size + 4 }}
              numberOfLines={fontInfo.lines}
            ></BorderText>
          )
        )}
        <View
          style={{
            opacity: isCursorVisible ? 1 : 0,
            height: fontInfo.size + 4,
            justifyContent: 'flex-end'
          }}
        >
          <Animated.View
            style={[
              {
                opacity: $opacity,
                height: fontInfo.size
              },
              textStyles.$cursor
            ]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const textStyles = createStyle({
  $container: {
    width: '100%',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1 }],
    position: 'absolute'
  },
  $pressArea: {
    flexDirection: 'row',
    width: '100%',
    // paddingHorizontal: 24,
    position: 'relative',
    justifyContent: 'center'
  },
  $cursor: { width: 3, borderRadius: 1, backgroundColor: 'white' }
});
