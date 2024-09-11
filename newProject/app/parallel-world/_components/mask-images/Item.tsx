import { MaskSize } from '.';
import { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  AnimatedProps,
  FadeIn,
  FadeOut,
  useAnimatedStyle
} from 'react-native-reanimated';
import { Path, PathProps, Svg } from 'react-native-svg';
import { PlatformStr, getPlatformStr } from '@/src/store/message';
import { Image } from '@Components/image';
import { AnimationDir } from './hooks/types';
import MaskedView from '@step.ai/masked-view';

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Platform = PlatformStr | 'others';

interface Props {
  pathProps: Partial<AnimatedProps<PathProps>>;
  source: string;
  aStyle: ReturnType<typeof useAnimatedStyle>;
  size: MaskSize;
  onLoaded?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function MaskImageitem(props: Props) {
  const { size, style: $style = {}, onLoaded } = props;

  const [androidPlatform, setAndroidPlatform] = useState<Platform>();

  const initPlatformStr = async () => {
    const platformStr = (await getPlatformStr()) ?? 'others';
    setAndroidPlatform(platformStr);
  };

  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    initPlatformStr();
  }, []);

  return (
    <Animated.View style={[props.aStyle]}>
      <MaskedView
        androidRenderingMode="software"
        androidFreshMode={androidPlatform === 'huawei' ? 'force' : null} // TODO
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            ...size
          },
          $style
        ]}
        maskElement={
          <Svg {...size}>
            <AnimatedPath animatedProps={props.pathProps} />
          </Svg>
        }
      >
        <View style={{ overflow: 'hidden' }}>
          <Image
            source={props.source}
            style={{ width: '100%', height: '100%' }}
            tosSize="size1"
            onLoad={() => {
              setIsLoad(true);
              onLoaded && onLoaded();
            }}
          />
          {!isLoad && (
            <Animated.View
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(500)}
            >
              <Image
                source={props.source}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%'
                }}
                tosSize="size10"
              />
            </Animated.View>
          )}
        </View>
      </MaskedView>
    </Animated.View>
  );
}
