import { useMemo } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useConfigStore } from '@/src/store/config';
import { StyleSheet, dp2px } from '@/src/utils';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { useShallow } from 'zustand/react/shallow';

/** interface */
interface RoleProp {
  id: string;
  size?: number;
  iconStyle?: StyleProp<ViewStyle>;
  nameStyle?: StyleProp<TextStyle>;
}
/** interface end */

export function Role(props: RoleProp) {
  const { roleMap } = useConfigStore(
    useShallow(state => ({ roleMap: state.roleMap }))
  );

  const roleData = roleMap && roleMap[props.id];

  if (!roleData) {
    // 角色不存在于配置中
    return null;
  }

  const px = useMemo(() => {
    return dp2px(props.size || 54);
  }, [props.size]);

  return (
    <View style={{ width: px }}>
      <View style={[getAvatarStyle(props), st.$wrap, props.iconStyle]}>
        <Image
          style={StyleSheet.imageFullStyle}
          source={roleData.icon}
          tosSize="size6"
        />
      </View>
      <View
        style={[
          st.$textWrap,
          {
            transform: [{ translateX: (px - dp2px(70)) / 2 }]
          }
        ]}
      >
        <Text style={[st.$text, props.nameStyle]}>{roleData.name}</Text>
      </View>
    </View>
  );

  function getAvatarStyle({ size }: RoleProp) {
    return {
      ...StyleSheet.circleStyle,
      width: px,
      height: px
    };
  }
}

/** styles */
const st = StyleSheet.create({
  $wrap: {
    borderWidth: 2,
    borderColor: StyleSheet.currentColors.white
  },
  $textWrap: {
    width: 70
  },
  $text: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 18,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.87)
  }
});
/** styles end */
