import { useAnimatedProps } from 'react-native-reanimated';
import { PathProps } from 'react-native-svg';
import { DIFF_DISTANCE, IMaskHook, SPACE } from './types';

export default function useLeftHook({ cur, height, width }: IMaskHook) {
  const startPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M 0 0
                            L ${cur.value + DIFF_DISTANCE} 0
                            L ${cur.value} ${height}
                            L 0 ${height} Z`;
    return {
      d
    };
  });

  const endPathProps = useAnimatedProps<PathProps>(() => {
    const d = `M ${cur.value + DIFF_DISTANCE + SPACE} 0
                                L ${width} 0
                                L ${width} ${height}
                                L ${cur.value + SPACE} ${height} Z`;
    return {
      d
    };
  });

  return { startPathProps, endPathProps };
}
