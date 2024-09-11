import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutUp
} from 'react-native-reanimated';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { colors } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { PromptType } from '../constant';

const TAG_BG = require('@Assets/makephoto/tag_arrow.png');

const $tagCont: ViewStyle = {
  overflow: 'hidden',
  ...StyleSheet.rowStyle,
  marginBottom: 8,
  opacity: 0.7
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
  color: '#005A9C',
  fontSize: 14,
  fontWeight: '500',
  lineHeight: 32,
  maxWidth: 150
};

type TagProps = {
  text: string;
};

export function SelectedTag(props: TagProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View style={$tagCont}>
        <Image
          source={TAG_BG}
          style={{ width: 14, height: 32, opacity: 0.5 }}
        />
        <View style={$tagWrap}>
          <TouchableOpacity onPress={onInput}>
            <Text style={$tagText} numberOfLines={1} ellipsizeMode="tail">
              {props.text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemove}>
            <Icon
              style={{ marginLeft: 4, marginRight: 4 }}
              icon="makephoto_remove"
              size={16}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  function onRemove() {
    useMakePhotoStoreV2
      .getState()
      .removePrompt(PromptType.addition, props.text);
  }

  function onInput() {
    useMakePhotoStoreV2
      .getState()
      .changeBottomInputShow(true, PromptType.addition, props.text);
  }
}
