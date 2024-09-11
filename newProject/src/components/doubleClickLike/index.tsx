import LottieView from 'lottie-react-native';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, View } from 'react-native';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { StyleSheet } from '@/src/utils';

const LOTTIE_LIKE = require('@Assets/lottie/like.json');
const LOTTIE_SIZE = 300;
const LOTTIE_ORIGIN_OFFSET_X = LOTTIE_SIZE / 2;
const LOTTIE_ORIGIN_OFFSET_Y = LOTTIE_SIZE - 50;

interface DoubleClickLikeProps {}

export interface DoubleClickLikeActions {
  start: (offsetX: number, offsetY: number) => void;
}

export const DoubleClickLike = forwardRef<
  DoubleClickLikeActions,
  DoubleClickLikeProps
>(({}, ref) => {
  const likeLottieRef = useRef<LottieView>(null);
  const likeLottiePositionX = useRef(new Animated.Value(0)).current;
  const likeLottiePositionY = useRef(new Animated.Value(0)).current;

  const startAnimation = (x: number, y: number) => {
    likeLottieRef.current?.reset();

    // 避免 lottie 动画未停止前发生位移
    setTimeout(() => {
      likeLottiePositionX.setValue(x - LOTTIE_ORIGIN_OFFSET_X);
      likeLottiePositionY.setValue(y - LOTTIE_ORIGIN_OFFSET_Y);
      likeLottieRef.current?.play();
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      start: startAnimation
    }),
    []
  );

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: DEFAULT_SHEET_ZINDEX + 10 }]}
      pointerEvents="none"
    >
      <Animated.View
        style={[
          {
            top: likeLottiePositionY,
            left: likeLottiePositionX
          }
        ]}
      >
        <LottieView
          ref={likeLottieRef}
          style={{
            width: LOTTIE_SIZE,
            height: LOTTIE_SIZE
          }}
          source={LOTTIE_LIKE}
          loop={false}
        />
      </Animated.View>
    </View>
  );
});
