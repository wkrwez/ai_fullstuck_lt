import { useMemoizedFn } from 'ahooks';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { AnimationDir } from './hooks/types';
import useDirHook from './hooks/useDirHook';
import { MaskImageitem } from './Item';

const IMG_WIDTH = 300;
const IMG_HEIGHT = 400;

const nextAnimations = [AnimationDir.right, AnimationDir.bottom];
const prevAnimations = [AnimationDir.top, AnimationDir.left];

enum SwitchType {
  prev = 'prev',
  next = 'next'
}
export interface MaskSize {
  width: number;
  height: number;
}

const defaultImgSize: MaskSize = {
  width: IMG_WIDTH,
  height: IMG_HEIGHT
};
interface Props {
  active: number;
  onChange?: (idx: number) => void;
  onLoaded?: () => void;
  sourceList: string[];
  size?: MaskSize;
}

export interface MaskImagesRef {
  prev: () => void;
  next: () => void;
}

const MaskImages = forwardRef<MaskImagesRef, Props>(
  ({ active, onChange, sourceList, size = defaultImgSize, onLoaded }, ref) => {
    // SVG的path初始化有点问题，先在这里修改【TODO】
    const curX = useSharedValue(-150);
    const curY = useSharedValue(-150);

    const [imgIdxList, setImgIdxList] = useState<number[]>([
      active - 1,
      active,
      active + 1
    ]);
    const [animationImgMap, setAnimationImgMap] = useState<{
      [i: number]: SwitchType;
    }>({ [active]: SwitchType.prev, [active + 1]: SwitchType.next });

    const isLoaded = useRef(false);

    const handleLoaded = () => {
      if (!isLoaded.current) {
        isLoaded.current = true;
        onLoaded && onLoaded();
      }
    };

    const swipeDirRef = useRef(AnimationDir.left);

    // 不顿一下的动效
    const changeCurValue = () => {
      // 多给点动画的余量，作延迟
      curX.value = -400;
      curX.value = withSequence(
        withTiming(-100, {
          duration: 100
        }),
        withTiming(size.width, {
          duration: 1000
        })
      );

      curY.value = -400;
      curY.value = withSequence(
        withTiming(-100, {
          duration: 100
        }),

        withTiming(size.height, {
          duration: 1000
        })
      );
    };

    // 顿一下的动效
    // const changeCurValue = () => {
    //   // 多给点动画的余量，作延迟
    //   curX.value = -300;
    //   curX.value = withSequence(
    //     withTiming(100, { duration: 400, easing: Easing.out(Easing.quad) }),
    //     withTiming(size.width, {
    //       duration: 600,
    //       easing: Easing.in(Easing.quad)
    //     })
    //   );
    //   curY.value = -300;
    //   curY.value = withSequence(
    //     withTiming(100, { duration: 400, easing: Easing.out(Easing.quad) }),
    //     withTiming(size.height, {
    //       duration: 600,
    //       easing: Easing.in(Easing.quad)
    //     })
    //   );
    // };

    const next = useMemoizedFn(() => {
      const newActive = active + 1;

      swipeDirRef.current = nextAnimations[newActive % 2];

      const newAnimationMap = {
        [newActive - 1]: SwitchType.prev,
        [newActive]: SwitchType.next
      };

      const newIdxList = imgIdxList.map(idx =>
        newAnimationMap[idx] ? idx : newActive + 1
      );

      onChange && onChange(newActive);

      // setSourceState(SwitchType.next);
      setImgIdxList(newIdxList);
      setAnimationImgMap(newAnimationMap);

      changeCurValue();
    });

    const prev = useMemoizedFn(() => {
      const newActive = active - 1;

      swipeDirRef.current = prevAnimations[newActive % 2];

      const newAnimationMap = {
        [active]: SwitchType.next,
        [newActive]: SwitchType.prev
      };
      const newIdxList = imgIdxList.map(idx =>
        newAnimationMap[idx] ? idx : newActive - 1
      );
      onChange && onChange(newActive);

      // setSourceState(SwitchType.prev);
      setImgIdxList(newIdxList);
      setAnimationImgMap(newAnimationMap);

      changeCurValue();
    });

    useImperativeHandle(ref, () => ({
      prev,
      next
    }));

    // 初始化跳过第一张的动画
    useEffect(() => {
      curX.value = size.width;
      curY.value = size.height;
    }, []);

    const { startPathProps, endPathProps } = useDirHook({
      dir: swipeDirRef.current,
      cur:
        swipeDirRef.current === AnimationDir.left ||
        swipeDirRef.current === AnimationDir.right
          ? curX
          : curY,
      height: size.height,
      width: size.width
    });

    const { $shakeStyle } = useShakeStyle({ size: size });

    return (
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        {imgIdxList.map(idx => {
          return (
            <MaskImageitem
              key={sourceList[idx]}
              source={sourceList[idx]}
              aStyle={$shakeStyle}
              size={size}
              pathProps={active === idx ? startPathProps : endPathProps}
              onLoaded={handleLoaded}
              style={animationImgMap[idx] ? {} : { opacity: 0 }}
            />
          );
        })}

        {/* <View style={{ position: 'absolute', zIndex: 100 }}>
          {imgIdxList.map(idx => {
            return (
              <Image
                key={idx}
                style={{
                  height: 80,
                  width: 60
                }}
                tosSize="size10"
                source={sourceList[idx]}
              />
            );
          })}
        </View> */}
      </View>
    );
  }
);

const SCALE_RATIO = 1.08;
const DISTANCE_RATIO = (SCALE_RATIO - 1) / 2;

const useShakeStyle = ({ size }: { size: MaskSize }) => {
  const { transDistanceX, transDistanceY } = useMemo(() => {
    const transDistanceX = size.width * DISTANCE_RATIO;
    const transDistanceY = size.height * DISTANCE_RATIO;
    return { transDistanceX, transDistanceY };
  }, [size]);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const $shakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value - transDistanceY },
      { scale: SCALE_RATIO }
    ]
  }));

  useEffect(() => {
    translateX.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(-transDistanceX, { duration: size.width * 10 }),
          withTiming(transDistanceX, { duration: size.width * 10 })
        ),
        -1,
        true
      )
    );
    translateY.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(-transDistanceY, { duration: size.height * 10 }),
          withTiming(transDistanceY, { duration: size.height * 10 })
        ),
        -1,
        true
      )
    );
  }, []);

  return { $shakeStyle };
};

export { MaskImages, AnimationDir };
