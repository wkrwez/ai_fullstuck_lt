import { useEffect, useState } from 'react';
import { ImageProps, ImageStyle, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Image } from '@Components/image';
import { BlurView } from '@react-native-community/blur';

// import { Image, ImageStyle } from '@Components/image';

// import { ImageState } from '@/src/types';

interface NetworkImageProps {
  source: string;
  style: ViewStyle;
}
export function NetworkImage(props: NetworkImageProps) {
  const opaVal = useSharedValue(0);

  const $imageShowStyle = useAnimatedStyle(() => ({
    opacity: opaVal.value
  }));
  if (!props.source) return null;
  return (
    <View style={[{ position: 'relative' }, props.style]}>
      {/* <Image
        style={[{ width: '100%', height: '100%' }]}
        source={props.source + '?x-tos-process=image/resize,h_50/format,webp'}
      />
      <BlurView
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      ></BlurView> */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            height: '100%'
            // opacity: 0
          }
          // $imageShowStyle
        ]}
      >
        <Image
          style={{ width: '100%', height: '100%' }}
          source={props.source}
          // onLoad={() => {
          //   opaVal.value = withTiming(1, { duration: 100 });
          // }}
        />
      </Animated.View>
    </View>
  );
}
