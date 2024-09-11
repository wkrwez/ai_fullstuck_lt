import { useEffect } from 'react';
import { ImageBackground, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { createStyle } from '@/src/utils';

const IMG_LOADING_BG = require('@Assets/image/parallel-world/img-loading-bg.png');
const LOADING_ICON = require('@Assets/image/parallel-world/loading-icon.png');
const LOADING_ICON_SHADOW = require('@Assets/image/parallel-world/loading-icon-shadow.png');

export default function ImageLoading({
  style: $imageStyleOverwrite = {}
}: {
  style?: StyleProp<ViewStyle>;
}) {
  const deg = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${deg.value}deg` }]
    };
  });

  useEffect(() => {
    deg.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  return (
    <ImageBackground
      source={IMG_LOADING_BG}
      style={[styles.$loadingBg, $imageStyleOverwrite]}
      resizeMode="cover"
    >
      <Animated.Image
        style={[animatedStyle, styles.$loadingIcon, { zIndex: 1 }]}
        resizeMode="contain"
        source={LOADING_ICON}
      />
      <Animated.Image
        style={[
          animatedStyle,
          styles.$loadingIcon,
          { position: 'relative', top: -18 }
        ]}
        resizeMode="contain"
        source={LOADING_ICON_SHADOW}
      />
    </ImageBackground>
  );
}

const styles = createStyle({
  $loadingBg: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  $loadingIcon: { with: 24, height: 24 }
});
