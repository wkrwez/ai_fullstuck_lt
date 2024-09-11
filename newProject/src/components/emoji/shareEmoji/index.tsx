import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { darkSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { ShareComp } from '../../share/ShareComp';
import { ShareCompPreset } from '../../share/typings';

export function ShareEmoji({
  emojiId,
  getEmojiUrl
}: {
  emojiId?: string;
  getEmojiUrl?: () => Promise<string | undefined> | string | undefined;
}) {
  return (
    <View style={$shareSectionContainer}>
      <View style={$shareTitleContainer}>
        <View style={$shareTitleDecoration}></View>
        <Text style={$shareTitle}>保存/分享</Text>
        <View style={$shareTitleDecoration}></View>
      </View>
      <ShareComp
        align="center"
        theme={Theme.DARK}
        style={$shareCompsStyle}
        preset={ShareCompPreset.EMOJI_IMAGE}
        waterMarkType={WaterMarkType.EMOJI}
        reportParams={{
          emojiId: emojiId || ''
        }}
        getShareInfo={async () => {
          const url = await getEmojiUrl?.();
          if (url) {
            return {
              title: '',
              description: '',
              imageIndex: 1,
              images: [url],
              url: ''
            };
          }
        }}
      />
    </View>
  );
}

const $shareSectionContainer: ViewStyle = {
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  marginTop: 20
};

const $shareTitleContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  gap: 8
};

const $shareTitleDecoration: ViewStyle = {
  flex: 1,
  height: 1,
  backgroundColor: darkSceneColor.border
};

const $shareTitle: TextStyle = {
  color: darkSceneColor.fontColor2,
  fontSize: 11,
  lineHeight: 12
};

const $shareCompsStyle: ViewStyle = {
  width: '100%',
  marginTop: 15
};
