import React, { useEffect, useRef } from 'react';
import { Animated, Easing, TextStyle } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { Text } from '../text';

const $defaultStyle = StyleSheet.create({
  color: '#ffffff',
  fontSize: 20,
  lineHeight: 20,
  height: 20
});

interface CursorProps {
  style?: TextStyle;
}
export function Cursor(props: CursorProps) {
  const opacityValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const opa = Animated.timing(opacityValue, {
      toValue: 0,
      duration: 1000,
      easing: Easing.linear,
      //   easing: Easing.step0,
      useNativeDriver: true
      //   useNativeDriver: true
    });

    const loop = Animated.loop(opa);
    loop.start();
    // console.log(1111, opacityValue);
  }, []);

  return (
    <Animated.View style={[{ opacity: opacityValue }]}>
      <Text style={[$defaultStyle, props.style]}>|</Text>
    </Animated.View>
  );
}
