import React,{useEffect} from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export function PressView(props:{
    children: React.ReactNode,
    style?: ViewStyle
  }) {
    const scaleValue = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {  
        return {  
        transform: [{ scale: scaleValue.value }],  
        };  
    });  

  // 触发动画的函数  
  const startAnimation = () => {   
    scaleValue.value = withTiming(1, { duration: 300 });
  }; 
  // useEffect自动触发动画  
  useEffect(() => {  
    startAnimation();  
  }, []);

  return (
    <Animated.View style={[animatedStyle, props.style]}>
      {props.children}
    </Animated.View>
  );
}

