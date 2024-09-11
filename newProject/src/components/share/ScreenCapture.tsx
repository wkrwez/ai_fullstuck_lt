import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { uploadShareImg } from '@/src/api/services';
import { useScreenSize } from '@/src/hooks';
import { StyleSheet } from '@/src/utils';

interface ScreenCaptureProps {
  children: ReactNode;
}

export interface ScreenCaptureOperate {
  getImage: () => Promise<{ url: string }>;
}

export const ScreenCapture = forwardRef<
  ScreenCaptureOperate,
  ScreenCaptureProps
>((props, ref) => {
  const sharePreviewRef = useRef<View>(null);
  const { height } = useScreenSize('window');
  const $promiseUrl = useRef<Promise<{ url: string }>>();
  //   useEffect(() => {
  //     setTimeout(() => {
  //       createImage();
  //     }, 3000);
  //   }, []);

  //   useImperativeHandle(ref, () => ({
  //     getImage
  //   }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      ref={sharePreviewRef}
      collapsable={false}
    >
      {props.children}
    </View>
  );

  function createImage() {
    $promiseUrl.current = captureRef(sharePreviewRef, {
      height,
      quality: 1
    }).then(async uri => {
      return uploadShareImg(uri).then(res => res.image);
    });
  }

  function getImage() {
    if (!$promiseUrl.current)
      return Promise.reject({ code: 1, reason: '图像生成中' });
    return $promiseUrl.current;
  }
});
