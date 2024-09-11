import LottieView from 'lottie-react-native';
import { LegacyRef, memo, useEffect, useRef, useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { $FEED_COLORS, $Z_INDEXES } from '@/src/theme/variable';
import { reportClick } from '@/src/utils/report';

interface IAffixProps {
  position: number[]; // 按照 css 4 个 top\right\bottom\left 设定
  touchEndHandler: () => void;
}

export const LOTTIE_FEED_STATIC = require('@Assets/lottie/feed_create_static.json');
export const LOTTIE_FEED_CREATE = require('@Assets/lottie/feed_create_click.json');

function AffixComponent({ position, touchEndHandler }: IAffixProps) {
  console.log('Redner Affix');
  const lottieRefA = useRef<LottieView>(null);
  const lottieRefB = useRef<LottieView>(null);
  const { loginIntercept } = useAuthState();

  const scenes = [
    {
      lottieFile: LOTTIE_FEED_STATIC,
      lottie: (ref: LegacyRef<LottieView>) => {
        return (
          <LottieView
            ref={ref}
            loop={true}
            style={$affix}
            source={LOTTIE_FEED_STATIC}
          />
        );
      }
    },
    {
      lottieFile: LOTTIE_FEED_CREATE,
      lottie: (ref: LegacyRef<LottieView>) => {
        return (
          <LottieView
            ref={ref}
            loop={false}
            style={$affix}
            source={LOTTIE_FEED_CREATE}
          />
        );
      }
    }
  ];

  useEffect(() => {
    lottieRefA.current?.forceUpdate();
    lottieRefA.current?.play(0);
  }, []);

  const [beRedirect, setBeRedirect] = useState(false);

  const rippleValue = useSharedValue(1);

  const switchLottie = () => {
    reportClick('publish');

    loginIntercept(
      () => {
        // todo 暂时从这里拦截，不然动画卡的不行
        // setBeRedirect(() => true);
        // ripple
        // rippleValue.value = withTiming(1000, {
        //   duration: 1200,
        //   easing: Easing.out(Easing.ease)
        // });

        // mock
        // setTimeout(() => {
        // rippleValue.value = withTiming(0, {
        //   duration: 400,
        //   easing: Easing.out(Easing.ease)
        // });
        // setBeRedirect(false);
        // }, 1500);

        touchEndHandler();
      },
      { scene: LOGIN_SCENE.TO_CREATE }
    );
  };

  useEffect(() => {
    if (beRedirect) {
      lottieRefA.current?.reset();
      lottieRefB.current?.forceUpdate();
      lottieRefB.current?.play(0);
    }
  }, [beRedirect]);

  const $rippleAnimateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: rippleValue.value
        }
      ]
    };
  });

  return (
    <Pressable
      onPress={switchLottie}
      style={[$affixContainer, { right: position[1], bottom: position[2] }]}
    >
      <View style={[$affix]}>
        {beRedirect
          ? scenes[1].lottie(lottieRefB)
          : scenes[0].lottie(lottieRefA)}
      </View>
      <Animated.View
        style={[
          $ripple,
          $rippleAnimateStyle,
          { right: position[1] + 16, bottom: position[2] - 67 }
        ]}
      ></Animated.View>
    </Pressable>
  );
}

const $affixContainer: ViewStyle = {
  width: 80,
  height: 98,
  position: 'absolute',
  zIndex: $Z_INDEXES.z1000
};

const $affix: ViewStyle = {
  flex: 1,
  zIndex: $Z_INDEXES.z1000
};

const $ripple: ViewStyle = {
  position: 'absolute',
  width: 2,
  height: 2,
  borderRadius: 1,
  zIndex: $Z_INDEXES.z500,
  backgroundColor: $FEED_COLORS.rippleColor
};

const Affix = memo(AffixComponent, (prev, now) => {
  if (prev.position.join(',') === now.position.join(',')) return true;
  return false;
});

export default Affix;
