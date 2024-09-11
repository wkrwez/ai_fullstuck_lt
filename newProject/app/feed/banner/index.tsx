import { ImageStyle, View, ViewStyle } from 'react-native';
import { Image } from '@/src/components';
import { $Z_INDEXES } from '@/src/theme/variable';
import { getScreenSize } from '@/src/utils';

const windowWidth = getScreenSize('width');
// const font = typography.fonts.feed

const SloganIcon = require('@Assets/image/feed/slogan.png');

export default function Banner() {
  // 配置位
  // const bannerText = '狸狸我啊，是个满级火影迷噢！'
  // const borderColors = ["#862D11", "#EA592B"]

  return (
    <View style={$banner}>
      <Image source={SloganIcon} style={$slogan} contentFit="cover"></Image>
    </View>
  );
}

const $banner: ViewStyle = {
  width: windowWidth,
  height: 60,
  position: 'absolute'
};

const $slogan: ImageStyle = {
  height: 40,
  width: 242,
  marginLeft: 36,
  marginTop: 24,
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  zIndex: $Z_INDEXES.z0
};
