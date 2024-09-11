import { View } from 'react-native';
import { colorsUI } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { Image } from '@Components/image';
import { Text } from '@Components/text';

const xiaoli = require('@Assets/emoji/icon-toast.png');
export const XiaoliToast = () => (
  <View style={[StyleSheet.rowStyle, { gap: 5 }]}>
    <Text
      style={{
        color: colorsUI.Text.default.inverse,
        fontSize: 14,
        lineHeight: 20
      }}
    >
      已添加成功~
    </Text>
    <Image
      source={xiaoli}
      style={{ width: 32, height: 24, resizeMode: 'contain' }}
    />
  </View>
);
