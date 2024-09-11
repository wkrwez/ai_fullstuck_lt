import { ReactNode } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { useScreenSize } from '@/src/hooks';
import { styles } from '@Utils/styles';

// const { width, height } = Dimensions.get('window');

interface FullScreenProps {
  style?: ViewStyle;
  children: ReactNode;
}
export function FullScreen(props: FullScreenProps) {
  const { width, height } = useScreenSize();
  return (
    <View style={styles(props.style, { width, height })}>{props.children}</View>
  );
}
