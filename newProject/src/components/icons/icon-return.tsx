import { ImageStyle } from 'react-native';
import { Image } from '@Components/image';

const ICON = require('@Assets/icon/icon-return.png');

type IconProps = {
  style?: ImageStyle;
};
export const IconReturn = (props: IconProps) => {
  const { style, ...others } = props;
  return (
    <Image source={ICON} style={[{ width: 20, height: 20 }, props.style]} />
  );
};
