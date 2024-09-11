// import { ResizeMode, Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { logWarn } from '@/src/utils/error-log';
import { Icon } from '@Components/icons';
import { showToast } from '@Components/toast';
import { Video, VideoHandle } from '@Components/video';
import { StyleSheet } from '@Utils/StyleSheet';
import { PAGE_TOP, PANNEL_TOP } from '../constant';
import ToastInner from '@/app/credit/toast';
import { errMsgs } from '@/app/parallel-world/_utils/error-msg';
import { PointsCode } from '@/proto-registry/src/web/raccoon/errorcode/errorcode_pb';
import { CommonCode } from '@/proto-registry/src/web/raccoon/errorcode/errorcode_pb';
import { useShallow } from 'zustand/react/shallow';

const V1_SOURCE = require('@Assets/mp4/v1.mp4');
const V2_SOURCE = require('@Assets/mp4/v2.mp4');
const V3_SOURCE = require('@Assets/mp4/v3.mp4');
const V4_SOURCE = require('@Assets/mp4/v4.mp4');
const V5_SOURCE = require('@Assets/mp4/v5.mp4');

const VD1_SOURCE = require('@Assets/mp4/vd1.mp4');
const VD2_SOURCE = require('@Assets/mp4/vd2.mp4');
const VD3_SOURCE = require('@Assets/mp4/vd3.mp4');
const VD4_SOURCE = require('@Assets/mp4/vd4.mp4');
const VD5_SOURCE = require('@Assets/mp4/vd5.mp4');

const $wrap = StyleSheet.createRectStyle({
  // marginTop: PAGE_TOP,
  top: 0,
  left: 0
});

interface LoadingViewProps {
  onBack: () => void;
}

export interface LoadingViewRef {
  reset: () => void;
}
export const LoadingView = forwardRef(
  (props: LoadingViewProps, ref: React.ForwardedRef<LoadingViewRef>) => {
    const videoRef = useRef<VideoHandle>(null);
    const canPreview = useRef(0);
    const opacityVal = useSharedValue(0);
    const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

    const { pageState, photoLoading, retryState, role2 } = useMakePhotoStoreV2(
      useShallow(state => ({
        pageState: state.pageState,
        photoLoading: state.photoLoading,
        retryState: state.retryState,
        role2: state.role2
      }))
    );

    useImperativeHandle(ref, () => ({
      reset() {
        videoRef.current?.hide();
        videoRef.current?.reset();
      }
    }));

    useEffect(() => {
      console.log('photoLoading--------', photoLoading);
      if (!photoLoading) return;
      const { pendingTakePhoto, changePageState } =
        useMakePhotoStoreV2.getState();
      pendingTakePhoto()
        .then(() => {
          console.log('pendingTakePhoto succee');
          canPreview.current = 1;
          // 流转状态
        })
        .catch((e: ErrorRes) => {
          // 边界积分处理
          if (e instanceof ErrorRes) {
            console.log(typeof e.reason, 'errorReserrorRes');
            logWarn('[makephoto error boundary]', e);
            const reason = e.reason;
            if (
              reason?.includes(PointsCode.POINTS_ERR_INSUFFICIENT_POINTS + '')
            ) {
              showToast(
                <ToastInner
                  diyText={'狸电池不足，前往获取更多狸电池吧'}
                  diyLinkText={'【前往】'}
                ></ToastInner>,
                3000,
                true
              );
            }
          }

          changePageState(PageState.styleselect);
          // showToast('炖图失败，请重试~');
          videoRef.current?.hide();
          videoRef.current?.reset();
          console.log('pendingTakePhoto error', e);
          // 回到上一步
        });
    }, [photoLoading]);

    useEffect(() => {
      if (PageState.effect === pageState) {
        videoRef.current?.show();
        Haptics.notificationAsync();
      }
    }, [pageState]);

    useEffect(() => {
      if (role2) {
        videoRef.current?.changeSources([
          { source: VD1_SOURCE, autoNext: true },
          { source: VD2_SOURCE, loop: true },
          { source: VD4_SOURCE },
          { source: VD5_SOURCE }
        ]);
      } else {
        videoRef.current?.changeSources([
          { source: V1_SOURCE, autoNext: true },
          { source: V2_SOURCE, loop: true },
          { source: V4_SOURCE },
          { source: V5_SOURCE }
        ]);
      }
    }, [role2]);

    useEffect(() => {
      if (PageState.effect !== pageState) {
        videoRef.current?.hide();
      }
    }, []);

    useEffect(() => {
      if (retryState) {
        videoRef.current?.show();
        canPreview.current = 0;
        useMakePhotoStoreV2.getState().setRetryState(0);
      }
    }, [retryState]);

    return (
      <View
        style={[
          {
            position: 'absolute'
          },
          $wrap
        ]}
        pointerEvents={pageState === PageState.effect ? 'auto' : 'none'}
      >
        <Video
          videos={[
            { source: V1_SOURCE, autoNext: true },
            { source: V2_SOURCE, loop: true },
            { source: V4_SOURCE },
            { source: V5_SOURCE }
          ]}
          onFinish={onFinish}
          onAllFinished={onAllFinished}
          ref={videoRef}
        />
        {pageState === PageState.effect && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: Number($containerInsets.paddingTop) + 20,
              left: 15
            }}
            onPress={() => {
              videoRef.current?.hide();
              videoRef.current?.reset();
              useMakePhotoStoreV2.getState().changePageState(PageState.diy);
            }}
          >
            <Icon
              icon="back"
              color={StyleSheet.currentColors.white}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>
    );

    function onFinish(index: number) {
      // console.log('onFinish-------', index, canPreview.current);
      if (index === 1 && canPreview.current) {
        videoRef.current?.next();
      }
      if (index === 2) {
        videoRef.current?.next();
        useMakePhotoStoreV2.getState().changePageState(PageState.preview);
      }
    }

    function onAllFinished() {
      // todo 能否
      // setTimeout(() => {
      videoRef.current?.reset();
      // }, 2000);
    }
  }
);
