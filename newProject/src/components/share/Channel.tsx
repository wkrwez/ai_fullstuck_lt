import { showShare } from '.';
import { useGlobalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { Theme } from '@/src/theme/colors/type';
import { ShareImageType, ShareInfoProps } from '@/src/types';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { reportClick, reportExpo } from '@/src/utils/report';
import { StyleSheet } from '@Utils/StyleSheet';
import { ShareComp } from './ShareComp';
import { ShareSheetModal } from './SheetModal';
import {
  ChannelConfig,
  ShareCompPreset,
  ShareMethod,
  ShareType
} from './typings';

interface ChannelProps {
  isShow: boolean;
  onCancel: (isVisible: boolean) => void;
  shareInfo: ShareInfoProps;
  theme?: Theme;
}

export interface IShareProviderProps {}

export function Channel(props: ChannelProps) {
  const { id: cardId } = useGlobalSearchParams();
  const { shareInfo } = props || {};

  const getShareInfo = () => {
    return props.shareInfo.shareInfo;
  };

  const extraShareItems = useMemo(() => {
    const list: ChannelConfig[] = [];
    if (
      props.shareInfo.allowShareImage === undefined ||
      props.shareInfo.allowShareImage === true
    ) {
      list.push({
        type: ShareType.shareimage,
        onPress: onShareImage
      });
    }
    if (props.shareInfo.extraOperations?.length) {
      list.push(...props.shareInfo.extraOperations);
    }
    return list;
  }, [props.shareInfo.allowShareImage, props.shareInfo.extraOperations]);

  const renderShareComp = () => {
    console.log('=====renderShareComp====', shareInfo?.channelPreset)
    if (shareInfo?.channelPreset) {
      return (
        <View style={[StyleSheet.rowStyle, { marginTop: 30 }]}>
          <ShareComp
            preset={shareInfo?.channelPreset}
            getShareInfo={getShareInfo}
            waterMarkType={WaterMarkType.AIGC}
            theme={props.theme}
            onSuccess={() => props.onCancel(false)} />
        </View>
      )
    }

    return (
      <>
        <View style={[StyleSheet.rowStyle, { marginTop: 30 }]}>
          <ShareComp
            preset={ShareCompPreset.CONTENT_SHARE}
            getShareInfo={getShareInfo}
            waterMarkType={WaterMarkType.AIGC}
            theme={props.theme}
            reportParams={{
              contentid: String(cardId)
            }}
            onSuccess={() => props.onCancel(false)}
          />
        </View>
        <View
          style={[
            StyleSheet.rowStyle,
            {
              marginTop: 20
            }
          ]}
        >
          <ShareComp
            preset={ShareCompPreset.CONTENT_OPERATIONS}
            waterMarkType={WaterMarkType.AIGC}
            extraShareItems={extraShareItems}
            getShareInfo={getShareInfo}
            theme={props.theme}
            reportParams={{ contentid: String(cardId) }}
            onSuccess={() => props.onCancel(false)}
          />
        </View>
      </>
    )
  }

  return (
    <>
      <ShareSheetModal
        visible={props.isShow}
        onClose={() => props.onCancel(false)}
        theme={props.theme}
      >
        {renderShareComp()}
      </ShareSheetModal>
    </>
  );

  function onShareImage() {
    reportClick('share_component', {
      contentid: cardId,
      share_component: '9'
    });
    reportExpo('share_component', {
      contentid: cardId,
      share_scene: '2'
    });
    props.onCancel(false);

    showShare({
      ...props.shareInfo,
      type: ShareImageType.image
    });
  }
}
