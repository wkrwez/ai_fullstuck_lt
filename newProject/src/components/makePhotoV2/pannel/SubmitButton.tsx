import * as Haptics from 'expo-haptics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useBrandStore } from '@/src/store/brand';
import { useCreditStore } from '@/src/store/credit';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { InvokeType } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { reportMakePhotoTrack } from '@/src/utils/report';
import { Image } from '@Components/image';
import { BlueButton } from '@Components/makePhotoV2/button';
import { showToast } from '@Components/toast';
import { StyleSheet } from '@Utils/StyleSheet';
import {
  ANIMATE_TIME,
  ElementSuffix,
  MakePhotoEvents,
  PAGE_TOP,
  PromptType
} from '../constant';
import { GameType } from '@/proto-registry/src/web/raccoon/common/types_pb';
import { useShallow } from 'zustand/react/shallow';

const $detailButtonStyle = StyleSheet.createRectStyle({
  marginTop: 100,
  left: 127,
  right: 127,
  height: 50,
  bottom: 35
});
// const $pannelStyle = StyleSheet.createRectStyle({
//     marginTop: PAGE_TOP,
//     left: 18,
//     right: 18,
//     top: PANNEL_TOP,
//     bottom: 15
// });

const NEXT_BUTTON = require('@Assets/makephoto/btn-next.png');

export function SubmitButton() {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const { pageState, promptLoading } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      promptLoading: state.promptLoading
    }))
  );

  if (pageState === PageState.diy) {
    return (
      <Animated.View
        entering={FadeIn.duration(ANIMATE_TIME)}
        exiting={FadeOut.duration(ANIMATE_TIME)}
        style={[
          $detailButtonStyle,
          {
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            top:
              ($detailButtonStyle.top || 0) -
              Number($containerInsets.paddingBottom || 0)
          }
        ]}
      >
        {/* <BlueButton
          onPress={onPress}
          width={$detailButtonStyle.width}
          height={$detailButtonStyle.height}
        >
          确认细节
        </BlueButton> */}
        <TouchableOpacity
          disabled={promptLoading}
          onPress={onPress}
          style={{ width: 123, height: 50 }}
        >
          <Image
            source={NEXT_BUTTON}
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
  return null;

  async function onPress() {
    const {
      changePageState,
      promptGenerateType
      // takePhoto,
      // presetPrompts,
      // presetPrompts2,
      // selectedRoleIndex
    } = useMakePhotoStoreV2.getState();

    reportMakePhotoTrack(
      MakePhotoEvents.ai_prompt_image_generate,
      PageState.promptselect,
      ElementSuffix.ai_prompt,
      {
        type: promptGenerateType
      }
    );
    Haptics.impactAsync();
    // const keys = [
    //   PromptType.expression,
    //   PromptType.cloth,
    //   PromptType.action,
    //   PromptType.scene
    // ];
    // const currentPresetPrompts =
    //   selectedRoleIndex === 0 ? presetPrompts : presetPrompts2;
    // const error = ['请完善表情~', '请完善服饰~', '请完善动作~', '请完善场景~'];
    // const isValid = keys.every((i, index) => {
    //   if (!currentPresetPrompts[i]) {
    //     showToast(error[index]);
    //     return false;
    //   }
    //   return true;
    // });
    // if (!isValid) return;

    changePageState(PageState.styleselect);
  }
}
