import { View } from 'react-native';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';

const MOCK_IMG1 = require('@Assets/mock/img1.jpg');
export function EmojiPreview() {
  return (
    <View style={st.$container}>
      <Image source={MOCK_IMG1} style={{ width: '100%', height: '100%' }} />
      <View style={st.$textWrap}>
        <Text style={[st.$textBasic]}>摸了</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  $container: {
    position: 'relative',
    width: 288,
    height: 288
  },
  $textBasic: {
    fontFamily: 'PingFang SC',
    textAlign: 'center',
    fontSize: 18,
    position: 'absolute',
    height: 58,
    width: '100%'
  },
  $textWrap: {
    position: 'absolute',
    bottom: 208,
    left: 0,
    right: 0
  }
});
