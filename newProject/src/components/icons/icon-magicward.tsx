import { StyleSheet } from '@/src/utils';
import { Image, ImageStyle } from '@Components/image';

const iconAI = require('@Assets/icon/icon-ai.png');

const st = StyleSheet.create({
  $iconAI: {
    width: 12,
    height: 12
  }
});

export function IconMagicWard() {
  return <Image style={st.$iconAI} source={iconAI}></Image>;
}
