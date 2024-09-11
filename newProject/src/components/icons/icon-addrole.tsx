import Svg, { G, Path } from 'react-native-svg';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import { styles } from '@Utils/styles';
import { type IconProp, getProps } from './utils';

const source = require('@Assets/icon/icon-addrole.png');

const st = StyleSheet.create({
  $icon: {
    width: 19,
    height: 19
  }
});

export function IconAddRole(props: IconProp) {
  return <Image source={source} style={styles(st.$icon, props.style)} />;
}
