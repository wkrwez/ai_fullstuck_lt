import { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';

const $settingGroup: ViewStyle = {
  borderRadius: 10,
  overflow: 'hidden',
  margin: 16,
  marginTop: 0
};

interface SettingGroupProps {
  children?: ReactNode;
  style?: ViewStyle;
}

export function SettingGroup(props: SettingGroupProps) {
  return (
    <View style={[$settingGroup, props.style]}>
      <>{props.children}</>
    </View>
  );
}
