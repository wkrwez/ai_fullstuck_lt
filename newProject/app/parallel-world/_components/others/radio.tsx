import React, { useEffect } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';

interface RadioProps {
  isActive?: boolean;
  onPress?: (isSelected: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function Radio({
  isActive = false,
  onPress,
  style: $styleOverwrite = {}
}: RadioProps) {
  const scale = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    onPress && onPress(!isActive);
  };

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1, {
        mass: 0.7
      });
    } else {
      scale.value = withTiming(0, { duration: 300 });
    }
  }, [isActive]);

  return (
    <Pressable
      style={[styles.$pressArea, $styleOverwrite]}
      onPress={handlePress}
    >
      <View style={styles.$radio}>
        <Animated.View style={[styles.$radioInner, animatedStyle]} />
      </View>
    </Pressable>
  );
}

const styles = createStyle({
  $pressArea: { padding: 4 },
  $radio: {
    ...createCircleStyle(22),
    borderColor: 'rgba(256,256,256,0.8)',
    borderWidth: 2,
    backgroundColor: 'rgba(20, 41, 76, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  $radioInner: {
    ...createCircleStyle(14),
    backgroundColor: 'rgba(127, 217, 255, 1)'
  }
});
