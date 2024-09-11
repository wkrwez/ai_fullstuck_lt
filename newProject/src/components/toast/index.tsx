import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View,
  ViewStyle
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { DEFAULT_MODAL_ZINDEX, DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { colorsUI } from '@/src/theme';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { Portal } from '@gorhom/portal';
import { IToastModalProps } from './typing';
import { useLocalToast } from './useLocalToast';

const DEFAULT_FADE_DURATION = 150;

export const ToastSingleton = {
  showToast: (
    text: IToastModalProps['content'],
    duration?: number,
    enableEvents?: boolean
  ) => {},
  hideToast: () => {}
};

export const showToast = (
  text: IToastModalProps['content'] = '',
  duration = 2000,
  enableEvents = false
) => ToastSingleton.showToast(text, duration, enableEvents);
export const hideToast = () => ToastSingleton.hideToast();

export const LocalToast: FC<IToastModalProps> = props => {
  const {
    visible,
    content,
    duration,
    onChangeVisible = () => {},
    enableEvents
  } = props;

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    if (duration !== -1) {
      timerRef.current = setTimeout(() => {
        onChangeVisible(false);
      }, duration);
    }

    // if (!visible) {
    //   opacity.value = withTiming(0, { duration: DEFAULT_FADE_DURATION });
    //   scale.value = withTiming(0.2, { duration: DEFAULT_FADE_DURATION });
    // } else {
    //   opacity.value = withTiming(1, { duration: DEFAULT_FADE_DURATION });
    //   scale.value = withTiming(1.0, { duration: DEFAULT_FADE_DURATION });
    //   if (duration !== -1) {
    //     timerRef.current = setTimeout(() => {
    //       onChangeVisible(false);
    //     }, duration);
    //   }
    // }
    return () => clearTimeout(timerRef.current);
  }, [visible, duration]);

  const $animateStyle = useAnimatedStyle(() => ({
    display: opacity.value === 0 ? 'none' : 'flex',
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: -150 }]
  }));

  const outerPress = (e: GestureResponderEvent) => {
    setTimeout(() => {
      enableEvents && onChangeVisible(false);
    }, 60);
    e.stopPropagation();
  };

  if (!visible) return null;

  return (
    <Pressable
      style={[
        StyleSheet.absoluteFill,
        $animateContainer,
        {
          zIndex: DEFAULT_SHEET_ZINDEX + 100,
          pointerEvents: enableEvents ? 'box-none' : 'none'
        }
      ]}
      onTouchStart={outerPress}
    >
      <Animated.View
        entering={FadeIn.duration(DEFAULT_FADE_DURATION)}
        exiting={FadeOut.duration(DEFAULT_FADE_DURATION)}
        style={[
          StyleSheet.absoluteFill,
          $animateContainer,
          // $animateStyle,
          { zIndex: DEFAULT_SHEET_ZINDEX + 100 }
        ]}
      >
        <View
          style={[
            $toastContainer,
            {
              pointerEvents: 'auto'
            }
          ]}
        >
          {typeof content === 'string' ? (
            <Text
              style={{
                color: colorsUI.Text.default.inverse,
                fontSize: 14,
                lineHeight: 20
              }}
            >
              {content}
            </Text>
          ) : (
            content
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export const Toast: FC<IToastModalProps> = props => {
  return (
    <Portal>
      <LocalToast {...props} />
    </Portal>
  );
};

export const ToastGlobal = () => {
  const { showToast, hideToast, ...restToastProps } = useLocalToast();

  useEffect(() => {
    const registerToast = () => {
      ToastSingleton.showToast = showToast;
      ToastSingleton.hideToast = hideToast;
    };
    registerToast();
  }, []);

  return <Toast {...restToastProps} />;
};

const $toastContainer = {
  backgroundColor: StyleSheet.hex('#121212', 0.85),
  borderRadius: 100,
  paddingVertical: 8,
  paddingHorizontal: 16,
  shadowColor: '#000000',
  shadowOffsetY: 4,
  shadowOpacity: 0.15,
  shadowRadius: 10
};

const $animateContainer: ViewStyle = {
  zIndex: DEFAULT_SHEET_ZINDEX + 100,
  // backgroundColor:'red',
  justifyContent: 'center',
  alignItems: 'center'
};
