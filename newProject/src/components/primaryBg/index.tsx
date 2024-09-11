import { ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { currentColors } from '@/src/theme';

interface PrimaryBgProps {
  style?: ViewStyle;
  children?: React.ReactNode;
}

export function PrimaryBg(props: PrimaryBgProps) {
  const { children, ...rest } = props;
  return (
    <LinearGradient
      colors={[currentColors.brand1, currentColors.brand2]}
      {...rest}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      locations={[0, 1]}
    >
      {children}
    </LinearGradient>
  );
}
