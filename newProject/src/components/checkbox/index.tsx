import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
// import st from './style';
import { currentColors } from '@/src/theme';
import { styles } from '@/src/utils';
import { StyleSheet } from '@/src/utils';
import { Icon, IconChecked, IconTypes } from '@Components/icons';
import { PrimaryBg } from '../primaryBg';

interface CheckboxProps {
  style?: ViewStyle;
  checked?: boolean;
  size?: number;
  icon?: IconTypes;
  content?: () => ReactNode;
  hitSlop?: number;
}
export function Checkbox(props: CheckboxProps) {
  const { style, checked, size, icon, hitSlop } = props;

  const st = StyleSheet.create({
    $wrapStyle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size || 22,
      height: size || 22,
      borderRadius: 500,
      borderWidth: 1.5,
      borderColor: '#FFFFFF',
      backgroundColor: 'rgba(0,0,0,0.4)',
      overflow: 'hidden'
    },
    $checked: {
      borderWidth: 0,
      borderRadius: 500
    },
    $checkedBg: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: 500,
      borderColor: '#FFFFFF'
    }
  });
  return (
    <View
      style={styles(!checked && st.$wrapStyle, style, checked && st.$checked)}
    >
      {checked && <PrimaryBg style={st.$checkedBg} />}
      {checked &&
        (props.content ? (
          props.content()
        ) : (
          <Icon hitSlop={hitSlop} icon={icon || 'createChecked'} size={size} />
        ))}
    </View>
  );
}
