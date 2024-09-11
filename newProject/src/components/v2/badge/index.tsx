import { ReactNode } from 'react';
import {
  Pressable,
  PressableProps,
  TouchableOpacityProps,
  View,
  ViewStyle
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { $flex, $flexHStart } from '@/src/theme/variable';

interface IBadgeProps extends PressableProps {
  medal: ReactNode;
  type?: 'linear';
  title: ReactNode;
  tail?: ReactNode;
  linearColors?: string[];
  $customBadgeStyle?: ViewStyle;
}

export default function Badge({
  medal,
  type = 'linear',
  title,
  tail,
  linearColors = ['rgba(245, 245, 245, 0.60)', 'rgba(245, 245, 245, 0.05)'],
  $customBadgeStyle,
  ...props
}: IBadgeProps) {
  return (
    <LinearGradient
      colors={linearColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[$badge, $customBadgeStyle]}
    >
      <Pressable style={$flex} onPress={props?.onPress}>
        <View style={[$flex, $flexHStart]}>
          <View style={$medal}>{medal}</View>
          <View style={$body}>{title}</View>
          {tail && <View style={$tail}>{tail}</View>}
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const $badge: ViewStyle = {
  ...$flex,
  ...$flexHStart,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8
};

const $medal: ViewStyle = {
  width: 20,
  height: 20,
  marginRight: 8
};

const $body: ViewStyle = {
  flex: 1,
  justifyContent: 'center'
};

const $tail: ViewStyle = {
  marginLeft: 8,
  alignItems: 'flex-end'
};
