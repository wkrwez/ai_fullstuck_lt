import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from '@Utils/StyleSheet';

const style = StyleSheet.currentColors;
const subset = style.subset.blue;

interface PrimaryBgProps {
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  dir?: 'top' | 'left' | 'topLeft';
}

const linearDir = {
  topLeft: { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  top: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  left: { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } }
};

export function BlueLinear(props: PrimaryBgProps) {
  const { children, ...rest } = props;
  return (
    <LinearGradient
      colors={
        props.dir === 'left'
          ? [subset.brand1, subset.brand2]
          : ['#E8F5FF', '#CAE8FF']
      }
      end={linearDir[props.dir || 'left'].end}
      start={linearDir[props.dir || 'left'].start}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}
