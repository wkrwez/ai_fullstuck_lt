import { StyleSheet } from '@/src/utils';
import { Image, ImageStyle } from '@Components/image';

const iconUrl = require('@Assets/icon/icon-preview.png');

interface IconPreviewProps {
  style?: ImageStyle;
}
const st = StyleSheet.create({
  $iconDefaultStyle: {
    width: 12,
    height: 12
  }
});
export function IconPreview(props: IconPreviewProps) {
  return (
    <Image source={iconUrl} style={st.$iconDefaultStyle} {...props}></Image>
  );
}
