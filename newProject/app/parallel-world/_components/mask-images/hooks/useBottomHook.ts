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

export default function useBottomHook({ cur, height, width }: IMaskHook) {
  const startPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M 0 ${height - cur.value}
                            L ${width} ${height - cur.value - DIFF_DISTANCE}
                            L ${width} ${height}
                            L 0 ${height} Z`;
    return {
      d
    };
  });

  const endPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M 0 0
                                L ${width} 0
                                L ${width} ${height - cur.value - DIFF_DISTANCE - SPACE}
                                L 0 ${height - cur.value - SPACE} Z`;
    return {
      d
    };
  });

  return { startPathProps, endPathProps };
}
