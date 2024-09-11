import { useLocalSearchParams } from 'expo-router';
import { LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { GenerateSharePic } from '@/src/api/share';
import { SwitchName, useControlStore } from '@/src/store/control';
import { Theme } from '@/src/theme/colors/type';
import { ShareInfoProps } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { FullScreen } from '../fullscreen';
import { hideLoading, showLoading } from '../loading';
import { ScreenCapture, ScreenCaptureOperate } from './ScreenCapture';
import { ShareComp } from './ShareComp';
import { ShareScreen } from './ShareScreen';
import { ShareSheetModal } from './SheetModal';
import { GetShareInfoError, ShareCompPreset, ShareMethod } from './typings';
import { addCommonParams } from './utils';

interface ShareImageProps {
  isShow: boolean;
  // url:string,
  onCancel: (isVisible: boolean) => void;
  shareInfo: ShareInfoProps;
  // onShare: (type: ShareType, imageUrl: string) => void;
  theme?: Theme;
}

export function ShareGenImage(props: ShareImageProps) {
  const [screenHeight, setScreenHeight] = useState(0);
  const { shareInfo, isShow } = props;
  const [imageUrl, setImageUrl] = useState('');
  const imageRef = useRef('');
  const { id: cardId } = useLocalSearchParams();
  const screenRef = useRef<ScreenCaptureOperate>(null);

  const currentShareInfo = useMemo(() => {
    let shareUrl = shareInfo?.shareInfo?.url;
    if (shareUrl) {
      shareUrl = addCommonParams(shareInfo.shareInfo.url, {
        utm_type: 'generative_share_image'
      });
    }

    return {
      ...shareInfo,
      shareInfo: {
        ...shareInfo.shareInfo,
        url: shareUrl
      }
    };
  }, [shareInfo]);

  const getShareInfo = () => {
    if (!imageRef.current) {
      showToast('图片生成中，请稍后');
      throw new GetShareInfoError('shareGenImageNotReady', {
        disableDefaultToast: true
      });
    }
    return {
      ...currentShareInfo.shareInfo,
      url: '',
      images: [imageRef.current],
      imageIndex: 1
    };
  };

  useEffect(() => {
    const screenDimensions = Dimensions.get('window');
    setScreenHeight(screenDimensions.height);

    // setTimeout(() => {
    //   screenRef.current?.getImage().then(res => {
    //     imageRef.current = res.url;
    //     console.log(9999229, res);
    //   });
    // }, 4000);
    // showLoading();
    // console.log('媒体高度', JSON.stringify(shareInfo));

    GenerateSharePic({
      //  'lipu_detail_share_image_info_prod'
      shareTemplateName: currentShareInfo.shareTemplateName,
      shareValues: JSON.stringify({
        ...currentShareInfo,
        useAI: !useControlStore
          .getState()
          .checkIsOpen(SwitchName.DISABLE_AI_WATER_MARK)
      })
    })
      .then(res => {
        setImageUrl(res.sharePicUrl);
        hideLoading();
      })
      .catch(e => {
        hideLoading();
      });
  }, []);

  useEffect(() => {
    imageRef.current = imageUrl;
  }, [imageUrl]);
  if (!isShow) return;

  return (
    <>
      <ShareSheetModal
        visible={isShow}
        onClose={() => {
          props.onCancel(false);
        }}
        maskClosable={false}
        theme={props.theme}
        maskChildren={
          <FullScreen style={st.$backImage}>
            {currentShareInfo && (
              <ScreenCapture ref={screenRef}>
                <ShareScreen shareInfo={currentShareInfo} />
              </ScreenCapture>
            )}
            {/* {
              <Image
                style={{
                  height: screenHeight - (Platform.OS === 'ios' ? 165 : 125),
                  width: '100%'
                }}
                source={imageUrl}
              ></Image>
            } */}
          </FullScreen>
        }
      >
        <View
          style={[
            StyleSheet.rowStyle,
            {
              marginTop: 30,
              overflowX: 'auto'
            }
          ]}
        >
          <ShareComp
            preset={ShareCompPreset.CONTENT_GEN_SHARE_IMAGE}
            getShareInfo={getShareInfo}
            waterMarkType={WaterMarkType.NO_WMK}
            theme={props.theme}
            reportParams={{
              contentid: String(cardId),
              share_method: ShareMethod.SHARE_IMAGE
            }}
            onSuccess={() => props.onCancel(false)}
          />
        </View>
      </ShareSheetModal>
    </>
  );
}

const st = StyleSheet.create({
  $backImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  $content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  $wrap: {
    width: '100%',
    backgroundColor: '#F2F2F6',
    borderRadius: 20,
    padding: 16
  }
});
