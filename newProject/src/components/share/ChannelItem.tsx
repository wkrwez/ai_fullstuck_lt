import React, { ReactNode } from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import { Icon, IconTypes } from '../icons';
import { Text } from '../text';
import { BasicChannelItem } from './basicChannelItem';
import { channels } from './channelConfig';
import { ChannelConfig, ShareType } from './typings';

export interface ChannelItemProps extends ChannelConfig {
  onPress?: () => void;
  itemStyle?: StyleProp<ViewStyle>;
  theme?: Theme;
  isLast?: boolean;
}

function ChannelIcon(props: ChannelItemProps) {
  // 优先取分享type
  if (props.type) {
    console.log('优先取删除type', props.type);
    if (channels[props.type].icon) {
      return (
        <Image
          style={{ width: 46, height: 46 }}
          source={channels[props.type].icon}
        />
      );
    } else {
      return <BasicChannelItem shareType={props.type} theme={props.theme} />;
    }
  }
  if (props.icon instanceof Function) {
    return props.icon(props.theme || Theme.LIGHT);
  }

  return <Icon {...(props.iconProps || {})} icon={props.icon as IconTypes} />;
}
export function ChannelItem(props: ChannelItemProps) {
  const themeConfig = getThemeColor(props.theme);

  return (
    <Pressable
      style={[props.itemStyle, props.isLast ? {} : { marginRight: 20 }]}
      onPress={onPress}
    >
      <ChannelIcon {...props} />
      <Text
        style={{
          fontSize: 11,
          textAlign: 'center',
          color: themeConfig.fontColor3,
          fontWeight: '500',
          marginTop: 4
        }}
      >
        {props.text || (props.type ? channels[props.type].text : '') || ''}
      </Text>
    </Pressable>
  );

  function onPress() {
    if (props.onPress) {
      props.onPress();
    }
  }
}
