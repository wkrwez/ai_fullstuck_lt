import { FC } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { styles } from '@/src/utils';
import { IconChecked } from '../../icons';

const $container: ViewStyle = {
  width: 60,
  height: 60,
  borderWidth: 3,
  borderRadius: 30,
  borderColor: 'rgb(127, 181, 234)',
  alignItems: 'center',
  justifyContent: 'center',
  left: '50%',
  bottom: 35,
  transform: [{ translateX: -30 }],
  position: 'absolute'
};

type TDoneSelectionIcon = {
  style?: ViewStyle;
  onPress?: (...args: any[]) => any;
};

export const DoneSelectionIcon: FC<TDoneSelectionIcon> = props => {
  return (
    <TouchableOpacity
      style={styles($container, props?.style)}
      onPress={props?.onPress}
    >
      <IconChecked
        style={{ marginTop: 5 }}
        width={30}
        height={30}
      ></IconChecked>
    </TouchableOpacity>
  );
};
