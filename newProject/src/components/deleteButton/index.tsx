import { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { Button } from '../button';
import { showConfirm } from '../confirm';

interface DeleteButtonProps {
  onPress: (cb: () => void) => void;
  style?: ViewStyle;
  height?: number;
}
const $style: ViewStyle = {
  borderRadius: 500,
  backgroundColor: StyleSheet.hex('#432929', 0.3)
};
const $buttonStyle: TextStyle = {
  color: StyleSheet.currentColors.red,
  fontSize: 14,
  fontWeight: '600'
};
export function DeleteButton(props: DeleteButtonProps) {
  return (
    <Button
      style={[
        $style,
        props.height ? { height: props.height } : null,
        props.style
      ]}
      // textStyle={{ height: 40, lineHeight: 40, padding: 0 }}
      iconText="makephoto_delete"
      textStyle={[
        $buttonStyle,
        props.height ? { height: props.height, lineHeight: props.height } : null
      ]}
      onPress={onPress}
    >
      删除
    </Button>
  );

  function onPress() {
    showConfirm({
      title: '确认删除图片？',
      confirmText: '确认',
      cancelText: '取消',
      onConfirm: ({ close }) => {
        props.onPress(close);
      }
    });
  }
}
