import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Path, PathProps, Svg } from 'react-native-svg';
import { Image } from '@Components/image';
import { DIFF_DISTANCE, IMaskHook, SPACE } from './types';

export default function useRightHook({ cur, height, width }: IMaskHook) {
  const startPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M ${width - cur.value} 0
                            L ${width} 0
                            L ${width} ${height}
                            L ${width - cur.value - DIFF_DISTANCE} ${height} Z`;
    return {
      d
    };
  });

  const endPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M 0 0
                                L ${width - cur.value - SPACE} 0
                                L ${width - cur.value - DIFF_DISTANCE - SPACE} ${height}
                                L 0 ${height} Z`;
    return {
      d
    };
  });

  return { startPathProps, endPathProps };
}
