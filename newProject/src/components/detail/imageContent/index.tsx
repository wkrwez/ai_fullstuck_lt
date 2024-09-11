import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import * as Haptics from 'expo-haptics';
import {
  PermissionResponse,
  PermissionStatus,
  Subscription
} from 'expo-modules-core';
// import Swiper from 'react-native-swiper';
import { router, useNavigation } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  PermissionsAndroid,
  Platform,
  Pressable,
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { SharedElement } from 'react-navigation-shared-element';
import { LOGIN_SCENE, SHARE_DETAIL_URL } from '@/src/constants';
import { useScreenSize } from '@/src/hooks';
import { useAuthState } from '@/src/hooks/useAuthState';
import { DetailInfo, useDetailStore } from '@/src/store/detail';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { ShareImageType, ShareInfo, ShareTemplateName } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { getWaterMark } from '@/src/utils/getWaterMark';
import { Image } from '@Components/image';
// import { Pagination } from '@Components/pagination';
import {
  hidePreviewImages,
  showPreviewImages
} from '@Components/previewImageModal';
import { hideShare, showShare } from '@Components/share';
// import { Channel } from '@Components/share';
import { Text } from '@Components/text';
import { Source, reportClick, reportExpo } from '@Utils/report';
import Pagination from '../../v2/pagination';
import { TakePhotoButton } from '../takePhotoButton';
import * as ScreenCapture from '@step.ai/expo-screen-capture';
import { Photo } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';
import { useShallow } from 'zustand/react/shallow';

// import { ArticlePageCommonInfoResponse } from '@step.ai/proto-gen/query/query_pb';

const st = StyleSheet.create({
  $swiperWrap: {
    position: 'relative',
    width: '100%',
    zIndex: 1
  },
  $dotStyle: {
    position: 'relative',
    height: 6,
    width: 6,
    backgroundColor: '#E5E4E9',
    borderRadius: 2,
    marginLeft: 6,
    marginRight: 6
  },
  $dotActvieStyle: {
    position: 'relative',
    height: 6,
    width: 6,
    backgroundColor: StyleSheet.currentColors.brand1,
    borderRadius: 2,
    marginLeft: 6,
    marginRight: 6
  },
  $slide: {
    width: '100%',
    height: '100%'
  },
  $slide1: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  $slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  $slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  $text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  $titleStyle: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.87)
  },
  $content: {
    paddingEnd: 16,
    paddingLeft: 16,
    paddingRight: 16
  },
  $contentTextStyle: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'justify',
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.87)
  },
  $time: {
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
    fontWeight: '400',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 16
  },
  $points: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 20,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
    borderRadius: 6,
    zIndex: 99999
  },
  $pointText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: StyleSheet.currentColors.white
  },
  $pagin: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type LikeCallbackConfig = {
  doubleLike?: {
    offsetX: number;
    offsetY: number;
  };
};

type ImageContentProps = {
  data?: DetailInfo;
  onLike?: (config?: LikeCallbackConfig) => void;
  onScreenCapture?: () => void;
};

async function hasAndroidPermissions() {
  const permission = await ScreenCapture.getPermissionsAsync();
  if (permission.status !== PermissionStatus.GRANTED) {
    return await ScreenCapture.requestPermissionsAsync();
  }
  return true;
}

export function ImageContent(props: ImageContentProps) {
  const cardId = props.data?.cardId;

  const dayString = useMemo(() => {
    if (!props.data) return '';
    return dayjs.unix(parseInt(props.data.publishTime)).format('YYYY-MM-DD');
  }, [props.data?.publishTime]);
  const { width } = useScreenSize();
  const [index, setIndex] = useState(1);
  const swiperRef = useRef<SwiperFlatList>(null);
  const height = useMemo(() => {
    return ((width || 1) * 936) / 704;
  }, [width]);
  const indexRef = useRef(index);
  const lastScrollX = useRef(0);
  const canBackRef = useRef(false);
  const navigation = useNavigation();
  const exposureRecord = useRef<Record<string, boolean>>({});
  const loaded = useSharedValue(0);

  const detail = useDetailStore(state =>
    cardId ? state.getDetail(cardId)?.detail : undefined
  );
  const disableShare = detail?.cardMetaAttrs?.['sharable'] === 'false';

  const { loginIntercept } = useAuthState();

  // todo 还是有问题 暂时禁掉
  const hasPermissions = async () => {
    if (Platform.OS === 'android') {
      return false;
    }
    return await ScreenCapture.isAvailableAsync();
    // return await ScreenCapture.requestPermissionsAsync();
  };

  useEffect(() => {
    if (disableShare) {
      return;
    }

    let screenCaptureListener: Subscription | undefined;

    const unsubscribe1 = navigation.addListener('focus', () => {
      const addListenerAsync = async () => {
        if (await hasPermissions()) {
          screenCaptureListener = ScreenCapture.addScreenshotListener(() => {
            props.onScreenCapture?.();
            onShare(ShareImageType.image);
          });
        } else {
          logWarn(
            'screenshot',
            'Permissions needed to subscribe to screenshot events are missing!'
          );
        }
      };
      addListenerAsync();
    });

    const unsubscribe2 = navigation.addListener('blur', () => {
      screenCaptureListener?.remove();
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      screenCaptureListener?.remove();
    }; // 在组件卸载时取消订阅
  }, [navigation, disableShare]);

  useEffect(() => {
    if (props.data?.placeholder) return;
    props.data?.photos.forEach(item => {
      if (item.url) {
        Image.prefetch(item.url + getWaterMark());
      }
    });
  }, [props.data?.photos]);

  // 不能在组件卸载时清空，数据会丢
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     if (!isMine) {
  //       setTimeout(() => {
  //         // todo 要在动画执行完后reset，不要setTimeOut
  //         useProfileStore.getState().reset();
  //       }, 0);
  //     }
  //   });

  useEffect(() => {
    indexRef.current = index;

    if (!exposureRecord.current[index]) {
      setTimeout(() => {
        reportExpo('pic', {
          contentid: cardId,
          imageid: props.data?.photos[index - 1]?.photoId,
          status: disableShare ? 'disable' : 'normal'
        });
      });
    }
    exposureRecord.current[index] = true;
    reportClick('pic_slip', {
      contentid: cardId
    });
  }, [index]);

  // todo: 传到预览节点，不太好，要改
  const shareNode = (
    <Image
      source={props.data?.photos[0].url || ''}
      style={{ width, height }}
      tosSize={'size2'}
    />
  );

  // const pinchGesture = Gesture.Pinch().onEnd(e => {
  //   const { scale } = e;
  //   if (scale > 1) {
  //     runOnJS(onPreviewImage)(indexRef.current);
  //   }
  // });

  const onTapImage = () => {
    reportClick('pic', {
      contentid: cardId,
      imageid: props.data?.photos[index - 1]?.photoId
    });
    onPreviewImage();
  };

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      runOnJS(onTapImage)();
    });

  const onLike = (config?: LikeCallbackConfig) => {
    Haptics.selectionAsync();
    reportClick('pic_taptwice', {
      contentid: cardId,
      imageid: props.data?.photos[index - 1]?.photoId
    });
    props.onLike?.(config);
  };

  const tapTwiceGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(params => {
      runOnJS(onLike)({
        doubleLike: {
          offsetX: params.absoluteX,
          offsetY: params.absoluteY
        }
      });
    });

  const onShare = useMemoizedFn((type?: ShareImageType) => {
    Haptics.selectionAsync();

    const cardId = props.data?.cardId;

    const info = cardId
      ? useDetailStore.getState().getDetail(cardId)
      : undefined;

    if (!info) return null;

    const shareInfo = getShareInfo();
    if (!shareInfo) return;

    //埋点
    reportExpo('share_component', {
      contentid: cardId,
      share_scene: '3'
    });

    showShare({
      shareInfo,
      extra: JSON.stringify(info.commonInfo?.profile || {}),
      type: type || ShareImageType.common,
      shareTemplateName: ShareTemplateName.detail
    });
  });

  const getShareInfo = (): ShareInfo | undefined => {
    const cardId = props.data?.cardId;
    const info = cardId
      ? useDetailStore.getState().getDetail(cardId)
      : undefined;

    if (!info || !info.detail) return;
    const { photos, title, text } = info.detail;
    if (!photos) return;
    const image = photos[0].url;
    const profile = info.commonInfo?.profile;
    return {
      title,
      description: text,
      images: photos.map(i => i.url),
      url: SHARE_DETAIL_URL + `?id=${cardId}`,
      imageIndex: info.imageIndex || 1
    };
  };

  const hideTitle = useMemo(() => {
    if (!props.data) return;
    const { title, text } = props.data;
    return title === text.slice(0, 30);
  }, [props.data]);

  const onLongPressImage = () => {
    if (disableShare) {
      return;
    }

    reportClick('pic_longpress', {
      contentid: cardId,
      imageid: props.data?.photos[index - 1]?.photoId
    });
    onShare();
  };

  const longTapGesture = Gesture.LongPress().onStart(() => {
    runOnJS(onLongPressImage)();
  });

  const composed = Gesture.Exclusive(
    tapTwiceGesture,
    longTapGesture,
    tapGesture
  );

  const $shareNodeStyle = useAnimatedStyle(() => ({
    opacity: 1 - loaded.value
  }));

  return (
    <View>
      <GestureDetector gesture={composed}>
        <View style={[st.$swiperWrap, { width, height }]}>
          <Animated.View
            style={[
              { position: 'absolute', top: 0, left: 0, pointerEvents: 'none' },
              $shareNodeStyle
            ]}
          >
            {/* <SharedElement
              id={`item.${props.data?.cardId}.photo`}
              style={{ position: 'absolute', top: 0, left: 0 }}
              pointerEvents="none"
            > */}
            {shareNode}
            {/* </SharedElement> */}
          </Animated.View>

          {/* <SharedImage {...props} width={width} height={height} /> */}
          {/* todo 要提取一下 */}
          {/* @ts-ignore */}
          <SwiperFlatList
            ref={swiperRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onScrollEndDrag={() => {
              // 这个会有Bug
              if (canBackRef.current) {
                setTimeout(() => {
                  router.back();
                }, 200);
              }
            }}
            data={props.data?.photos || []}
            {...(Platform.OS === 'android'
              ? { onChangeIndex: onChangeAndroidIndex }
              : { onViewableItemsChanged: onChangeIndex })}
            // onViewableItemsChanged={onChangeIndex}
            renderItem={({ item, index }) => {
              // console.log(formatTosUrl(item.url || '', { size: 'size1' }));
              return (
                // <Pressable onPress={() => onPreviewImage(index)}>
                <Image
                  key={item.photoId}
                  // source={formatTosUrl(item.url || '', {
                  //   size: 'size1'
                  // })}
                  source={formatTosUrl(item.url || '', {
                    size: 'size1'
                  })}
                  style={{ width, height }}
                  onLoad={() => {
                    if (index === 0) {
                      loaded.value = withTiming(1, { duration: 300 });
                    }
                  }}
                />
                // </Pressable>
              );
            }}
            keyExtractor={item => item.photoId}
          ></SwiperFlatList>
        </View>
      </GestureDetector>
      <View style={st.$points}>
        <Text style={st.$pointText}>
          {index}/{props.data?.photos.length}
        </Text>
      </View>
      {props.data?.photos.length !== undefined &&
        props.data?.photos.length > 1 && (
          // <Pagination
          //   style={st.$pagin}
          //   current={index - 1}
          //   total={props.data?.photos.length || 0}
          // />
          <View style={st.$pagin}>
            <Pagination
              current={index - 1}
              total={props.data?.photos.length || 0}
            ></Pagination>
          </View>
        )}

      {props.data && (
        <View style={st.$content}>
          {!hideTitle && <Text style={st.$titleStyle}>{props.data.title}</Text>}

          <Text style={[st.$contentTextStyle, hideTitle && { marginTop: 16 }]}>
            {props.data.text}
          </Text>
          {props.data.publishTime && (
            <Text style={st.$time}>发布于 {dayString}</Text>
          )}
        </View>
      )}
    </View>
  );

  function onChangeIndex(params: { changed: { index: number }[] }) {
    if (!swiperRef.current) return;
    const index = params.changed?.[0]?.index + 1;
    setIndex(index);

    if (cardId) {
      useDetailStore.getState().setImageIndex(cardId, index);
    }
  }
  function onChangeAndroidIndex({ index }: { index: number }) {
    setIndex(index + 1);

    if (cardId) {
      useDetailStore.getState().setImageIndex(cardId, index + 1);
    }
  }

  function onPreviewImage() {
    showPreviewImages({
      index: index - 1,
      list: props.data?.photos || [],
      // shareNode,
      renderBottomLeftSlot: (
        <TakePhotoButton
          onPress={() =>
            loginIntercept(
              () => {
                reportClick('join_button', {
                  detailId: cardId
                });
                props.data?.photos[index - 1] &&
                  onTakePhoto(props.data?.photos[index - 1]);
                hidePreviewImages();
              },
              { scene: LOGIN_SCENE.TAKE_SAME_STYLE }
            )
          }
        />
      ),
      onDoubleClickLike: onLike,
      reportParams: {
        contentid: cardId || ''
      },
      removeMark: disableShare
    });
  }

  function onTouchStart(e: GestureResponderEvent) {
    lastScrollX.current = e.nativeEvent.pageX;
  }

  function onTouchMove(e: GestureResponderEvent) {
    if (index === 1 && e.nativeEvent.pageX - lastScrollX.current > 100) {
      canBackRef.current = true;
      // router.back();
    }
  }

  function onTakePhoto(data: Photo) {
    const info = cardId
      ? useDetailStore.getState().getDetail(cardId)
      : undefined;
    if (!info?.detail || !info.detail.mapProtoData) return;

    if (info.detail.mapProtoData[data.photoId]) {
      const { roles, style, prompt, protoId, size } =
        info.detail.mapProtoData[data.photoId];
      useMakePhotoStoreV2.getState().syncData({
        prompt,
        protoId,
        roles,
        style,
        cardId: info.detail.cardId || ''
      });
      useMakePhotoStoreV2.getState().changePageState(PageState.diy);

      router.push({
        pathname: '/make-photo/',
        params: {
          from: Source.DRAWING_WITH_PROMPT
        }
      });
    }
  }
}
