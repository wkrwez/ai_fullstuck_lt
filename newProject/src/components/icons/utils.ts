import Svg from 'react-native-svg';
import { colorsUI } from '@/src/theme';

const globalProps = {
  size: 24,
  fill: colorsUI.Icon.netutral.default,
};

export type IconProp = React.ComponentProps<typeof Svg> & {
  size?: number;
};

export function getProps(local: IconProp): IconProp {
  const { size, ...rest } = local;
  const { size: globalSize, ...globalRest } = globalProps;

  return {
    width: size || globalSize,
    height: size || globalSize,
    ...globalRest,
    ...rest,
  };
}
