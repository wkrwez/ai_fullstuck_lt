import { useEffect } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Image } from '@/src/components';
// import { Image } from '@/src/components';
import { colors, rowStyle } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { createStyle } from '@Utils/StyleSheet';
import { PlotTag } from '@/proto-registry/src/web/raccoon/world/common_pb';

const KEYWORD = require('@Assets/image/parallel-world/keyword-label.png');
const KEYWORD_ACTIVE = require('@Assets/image/parallel-world/keyword-label-active.png');

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DUR = 200;

export default function KeywordLabel({
  tag,
  isActive,
  onPress
}: {
  tag: PlotTag;
  isActive: boolean;
  onPress: (isActive: boolean, tag: PlotTag) => void;
}) {
  const $active = useSharedValue<number>(0);

  const $activeStyle_A = useAnimatedStyle(() => {
    if ($active.value) {
      return {
        opacity: withDelay(DUR, withTiming($active.value, { duration: DUR })),
        transform: [
          {
            scale: withDelay(
              DUR / 2,
              withSpring($active.value * 1.1, { mass: 0.7 })
            )
          }
        ]
      };
    } else {
      return { opacity: withTiming($active.value, { duration: DUR }) };
    }
  });

  const $normalStyle_A = useAnimatedStyle(() => {
    if ($active.value) {
      return {
        opacity: withDelay(
          DUR / 2,
          withTiming(1 - $active.value, { duration: DUR })
        ),
        zIndex: 1
      };
    } else {
      return {
        opacity: withTiming(1 - $active.value, { duration: DUR }),
        zIndex: 10
      };
    }
  });

  const handlePress = () => {
    onPress(!isActive, tag);
  };

  useEffect(() => {
    $active.value = isActive ? 1 : 0;
  }, [isActive]);

  return (
    <Pressable
      onPress={handlePress}
      style={{
        position: 'relative',
        width: 90,
        height: 42,
        zIndex: 100
      }}
    >
      <AnimatedImageBackground
        source={KEYWORD_ACTIVE}
        style={[labelStyles.$activeLabelBg, $activeStyle_A]}
        resizeMode="contain"
      >
        <View style={labelStyles.$tagContent}>
          {tag.iconUrl && (
            <Image
              source={{ uri: tag.iconUrl }}
              style={{ width: 18, height: 18 }}
            />
          )}
          <Text style={labelStyles.$activeText}>{tag.text}</Text>
        </View>
      </AnimatedImageBackground>

      <AnimatedImageBackground
        source={KEYWORD}
        style={[labelStyles.$labelBg, $normalStyle_A]}
        resizeMode="contain"
      >
        <View style={labelStyles.$tagContent}>
          {tag.iconUrl && (
            <Image
              source={{ uri: tag.iconUrl }}
              style={{ width: 16, height: 16 }}
            />
          )}
          <Text style={labelStyles.$text}>{tag.text}</Text>
        </View>
      </AnimatedImageBackground>
    </Pressable>
  );
}

const labelStyles = createStyle({
  $text: {
    textAlign: 'center',
    color: '#FEFFCA',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 34,
    // 文字阴影
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  $activeText: {
    // width: '100%',
    textAlign: 'center',
    color: colors.black,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 32,
    // 文字阴影
    textShadowColor: 'white',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1
  },
  $labelBg: {
    position: 'absolute',
    top: 0,
    width: 100,
    height: 38
  },
  $activeLabelBg: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    height: 43
  },
  $tagContent: {
    ...$flexHCenter,
    alignSelf: 'center',
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
