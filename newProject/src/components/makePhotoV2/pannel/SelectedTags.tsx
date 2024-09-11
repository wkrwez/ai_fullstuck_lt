import { View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut
} from 'react-native-reanimated';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { SelectedTag } from '../tag/SelectedTag';
import { useShallow } from 'zustand/react/shallow';
import { $potStyle } from './PotStyle';

export function SelectedTags() {
  const { list, pageState } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      list:
        state.selectedRoleIndex === 0
          ? state.additionPrompts
          : state.additionPrompts2
    }))
  );

  if (pageState !== PageState.diy && pageState !== PageState.promptselect) {
    return null;
  }

  return (
    <Animated.View
      exiting={FadeOut.duration(300)}
      style={{
        position: 'absolute',
        left: $potStyle.left,
        top: $potStyle.top
      }}
    >
      {(list || []).map((item, index) => (
        <SelectedTag key={item} text={item} />
      ))}
    </Animated.View>
  );
}
