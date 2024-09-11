import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import { currentColors } from '@/src/theme';
import { StyleSheet } from '@/src/utils';
import { Image } from '@Components/image';
import { Text } from '@Components/text';

const iconCrownUrl = require('@Assets/icon/icon-crown.png');
interface CrownTextProps {
  children?: React.ReactNode;
}

const st = StyleSheet.create({
  $iconWrapStyle: {
    width: 17,
    height: 17,
    position: 'relative',
    paddingRight: 25,
    marginRight: 3
  },
  $iconStyle: {
    position: 'relative',
    top: 0,
    width: 30,
    height: 41
  },
  $wrapStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    left: -7,
    marginTop: 9
  },
  $textStyle: {
    fontSize: 12,
    color: currentColors.white
  }
});

export function CrownText(props: CrownTextProps) {
  return (
    <View style={st.$wrapStyle}>
      <View style={st.$iconWrapStyle}>
        <Image source={iconCrownUrl} style={st.$iconStyle}></Image>
      </View>
      <Text style={st.$textStyle} numberOfLines={1} preset="bold">
        {props.children}
      </Text>
    </View>
  );
}
