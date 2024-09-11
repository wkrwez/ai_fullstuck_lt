// todo 基础弹窗相关逻辑要抽离
import { useDebounceFn } from 'ahooks';
import * as Clipboard from 'expo-clipboard';
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Platform,
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  unstable_batchedUpdates
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import Swiper from 'react-native-swiper';
import {
  SwiperFlatList,
  SwiperFlatListProps
} from 'react-native-swiper-flatlist';
import { GetImagegenProto } from '@/src/api/makephotov2';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_SHEET_ZINDEX
} from '@/src/constants';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useStorageStore } from '@/src/store/storage';
import { ImageItem } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { getScreenSize } from '@/src/utils';
import { catchErrorLog, logWarn } from '@/src/utils/error-log';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportClick, reportExpo } from '@/src/utils/report';
import { styles } from '@/src/utils/styles';
import { Icon, IconClose, IconDelete, IconDownload } from '@Components/icons';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { ThumbList, ThumbListHandle } from '@Components/thumblist';
import { savePicture } from '@Utils/savePicture';
import { DoubleClickLike, DoubleClickLikeActions } from '../doubleClickLike';
import { hideLoading, showLoading } from '../loading';
import { showToast } from '../toast';
import { Portal } from '@gorhom/portal';

const $buttonStyle: ViewStyle = {
  ...StyleSheet.rowStyle,
  ...StyleSheet.circleStyle,
  alignItems: 'center',
  justifyContent: 'center'
};

const $buttonTextStyle = {
  height: 44,
  lineHeight: 44,
  fontSize: 14,
  fontWeight: '500',
  marginLeft: StyleSheet.spacing.xxs
};

const $footerCommon: ViewStyle = {
  paddingHorizontal: 16,
  ...StyleSheet.rowStyle,
  justifyContent: 'space-between'
};

const $footer: ViewStyle = {
  position: 'absolute',
  width: '100%'
};

const $closeIcon: ViewStyle = {
  width: 44,
  height: 40,
  justifyContent: 'center'
};

const $btnSave: ViewStyle = {
  ...$buttonStyle,
  paddingVertical: 9,
  paddingHorizontal: 20,
  height: 36,
  backgroundColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.12)
};

const $btnText: TextStyle = {
  fontSize: 14,
  fontWeight: '500',
  lineHeight: 18,
  color: StyleSheet.currentColors.white
};

const st = StyleSheet.create({
  $wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: DEFAULT_SHEET_ZINDEX + 2
    // ...StyleSheet.fullStyle,
    // backgroundColor: StyleSheet.currentColors.black
  },
  $mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // ...StyleSheet.fullStyle,
    backgroundColor: StyleSheet.currentColors.black
  },
  $content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    ...StyleSheet.columnStyle,
    alignContent: 'center',
    justifyContent: 'center'
  },
  $btnClose: {
    ...$buttonStyle,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.1),
    borderWidth: 1,
    borderColor: StyleSheet.currentColors.white,
    width: 97
  } as ViewStyle,

  $btnRedText: {
    ...$buttonTextStyle,
    color: StyleSheet.currentColors.red
  },

  $imagePreviewWrap: {
    position: 'relative',
    width: '100%'
  },
  $points: {
    position: 'absolute',
    top: 20,
    right: 12,
    minWidth: 36,
    height: 20,
    paddingHorizontal: 4,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
    borderRadius: 6
  },
  $pointText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: StyleSheet.currentColors.white
  }
});

// const mock1 = require('@Assets/mock/img1.jpg');
// interface SlotProps {
//   indexRef: MutableRefObject<number>;
// }

export interface PreviewImageProps {
  index: number;
  list: ImageItem[];
  isVisible?: boolean;
  imageRatio?: number;
  shareNode?: ReactNode;
  onChangeIndex?: (v: number) => void;
  onClose?: () => void;
  onDoubleClickLike?: () => void;
  // onDelete: (v: string) => void;
  renderBottomLeftSlot?:
    | ReactNode
    | ((photo: ImageItem, cb: Callbacks) => ReactNode);
  renderTopRightSlot?:
    | ReactNode
    | ((photo: ImageItem, cb: Callbacks) => ReactNode);
  reportParams?: Record<string, string>;
  removeMark?: boolean;
}

export type Callbacks = {
  close: () => void;
};

export const PreviewImageSingleton = {
  showPreviewImages: (payload: PreviewImageProps) => {},
  hidePreviewImages: () => {}
};

enum InnerVisibleStatus {
  INVISIBLE = 0,
  BEFORE_ANIMATION = 1,
  VISIBLE = 2
}

export function PreviewImageModal(props: PreviewImageProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const images = props.list;
  const imagesRef = useRef<ImageItem[] | undefined>();
  const swiperRef = useRef<SwiperFlatList>(null);
  const thumblistRef = useRef<ThumbListHandle>(null);

  // 内部维护当前预览图片 index，和 props.index 进行区分, 初始值从 0 开始
  const [currentIndex, setCurrentIndex] = useState(0);

  const scaleValue = useSharedValue(1);
  const scaleOriginX = useSharedValue(0);
  const scaleOriginY = useSharedValue(0);

  // 内部维护 innerVisible，当出现&消失动画结束后才发生状态变化
  const [innerVisible, setInnerVisible] = useState<InnerVisibleStatus>(
    InnerVisibleStatus.INVISIBLE
  );
  const modalOpacity = useSharedValue(0);
  const doubleClickLikeRef = useRef<DoubleClickLikeActions>(null);

  const [isZooming, setIsZooming] = useState(false);

  // 图片放大时其他元素的透明度变化
  const zoomOpacity = isZooming ? 0.3 : 1;

  const $zoomStyle: ViewStyle = isZooming
    ? {
        opacity: zoomOpacity,
        zIndex: -1
      }
    : {};

  // 计算图片容器高度
  const { width } = useScreenSize();
  const imageHeight = useMemo(() => {
    const ratio =
      props.imageRatio || DEFAULT_IMAGE_HEIGHT / DEFAULT_IMAGE_WIDTH;
    return (width || 1) * ratio;
  }, [props.imageRatio]);

  const pinchGesture = Gesture.Pinch()
    .onBegin(e => {
      scaleOriginX.value = e.focalX;
      scaleOriginY.value = e.focalY;
      runOnJS(setIsZooming)(true);
    })
    .onUpdate(e => {
      scaleValue.value = Math.max(e.scale, 1);
    })
    .onFinalize(e => {
      if (scaleValue.value === 1) {
        runOnJS(setIsZooming)(false);
      }
      scaleValue.value = withTiming(1, { duration: 1000 }, () => {
        runOnJS(setIsZooming)(false);
      });
      scaleOriginX.value = withTiming(0, { duration: 1000 });
      scaleOriginY.value = withTiming(0, { duration: 1000 });
    });

  const onDoubleClickLike = (offsetX: number, offsetY: number) => {
    if (props.onDoubleClickLike) {
      doubleClickLikeRef.current?.start(offsetX, offsetY);
      props.onDoubleClickLike?.();
    }
  };

  const tapTwiceGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(params => {
      runOnJS(onDoubleClickLike)(params.absoluteX, params.absoluteY);
    });

  const tapDebugGesture = Gesture.LongPress().onEnd(params => {
    runOnJS(onDebug)();
  });

  const composed = Gesture.Exclusive(
    pinchGesture,
    tapTwiceGesture,
    tapDebugGesture
  );

  const $scaleAnimatedStyles = useAnimatedStyle(() => {
    const translateScale = 1 - scaleValue.value;
    return {
      transform: [
        {
          translateX: translateScale * (scaleOriginX.value - width / 2)
        },
        {
          translateY: translateScale * (scaleOriginY.value - imageHeight / 2)
        },
        {
          scale: scaleValue.value
        }
      ]
    };
  });

  const { run: debouncedIndexChangeHandler } = useDebounceFn(onChangeIndex, {
    wait: 300
  });

  useEffect(() => {
    if (!images.length) {
      props.onClose && props.onClose();
    }
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    if (
      innerVisible !== InnerVisibleStatus.BEFORE_ANIMATION &&
      Boolean(innerVisible) !== props.isVisible
    ) {
      setInnerVisible(InnerVisibleStatus.BEFORE_ANIMATION);
    }
  }, [props.isVisible, innerVisible]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (innerVisible === InnerVisibleStatus.BEFORE_ANIMATION) {
      if (props.isVisible) {
        const _index = Math.max(0, props.index || 0);
        setCurrentIndex(_index);

        reportExpo('pic_detail', {
          imageid: imagesRef.current?.[currentIndex]?.photoId,
          ...props.reportParams
        });

        timer = setTimeout(() => {
          swiperRef.current?.scrollToIndex({
            index: _index,
            animated: false
          });
          thumblistRef.current?.gotoIndex(_index, false);
          modalOpacity.value = withTiming(
            1,
            {
              easing: Easing.ease,
              duration: 400
            },
            () => {
              runOnJS(setInnerVisible)(InnerVisibleStatus.VISIBLE);
            }
          );
        }, 100);
      } else {
        modalOpacity.value = withTiming(
          0,
          {
            easing: Easing.ease
          },
          () => {
            runOnJS(setInnerVisible)(InnerVisibleStatus.INVISIBLE);
          }
        );
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [innerVisible]);

  if (!props.isVisible && !innerVisible) return null;

  return (
    <Portal>
      <Animated.View
        style={[
          st.$wrap,
          {
            opacity: modalOpacity
          }
        ]}
      >
        <View style={st.$mask}>
          <Pressable style={{ width: '100%', height: '100%' }}></Pressable>
        </View>
        <Animated.View
          pointerEvents="box-none"
          style={styles(
            {
              paddingTop: Number($containerInsets.paddingTop ?? 0) + 20,
              paddingBottom: Number($containerInsets.paddingBottom ?? 0) + 20
            },
            st.$content
          )}
        >
          {/* <View style={st.$header}>
            <TouchableOpacity
              style={st.$btnClose}
              onPress={() => {
                props.onClose();
              }}
            >
              <IconClose size={10} />
              <Text style={st.$btnText}>退出预览</Text>
            </TouchableOpacity>
          </View> */}
          <Animated.View
            entering={FadeIn}
            layout={Layout.duration(2000)}
            pointerEvents="box-none"
            style={[
              styles($footerCommon),
              {
                marginTop: -54
              },
              $zoomStyle
            ]}
          >
            <TouchableOpacity style={$closeIcon} onPress={props.onClose}>
              <IconClose width={12} height={12}></IconClose>
            </TouchableOpacity>
            {typeof props.renderTopRightSlot === 'function'
              ? props.renderTopRightSlot(images[props.index], {
                  close: props.onClose || (() => {})
                })
              : props.renderTopRightSlot}
          </Animated.View>

          <GestureDetector gesture={composed}>
            <View
              style={[
                st.$imagePreviewWrap,
                {
                  height: imageHeight
                }
              ]}
            >
              {props.shareNode && (
                <Animated.View
                  {...(Platform.OS === 'android'
                    ? {}
                    : { entering: FadeOut.delay(1000) })}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  pointerEvents="none"
                >
                  {props.shareNode}
                </Animated.View>
              )}
              {/* todo 轮播要提取一下 */}
              {/* <Animated.View style={$imageAnimationStyle}> */}
              <Animated.View
                style={[
                  $scaleAnimatedStyles,
                  isZooming ? { zIndex: DEFAULT_SHEET_ZINDEX + 4 } : {}
                ]}
              >
                {/* @ts-ignore */}
                <SwiperFlatList
                  ref={swiperRef}
                  data={images || []}
                  {...(Platform.OS === 'android'
                    ? { onChangeIndex: onChangeAndroidIndex }
                    : { onViewableItemsChanged: debouncedIndexChangeHandler })}
                  renderItem={({ item, index }) => (
                    <Image
                      key={item.photoId}
                      source={item.url}
                      // source={images[props.index].url}
                      style={{
                        width,
                        height: imageHeight
                        // backgroundColor: '#000'
                      }}
                      contentFit="contain"
                      tosSize="size1"
                    />
                  )}
                  keyExtractor={item => item.photoId}
                ></SwiperFlatList>
              </Animated.View>
              <View style={[st.$points, $zoomStyle]}>
                <Text style={st.$pointText}>
                  {currentIndex + 1}/{images.length}
                </Text>
              </View>
            </View>
          </GestureDetector>
          <Animated.View
            style={[{ marginTop: 10 }, $zoomStyle]}
            pointerEvents="box-none"
          >
            <ThumbList
              list={images}
              containerWidth={getScreenSize('width')}
              itemSize={36}
              goto={onGoto}
              ref={thumblistRef}
            />
          </Animated.View>
          <Animated.View
            entering={FadeIn}
            layout={Layout.duration(2000)}
            pointerEvents="box-none"
            style={[
              styles($footer, $footerCommon, {
                bottom: Math.max(
                  Number($containerInsets.paddingBottom ?? 0),
                  16
                )
              }),
              $zoomStyle
            ]}
          >
            {typeof props.renderBottomLeftSlot === 'function'
              ? props.renderBottomLeftSlot(images[props.index], {
                  close: props.onClose || (() => {})
                })
              : props.renderBottomLeftSlot}
            <TouchableOpacity style={styles($btnSave)} onPress={saveImage}>
              <Icon icon="download" size={20} />
              <Text style={$btnText}>保存至相册</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <DoubleClickLike ref={doubleClickLikeRef}></DoubleClickLike>
      </Animated.View>
    </Portal>
  );

  function saveImage() {
    const images = imagesRef.current;
    if (!images || !images.length) return;

    reportClick('pic_detail', {
      imageid: images[currentIndex]?.photoId,
      status: props.removeMark ? 'disable' : 'normal',
      ...props.reportParams
    });

    const url = images[currentIndex]?.url;
    if (url) {
      showLoading();
      savePicture(url, props.removeMark ? false : true)
        .then(r => {
          console.log('[save image succ]');
          hideLoading();
          showToast('保存成功~');
        })
        .catch(e => {
          console.log('[save image err]', e, url);
          hideLoading();
          showToast('保存失败！');
        });
    } else {
      catchErrorLog('save_image_err', { images, index: currentIndex });
      showToast('保存失败！');
    }
  }

  function onChangeIndex(params: { changed: { index: number }[] }) {
    const index = params.changed?.[0]?.index;
    setCurrentIndex(index);
    thumblistRef.current?.gotoIndex(index);
  }

  function onChangeAndroidIndex({ index }: { index: number }) {
    setCurrentIndex(index);
    thumblistRef.current?.gotoIndex(index);
  }

  function onGoto(index: number) {
    const current = swiperRef.current?.getCurrentIndex();
    if (current !== index) {
      setCurrentIndex(index);
      swiperRef.current?.scrollToIndex({ index });
    }
  }

  async function onDebug() {
    const images = imagesRef.current;
    if (!images || !images.length) return;
    const item = images[swiperRef.current?.getCurrentIndex() || 0];
    console.log('item-----', item);
    if (useStorageStore.getState().debugMode) {
      try {
        const result = await GetImagegenProto({ photoId: item.photoId });
        await Clipboard.setStringAsync(JSON.stringify(result));
        showToast('复制成功');
      } catch (e) {
        showToast('复制失败，请重试~');
      }
    }
  }
}

export const PreviewImageGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [removeMark, setRemoveMark] = useState(false);
  const [list, setList] = useState<PreviewImageProps['list']>([]);
  const [index, setIndex] = useState(0);
  const [shareNode, setShareNode] = useState<ReactNode>(null);
  const [imageRatio, setImageHeight] = useState(0);
  const renderBottomLeftSlotRef = useRef<
    PreviewImageProps['renderBottomLeftSlot'] | null
  >(null);
  const renderTopRightSlotRef = useRef<
    PreviewImageProps['renderTopRightSlot'] | null
  >(null);

  const doubleClickLikeHandlerRef = useRef<
    PreviewImageProps['onDoubleClickLike'] | undefined
  >();
  const reportParamsRef = useRef<
    PreviewImageProps['reportParams'] | undefined
  >();

  useEffect(() => {
    const register = () => {
      PreviewImageSingleton.showPreviewImages = ({
        index,
        list,
        shareNode,
        imageRatio,
        renderBottomLeftSlot,
        renderTopRightSlot,
        onDoubleClickLike,
        reportParams,
        removeMark = false
      }: PreviewImageProps) => {
        unstable_batchedUpdates(() => {
          doubleClickLikeHandlerRef.current = onDoubleClickLike;
          renderBottomLeftSlotRef.current = renderBottomLeftSlot;
          renderTopRightSlotRef.current = renderTopRightSlot;
          setIndex(index);
          setVisible(true);
          setList(list);
          setShareNode(shareNode || null);
          setImageHeight(imageRatio || 0);
          reportParamsRef.current = reportParams;
          setRemoveMark(removeMark);
        });
      };
      PreviewImageSingleton.hidePreviewImages = () => {
        // setIndex(0);
        // setList([]);
        // setShareNode(null);
        // setImageHeight(0);
        setVisible(false);
      };
    };
    register();
  }, []);

  return (
    <PreviewImageModal
      index={index}
      isVisible={visible || false}
      removeMark={removeMark}
      list={list}
      shareNode={shareNode}
      imageRatio={imageRatio}
      renderBottomLeftSlot={renderBottomLeftSlotRef.current || undefined}
      renderTopRightSlot={renderTopRightSlotRef.current || undefined}
      onClose={() => {
        setVisible(false);
        setIndex(0);
      }}
      onDoubleClickLike={doubleClickLikeHandlerRef.current}
      reportParams={reportParamsRef.current}
    />
  );
};

export const showPreviewImages = (payload: PreviewImageProps) =>
  PreviewImageSingleton.showPreviewImages(payload);
export const hidePreviewImages = () => {
  PreviewImageSingleton.hidePreviewImages();
};
