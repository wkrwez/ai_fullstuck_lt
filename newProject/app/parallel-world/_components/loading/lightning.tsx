import { View } from 'react-native';
import { AnimatedImage } from '@/src/components/animatedImage';
import { useScreenSize } from '@/src/hooks';
import { StyleSheet } from '@Utils/StyleSheet';

const st = StyleSheet.create({
  $container: {
    position: 'relative'
  },
  $l61: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: 188
  },
  $l62: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 280,
    height: 188
  },
  $l63: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: 188
  },
  $l64: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 280,
    height: 188
  }
});

const L5 = require('@Assets/apng/l5.png');
const L61 = require('@Assets/apng/l6_1.png');
const L62 = require('@Assets/apng/l6_2.png');
const L63 = require('@Assets/apng/l6_3.png');
const L64 = require('@Assets/apng/l6_4.png');

export default function Lightning() {
  const { width } = useScreenSize('window');
  return (
    <View style={{ position: 'absolute', flex: 1 }}>
      <View
        style={[
          st.$container,
          {
            width: width,
            height: 0.75 * width
          }
        ]}
      >
        <AnimatedImage
          source={L5}
          style={StyleSheet.absoluteFill}
          duration={1000}
        ></AnimatedImage>

        <AnimatedImage
          source={L61}
          style={st.$l61}
          delay={1500}
          duration={400}
          loop
          resizeMode="contain"
        ></AnimatedImage>
        <AnimatedImage
          source={L62}
          style={st.$l62}
          delay={2500}
          duration={400}
          loop
          resizeMode="contain"
        ></AnimatedImage>
        <AnimatedImage
          source={L63}
          style={st.$l63}
          delay={3500}
          duration={400}
          loop
          resizeMode="contain"
        ></AnimatedImage>
        <AnimatedImage
          source={L64}
          style={st.$l64}
          delay={5500}
          duration={400}
          loop
          resizeMode="contain"
        ></AnimatedImage>
      </View>
    </View>
  );
}
