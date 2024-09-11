import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Text } from '@Components/text';

interface BtnSaveEmojiProps {
  isSaved: boolean;
  style?: StyleProp<ViewStyle>;
  onSave: () => {};
  tip?: string;
}
export function BtnSaveEmoji(props: BtnSaveEmojiProps) {
  return (
    <TouchableOpacity
      disabled={props.isSaved}
      style={[
        StyleSheet.rowStyle,
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          paddingHorizontal: 13,
          paddingVertical: 9,
          borderRadius: 5
        },
        props.style
      ]}
      onPress={props.onSave}
    >
      <View
        style={[
          StyleSheet.rowStyle,
          {
            alignItems: 'center',
            gap: 4
          },
          props.isSaved && styles.$saved
        ]}
      >
        <Icon icon={props.isSaved ? 'emoji_added' : 'emoji_add'} size={16} />
        <Text style={styles.$btnText}>
          {props.isSaved ? '已添加到表情' : '添加到表情'}
        </Text>
      </View>
      {props.tip && <Text style={styles.$texttip}>{props.tip}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  $btnText: {
    fontSize: 13,
    fontWeight: '600',
    color: StyleSheet.currentColors.white
  },
  $texttip: {
    fontSize: 10,
    fontWeight: '400',
    color: StyleSheet.currentColors.white
  },
  $saved: {
    opacity: 0.3
  }
});
