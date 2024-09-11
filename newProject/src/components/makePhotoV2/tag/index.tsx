import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { colors } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Loading } from '@Components/promptLoading';
import { Text } from '@Components/text';
import { showToast } from '../../toast';
import { PromptType } from '../constant';
import { useShallow } from 'zustand/react/shallow';

const TAG_BG = require('@Assets/makephoto/tag_arrow.png');

const $tagCont: ViewStyle = {
  overflow: 'hidden',
  ...StyleSheet.rowStyle
};
const $tagWrap: ViewStyle = {
  ...StyleSheet.rowStyle,
  position: 'relative',
  backgroundColor: StyleSheet.hex('#ffffff', 0.5),
  borderTopRightRadius: 10,
  borderBottomRightRadius: 10,
  flex: 0
};
const $tagText: TextStyle = {
  color: StyleSheet.hex('#005A9C', 0.4),
  fontSize: 14,
  fontWeight: '500',
  lineHeight: 32,
  maxWidth: 65
};

type TagProps = {
  text: string;
  loading?: boolean;
};
export function Tag(props: TagProps) {
  const { pageState } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      additionPrompts:
        state.selectedRoleIndex === 0
          ? state.additionPrompts
          : state.additionPrompts2
    }))
  );

  if (props.loading) {
    return (
      <View style={$tagCont}>
        <Image
          source={TAG_BG}
          style={{ width: 14, height: 32, opacity: 0.5 }}
        />
        <View style={[$tagWrap, { height: 32, width: 70, paddingLeft: 15 }]}>
          <Loading style={{ opacity: 0.5 }} />
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={$tagCont} onPress={onSelect}>
      <Image source={TAG_BG} style={{ width: 14, height: 32, opacity: 0.5 }} />
      <View style={$tagWrap}>
        <Text style={$tagText} numberOfLines={1} ellipsizeMode="tail">
          {props.text}
        </Text>
        <Icon
          style={{ marginLeft: 4, marginRight: 4 }}
          icon="makephoto_add_full"
          size={16}
        />
      </View>
    </TouchableOpacity>
  );

  function onSelect() {
    if (pageState === PageState.promptselect) return;
    const { addPrompt, additionPrompts, additionPrompts2, selectedRoleIndex } =
      useMakePhotoStoreV2.getState();
    const currentAdditionPrompts =
      selectedRoleIndex === 0 ? additionPrompts : additionPrompts2;
    if (currentAdditionPrompts.length >= 5) {
      showToast('最多添加5个细节');
      return;
    }
    if (currentAdditionPrompts.includes(props.text)) {
      showToast('该细节已添加');
      return;
    }
    addPrompt(PromptType.addition, {
      type: 'custom',
      text: props.text
    });
  }
}
