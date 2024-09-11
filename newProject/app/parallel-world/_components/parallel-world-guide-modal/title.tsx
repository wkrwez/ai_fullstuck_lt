import { View } from 'react-native';
import { StyleSheet, dp2px } from '@/src/utils';
import { Image } from '@Components/image';

const TITLE_BG_IMG = require('@Assets/image/parallel-world/title_bg.png');
const ROT_IMG = require('@Assets/apng/icon_rotating.gif');
const LIGHTING_IMG = require('@Assets/apng/icon-ligntning.png');
const st = StyleSheet.create({
  $titleBg: {
    position: 'absolute',
    top: 14,
    left: 49,
    width: 111,
    height: 35
  },
  $rot: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 8,
    left: 8
  },
  $lightning: {
    position: 'absolute',
    top: -20,
    left: -10,
    width: 105,
    height: 50
  }
});
export default function Title() {
  return (
    <View style={st.$titleBg}>
      <Image source={TITLE_BG_IMG} style={{ width: '100%', height: '100%' }} />
      <Image source={ROT_IMG} style={st.$rot} />
      <Image source={LIGHTING_IMG} style={st.$lightning} />
    </View>
  );
}
