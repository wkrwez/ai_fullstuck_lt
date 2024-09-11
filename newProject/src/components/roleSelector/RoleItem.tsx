import * as Haptics from 'expo-haptics';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { RoleItemType } from '@/src/types';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { Checkbox } from '@Components/checkbox';
import { CrownText } from '@Components/crownText';
import { Image } from '@Components/image';
import { PrimaryBg } from '@Components/primaryBg';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';

const SIZE = 72;
const st = StyleSheet.create({
  $primargBg: {
    ...StyleSheet.circleStyle,
    position: 'absolute',
    width: SIZE,
    height: SIZE
  },
  $selectedBg: {
    ...StyleSheet.circleStyle,
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    backgroundColor: '#343d4b'
  },
  $avatar: {
    ...StyleSheet.circleStyle,
    position: 'relative',
    top: 2,
    left: 2,
    width: SIZE - 4,
    height: SIZE - 4,
    overflow: 'hidden'
  },
  $text: {
    marginTop: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center'
  },
  $text2: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center'
  },
  $checkbox: {
    position: 'absolute',
    top: 2,
    right: 0,
    borderWidth: 0
  },
  $selectedMask: {
    ...StyleSheet.circleStyle,
    ...StyleSheet.centerStyle,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.7),
    position: 'absolute',
    width: SIZE,
    height: SIZE
  },
  $selectText: {
    fontSize: 14,
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.8)
  }
});

export enum StyleType {
  normal = 'normal',
  hidetext = 'hidetext',
  text = 'text',
  showcrown = 'showcrown'
}

export interface FormType extends RoleItemType {
  checked: boolean;
  disabled?: boolean;
  selected?: boolean;
  onChange: (v: RoleItemType) => void;
  style?: StyleProp<ViewStyle>;
  styleType?: StyleType;
}

const LabelText = (props: { type: StyleType; children: string }) => {
  if (props.type === StyleType.hidetext) {
    return <Text></Text>;
  }
  if (props.type === StyleType.showcrown) {
    return <CrownText>{props.children}</CrownText>;
  }
  if (props.type === StyleType.text) {
    return <Text style={st.$text2}>{props.children}</Text>;
  }
  return (
    <Text style={[st.$text, props.children.length > 5 && { fontSize: 10 }]}>
      {props.children}
    </Text>
  );
};

// todo
// const nameMap: any = {
//   伊之助猪头形态: '伊之助',
//   猗窝座人形态: '猗窝座',
//   鬼舞辻无惨男人: '鬼舞辻无惨',
//   鬼舞辻无惨女人: '无惨',
//   鬼舞辻无惨小孩: '无惨幼童',
//   鬼舞辻无惨鬼态: '无惨鬼',
//   继国严胜鬼态: '上弦一',
//   继国严胜人态: '继国严胜'
// };
export function RoleItem(props: FormType) {
  return (
    <Pressable
      style={[
        { position: 'relative' },
        props.style,
        props.disabled && !props.checked && { opacity: 0.1 }
      ]}
      onPress={() => {
        if (props.disabled) return;
        if (props.selected) return;
        props.onChange(props);
      }}
    >
      {props.selected && <View style={st.$selectedBg}></View>}
      {props.checked && <PrimaryBg style={st.$primargBg} />}
      <View style={st.$avatar}>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={formatTosUrl(props.icon, { size: 'size4' })}
        />
      </View>
      <LabelText type={props.styleType || StyleType.normal}>
        {props.name}
      </LabelText>

      {props.checked && (
        <Checkbox
          size={16}
          style={st.$checkbox}
          icon="checked"
          checked={props.checked}
        />
      )}
      {props.selected && (
        <View style={st.$selectedMask}>
          <Text style={st.$selectText}>已选择</Text>
        </View>
      )}
    </Pressable>
  );
}
