import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { colors, colorsUI, spacing, typography } from '../../theme';
import { Icon, IconTypes } from '../icons';
import { InboxMsg } from '@/proto-registry/src/web/raccoon/inbox/inbox_pb';
import { Button } from './button';

const buttonTypes = {
  onLike: 'like',
  toLink: 'link'
};

export type ButtonTypes = keyof typeof buttonTypes;

interface AdvancedButtonProps {
  // isChoose:boolean,
  // icon:IconTypes,
  // data:InboxMsg;
  iconsize?: number;
  type: ButtonTypes;
}

export function AdvancedButton(props: AdvancedButtonProps) {
  const [chooseState, setChooseState] = useState(false);
  function chooseLike() {
    let sta = !chooseState;
    setChooseState(sta);
  }

  function toLink() {}

  return (
    <>
      <Pressable onPress={chooseLike}>
        {props.type === 'onLike' && (
          <View style={[st.$baseViewStyle, st.$viewPresets]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Icon
                icon={chooseState ? 'choose_like' : 'onclik_like'}
                size={props.iconsize || 16}
                style={{ marginRight: 6 }}
              ></Icon>
              <Text>点赞</Text>
            </View>
          </View>
        )}
        {props.type === 'toLink' && (
          <View
            style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}
          >
            <Text>点击查看</Text>
            <Button
              preset="lightTheme"
              size="small"
              style={{ width: 80 }}
              textStyle={{ color: '#FF6A3B', fontSize: 12 }}
            >
              点击查看
            </Button>
          </View>
        )}
      </Pressable>
    </>
  );
}

const st = StyleSheet.create({
  $baseViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  $viewPresets: {
    width: 68,
    borderRadius: 13,
    height: 26,
    lineHeight: 26,
    paddingHorizontal: spacing.xs,
    fontSize: 12,
    backgroundColor: colors.backgroundGray,
    paddingLeft: 3
  }
});
