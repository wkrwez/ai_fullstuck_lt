//封装成和Modal一样的接口
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Modal, // Keyboard,
  Platform,
  Pressable,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { DEFAULT_SHEET_ZINDEX, SPALASH_ZINDEX } from '@/src/constants';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useDetailStore } from '@/src/store/detail';
import { colors, colorsUI, paletteUI, spacing } from '@/src/theme';
import * as theme from '@/src/theme';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { reportClick } from '@/src/utils/report';
import { Button, ButtonProps } from '@Components/button';
import { Icon } from '@Components/icons';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { dp2px, isIos, styles } from '@Utils/index';
import { Portal } from '@gorhom/portal';
import { PRESERVE_GAP_FOR_DEBOUNCE } from './const';
import * as st from './style';
import {
  // MAX_TRANSLATE,
  SheetConfig,
  SheetContextProps,
  SheetModalProps
} from './type';

const { width, height } = Dimensions.get('window');
const MAX_TRANSLATE = height;

export const SheetModal: React.FC<SheetModalProps> = ({
  isVisible,
  onClose,
  onShow, // todo
  onShowAnimationDone,
  maskOpacity: maskOpacityProp = 0.5,
  maskChildren,
  maskClosable = true,
  children,
  maskShown = false, // 是否移除mask
  dragable = false,
  closeBtn,
  zIndex = DEFAULT_SHEET_ZINDEX,
  keyboardAvoidingViewProps = {},
  remainHeight = 400,
  onGesture,
  style: $customStyle,
  theme,
  portalProps
}) => {
  const showRatio = useSharedValue(MAX_TRANSLATE); // 最大TranslateMAX
  const [isMaskVisible, setIsMaskVisible] = useState(isVisible);
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const contaienrY = useSharedValue(MAX_TRANSLATE);
  // const { detail } = useDetailStore.getState();
  // if (!detail) return null;
  // const { cardId } = detail;

  const themeConfig = theme === 'dark' ? darkSceneColor : lightSceneColor;

  const handleClose = () => {
    // reportClick('click', 'share_component', {
    //   contentid: cardId,
    //   share_component: '11'
    // });

    Keyboard.dismiss();
    onClose();
  };

  if (!closeBtn)
    closeBtn = (
      <Icon
        color={colorsUI.Icon.netutral.default}
        icon="close_outline"
        size={24}
        style={{}}
        hitSlop={spacing.xs}
        onPress={handleClose}
      />
    );

  const springOptions = {
    stiffness: 400,
    damping: 32
  };

  // 用 ref 来保存 isVisible 的值，因为 isVisible 的值在动画过程中会变化
  // --- Start Animation ---
  const visibleRef = useRef(isVisible);

  const pan = Gesture.Pan();

  const hideMask = () => {
    if (!visibleRef.current) {
      setIsMaskVisible(false);
    }
  };

  const changeRatioValue = (v: number) => {
    showRatio.value = v;
    if (onGesture) {
      onGesture(v);
    }
  };

  const hideHeight = useMemo(() => {
    return MAX_TRANSLATE - (remainHeight || 0);
  }, [remainHeight]);

  useEffect(() => {
    // console.log('isVisible------', isVisible);
    // 当 isVisible 变化时，根据 isVisible 的值来隐藏 Pressable 组件
    visibleRef.current = isVisible;
    if (isVisible) {
      // 当 isVisible 变为 true 时，显示 Pressable 组件并开始动画
      setIsMaskVisible(true);
      showRatio.value = hideHeight;
      const afterAnimatioDoneCb = () =>
        setTimeout(() => onShowAnimationDone?.());
      showRatio.value = withSpring(0, springOptions, () => {
        runOnJS(afterAnimatioDoneCb)();
      });
      // if (onGesture) {
      //   onGesture(withTiming(1, { duration: 150 }));
      // }
    } else {
      showRatio.value = withSpring(hideHeight, springOptions, () => {
        runOnJS(hideMask)();
      });
      // if (onGesture) {
      //   onGesture(withTiming(0, { duration: 150 }));
      // }
    }
  }, [isVisible]);

  const $containerStyleOverride = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: showRatio.value }]
    };
  });
  const $maskStyleOverride = useAnimatedStyle(() => {
    return { opacity: 1 - showRatio.value / MAX_TRANSLATE };
  });

  const handleMaskPress = () => {
    console.log('handleMaskPress');
    maskClosable && isVisible && handleClose();
  };

  pan
    .enabled(dragable)
    .onStart(e => {
      Keyboard.dismiss();
    })
    .onUpdate(e => {
      if (e.translationY > 0) changeRatioValue(e.translationY);
    })
    .onEnd(e => {
      let hide = e.translationY > 500;
      if (e.velocityY > 500) {
        if (onGesture) {
          onGesture(MAX_TRANSLATE);
        }
        hide = true;
      } else {
        if (onGesture) {
          onGesture(e.translationY);
        }
      }

      if (hide) {
        const v = withSpring(hideHeight, springOptions, () => {
          runOnJS(handleClose)();
        });
        showRatio.value = v;
        // if (onGesture) {
        //   onGesture(withTiming(1000, { duration: 150 }));
        // }
        // changeRatioValue(withTiming(1, { duration: 150 }));
        // changeRatioValue(v);
      } else {
        changeRatioValue(withTiming(0, { duration: 150 }));
        onShow && onShow();
      }
    });
  // --- End Animation ---

  const content = () => {
    return (
      <>
        {maskShown && (
          <Pressable
            style={[StyleSheet.absoluteFill]}
            onPress={handleMaskPress}
          >
            <Animated.View
              style={[
                {
                  backgroundColor: StyleSheet.hex(
                    StyleSheet.currentColors.black,
                    maskOpacityProp
                  )
                },
                st.$maskStyle,
                $maskStyleOverride
              ]}
            >
              {maskChildren}
            </Animated.View>
          </Pressable>
        )}
        <Animated.View
          onLayout={({ nativeEvent: { layout } }) => {
            contaienrY.value = Math.min(layout.height, MAX_TRANSLATE);
          }}
          style={[
            st.$containerStyle,
            $containerStyleOverride,
            {
              backgroundColor: themeConfig.bg,
              paddingBottom:
                Math.max(Number($containerInsets.paddingBottom || 0), 20) +
                dp2px(PRESERVE_GAP_FOR_DEBOUNCE)
            },
            $customStyle
          ]}
        >
          <GestureDetector gesture={pan}>
            <View>{children}</View>
          </GestureDetector>
          {/* <View
            style={{ paddingHorizontal: childrenPadding ? spacing.mlg : 0 }}
          >
            {children}
          </View> */}
        </Animated.View>
      </>
    );
  };

  if (!maskShown)
    return (
      <Portal {...portalProps}>
        <KeyboardAvoidingView
          behavior={isIos ? 'height' : undefined}
          style={{ zIndex: zIndex || SPALASH_ZINDEX + 1 }}
        >
          {(remainHeight || isVisible) && content()}
        </KeyboardAvoidingView>
      </Portal>
    );
  return (
    <Portal {...portalProps}>
      {(remainHeight || isMaskVisible) && (
        <>
          <KeyboardAvoidingView
            behavior={isIos ? 'height' : undefined}
            style={[
              StyleSheet.absoluteFill,
              {
                zIndex: zIndex || SPALASH_ZINDEX + 1
              }
            ]}
            {...keyboardAvoidingViewProps}
          >
            {content()}
          </KeyboardAvoidingView>
        </>
      )}
    </Portal>
  );
};
