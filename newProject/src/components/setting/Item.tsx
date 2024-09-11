import { FC, ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { colorsUI } from '@/src/theme';
import { StyleSheet } from '@Utils/StyleSheet';
import { Icon, IconProps } from '../icons';
import { Text } from '../text';

export interface ISettingItemProps {
  title: string;
  leftIcon: IconProps['icon'] | '';
  rightIcon?: IconProps['icon'] | '';
  style?: StyleProp<ViewStyle>;
  rightContent?: ReactNode;
  onPress?: () => void;
  children?: ReactNode;
}

export const SettingItem: FC<ISettingItemProps> = props => {
  const {
    style,
    title,
    onPress,
    leftIcon,
    rightContent,
    rightIcon = 'setting_arrow_right',
    children
  } = props;
  return (
    <Pressable onPress={onPress}>
      {params => {
        return (
          <View
            key={props.leftIcon}
            style={[
              {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 20,
                height: 58,
                backgroundColor: StyleSheet.currentColors.white
                // backgroundColor: params.pressed
                //   ? colorsUI.Card.white.pressed
                //   : 'transparent',
              },
              style
            ]}
          >
            <View
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              {!!leftIcon && (
                <Icon
                  size={24}
                  style={{ marginRight: 12 }}
                  icon={leftIcon}
                ></Icon>
              )}
              <Text
                style={{
                  color: StyleSheet.currentColors.title,
                  fontSize: 15,
                  lineHeight: 26,
                  fontWeight: '500'
                }}
              >
                {title}
              </Text>
            </View>
            <View
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row'
              }}
            >
              {[children, rightContent]}
              {!!rightIcon && (
                <Icon
                  size={20}
                  icon={rightIcon}
                  style={{ marginLeft: 5 }}
                ></Icon>
              )}
            </View>
          </View>
        );
      }}
    </Pressable>
  );
};
