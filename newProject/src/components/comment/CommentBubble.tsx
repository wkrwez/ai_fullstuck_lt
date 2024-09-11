import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import ReAnimated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useBehaviorStore } from '@/src/store/behavior';
import { useConfigStore } from '@/src/store/config';
import { Theme } from '@/src/theme/colors/type';
import { Bubble } from '@Components/bubble';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';

const BUBBLE_XIAOLI = require('@Assets/bubble/xiaoli-left.png');

interface CommentBubbleProps {
  theme?: Theme;
  style?: StyleProp<ViewStyle>;
}
export function CommentBubble(props: CommentBubbleProps) {
  const [showBubble, setShowBubble] = useState(true);
  const [text, setText] = useState('做个表情包吧~');
  useEffect(() => {
    useBehaviorStore.getState().add('commentExpo');
    setShowBubble(useBehaviorStore.getState().showCommmentGuide());
    useConfigStore
      .getState()
      .getText('commentTip')
      .then(res => {
        if (res) {
          setText(text);
        }
      });
  }, []);
  if (!showBubble) return null;
  return (
    <ReAnimated.View
      style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
      entering={FadeInDown.delay(500).duration(200)}
    >
      <Bubble
        placement="top"
        cornerStyle={{ right: 35, left: 'auto' }}
        text={text}
        theme={props.theme || Theme.LIGHT}
        style={[
          {
            position: 'absolute',
            right: -10,
            top: -42,
            height: 30,
            paddingLeft: 10,
            width: 'auto'
          },
          props.style
        ]}
        render={themeConfig => (
          <>
            <View
              style={{
                position: 'absolute',
                height: 33,
                width: 28,
                left: 0,
                bottom: 0,
                borderRadius: 500,
                overflow: 'hidden'
              }}
            >
              <Image
                source={BUBBLE_XIAOLI}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <Text
              style={[
                {
                  width: '100%',
                  fontWeight: '500',
                  lineHeight: 16,
                  paddingLeft: 22,
                  fontSize: 11,
                  color: themeConfig.fontColor
                }
              ]}
              numberOfLines={1}
            >
              {text}
            </Text>
          </>
        )}
      ></Bubble>
    </ReAnimated.View>
  );
}
