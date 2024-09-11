import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { Portal } from '@gorhom/portal';

interface IMessageProps {
  title: string;
  content: string;
  duration?: number;
  visible: boolean;
}

export const MessageSingleton = {
  showMessage: (
    title: IMessageProps['title'],
    content: IMessageProps['content'],
    duration?: number
  ) => {},
  hideMessage: () => {}
};

export const showMessage = (
  title: IMessageProps['title'] = '',
  content: IMessageProps['content'] = '',
  duration = 3000
) => MessageSingleton.showMessage(title, content, duration);
export const hideMessage = () => MessageSingleton.hideMessage();

const Message = ({
  title,
  content,
  duration = 3000,
  visible
}: IMessageProps) => {
  const Y_TOP = -20;
  const ANI_TIME = 300;

  const opacity = useSharedValue(0);
  const offsetTop = useSharedValue(Y_TOP);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: ANI_TIME
      });
      offsetTop.value = withTiming(0, {
        duration: ANI_TIME
      });

      timer.current = setTimeout(() => {
        hideMessage();
      }, duration);
    } else {
      opacity.value = withTiming(0, {
        duration: ANI_TIME
      });
      offsetTop.value = withTiming(Y_TOP, {
        duration: ANI_TIME
      });
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [visible]);

  const $opacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: offsetTop.value
      }
    ]
  }));

  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <Animated.View
        style={[
          $container,
          $opacityAnimatedStyle,
          {
            top: insets.top + 20
          }
        ]}
      >
        <View style={$messageWrapper}>
          <Text style={$title}>{title}</Text>
          <Text style={$content}>{content}</Text>
        </View>
      </Animated.View>
    </Portal>
  );
};

export const MessageGlobal = () => {
  const defaultDuration = 3000;
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(defaultDuration);

  useEffect(() => {
    const register = () => {
      MessageSingleton.showMessage = (
        title,
        content,
        duration = defaultDuration
      ) => {
        setTitle(title);
        setContent(content);
        setDuration(duration);
        setVisible(true);
      };
      MessageSingleton.hideMessage = () => {
        setVisible(false);
      };
    };

    register();
  }, []);

  return (
    <Message
      visible={visible}
      title={title}
      duration={duration}
      content={content}
    ></Message>
  );
};

const $container: ViewStyle = {
  height: 90,
  width: '100%',
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  left: 0,
  pointerEvents: 'none',
  zIndex: DEFAULT_SHEET_ZINDEX + 100,
  shadowColor: 'rgba(0, 0, 0, 0.08)',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 1,
  shadowRadius: 8,
  elevation: 3 // 适用于 Android,
};

const $messageWrapper: ViewStyle = {
  height: 90,
  backgroundColor: '#fff',
  width: 335,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'flex-start',
  paddingVertical: 16,
  paddingHorizontal: 16
};

const $title: TextStyle = {
  color: '#363636',
  fontFamily: 'PingFang SC',
  fontSize: 14,
  fontWeight: '600',
  fontStyle: 'normal',
  marginBottom: 6
};

const $content: TextStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  fontFamily: 'PingFang SC',
  fontSize: 12,
  fontWeight: '400',
  fontStyle: 'normal',
  lineHeight: 18
};

export default Message;
