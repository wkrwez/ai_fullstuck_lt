import { useEffect, useState } from 'react';
import { ImageStyle, StyleProp, Text, View, ViewStyle } from 'react-native';
import { useAppStore } from '@/src/store/app';
import { useStorageStore } from '@/src/store/storage';
import { CommonColor } from '@/src/theme/colors/common';
import { safeParseJson } from '@/src/utils/safeParseJson';
import { TouchableScale } from '../TouchableScale';
import { Icon } from '../icons';

export function EmojiInputIcon({
  style,
  onPress,
  disableTouchableScale
}: {
  style?: StyleProp<ImageStyle>;
  onPress?: () => void;
  disableTouchableScale?: boolean;
}) {
  const [showRedDot, setShowRedDot] = useState(false);
  const emojiRedDotRecord = useStorageStore(state => state.emojiRedDotRecord);
  const currentUid = useAppStore(state => state.user?.uid);

  // todo @linyueiang clear
  // const onClear = () => {
  //   useStorageStore.getState().__setStorage({
  //     emojiRedDotRecord: undefined,
  //     emojiInputTipRecord: undefined
  //   });
  // };

  useEffect(() => {
    const clacShowRedDot = async () => {
      const record =
        safeParseJson<Record<string, boolean | undefined>>(emojiRedDotRecord);

      // if (record && currentUid && record[currentUid]) {
      //   setShowRedDot(false);
      // } else {
      //   setShowRedDot(true);
      // }
      // 0906 表情包红点常驻
      setShowRedDot(true);
    };
    clacShowRedDot();
  }, [currentUid, emojiRedDotRecord]);

  return (
    <>
      {/* <TouchableScale onPress={onClear}>
        <Text>clear</Text>
      </TouchableScale> */}
      <TouchableScale
        disableTouchableScale={disableTouchableScale}
        onPress={onPress}
      >
        <Icon icon={'comment_emoji'} style={style} />
        {showRedDot ? <View style={$emojiRedDot} /> : null}
      </TouchableScale>
    </>
  );
}

const $emojiRedDot: ViewStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 7,
  height: 7,
  backgroundColor: CommonColor.red,
  borderColor: CommonColor.white,
  borderWidth: 1,
  borderRadius: 7
};
