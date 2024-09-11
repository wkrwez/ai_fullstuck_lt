import React from 'react';
import { ImageStyle, StyleProp, Text, View } from 'react-native';
import { Image } from '@/src/components';
import { colors } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { createCircleStyle } from '../../../../src/theme/variable';
import { AVATAR_SIZE, parallelWorldColors } from '../../_constants';

const DEFAULT_ATATAR = require('@Assets/user/default_avatar.png');

export default function UserDisplay({
  text = '',
  uri,
  avatarStyle: $avatarStyleOverwrite = {}
}: {
  text?: string;
  uri?: string;
  avatarStyle?: StyleProp<ImageStyle>;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
      <Image
        source={uri ? { uri } : DEFAULT_ATATAR}
        style={[styles.$avatar, $avatarStyleOverwrite]}
      />
      <Text style={styles.$text} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

const styles = createStyle({
  $enterNewWorldPlaceHolder: {
    color: parallelWorldColors.fontGlow,
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 24
  },
  $avatar: {
    ...createCircleStyle(AVATAR_SIZE),
    borderWidth: 1,
    borderColor: colors.white
  },
  $text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    maxWidth: 120
  }
});
