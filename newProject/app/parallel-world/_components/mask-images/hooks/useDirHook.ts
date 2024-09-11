import { DIFF_DISTANCE, IMaskHook, SPACE } from './types';
import { AnimationDir } from './types';
import useBottomHook from './useBottomHook';
import useLeftHook from './useLeftHook';
import useRightHook from './useRightHook';
import useTopHook from './useTopHook';

export default function useDirHook({ dir, ...others }: IMaskHook) {
  switch (dir) {
    case AnimationDir.left:
      return useLeftHook(others);
    case AnimationDir.right:
      return useRightHook(others);
    case AnimationDir.top:
      return useTopHook(others);
    default:
      return useBottomHook(others);
  }
}
