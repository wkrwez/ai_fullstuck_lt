import { useRef } from 'react';
import { Animated, Pressable, StyleProp, ViewStyle } from 'react-native';

export function TouchableScale({
  children,
  style: $customStyle,
  onPress,
  disableTouchableScale
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disableTouchableScale?: boolean;
}) {
  const placeholderScale = useRef(new Animated.Value(1)).current;
  const placeholderOpacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.timing(placeholderScale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true
    }).start();
    Animated.timing(placeholderOpacity, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(placeholderScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
    Animated.timing(placeholderOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  return (
    <Pressable
      onPressIn={disableTouchableScale ? undefined : onPressIn}
      onPressOut={disableTouchableScale ? undefined : onPressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          $customStyle,
          {
            transform: [{ scale: placeholderScale }],
            opacity: placeholderOpacity
          }
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
