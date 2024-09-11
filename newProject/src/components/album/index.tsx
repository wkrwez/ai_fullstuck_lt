import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp
} from 'react-native-reanimated';
import { TakePhoto } from '@/src/api';
import { GetImagegenProto } from '@/src/api/makephotov2';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { DetailInfo, useDetailStore } from '@/src/store/detail';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { SelectedItem, usePublishStore } from '@/src/store/publish';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet, getScreenSize } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportMakePhotoTrack } from '@/src/utils/report';
import { Source } from '@/src/utils/report';
import { BounceView, FadeView } from '@Components/animation';
import { Button } from '@Components/button';
import { Checkbox } from '@Components/checkbox';
import { TakePhotoButton } from '@Components/detail/takePhotoButton';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import {
  hidePreviewImages,
  showPreviewImages
} from '@Components/previewImageModal';
import { SheetModal, SheetModalProps } from '@Components/sheet';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { EmptyPlaceHolder } from '../Empty';
import { DeleteButton } from '../deleteButton';
import { ElementSuffix, MakePhotoEvents } from '../makePhotoV2/constant';
import { PrimaryButton } from '../primaryButton';
import { onTakePhoto } from '@/app/make-photo/onTakePhoto';
import {
  Photo,
  PhotoProgress,
  PhotoTaskState,
  Role
} from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import type { PartialMessage } from '@bufbuild/protobuf';
import { PhotoTask } from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';
import { useShallow } from 'zustand/react/shallow';

/** interface */
export interface AlbumProps extends SheetModalProps {
  showDrawingEntry?: boolean;
  // data: DetailInfo;
  resetLoading?: () => void;
}

// interface SelectedItem extends PartialMessage<Photo> {
//   num: number;
// }
/** interface end */

/** components */
interface ImageItemProps {
  url: string;
  checked: boolean;
  onChange: (v: PartialMessage<Photo>) => void;
  value: PartialMessage<Photo>;
  selectIndex: number;
  index: number;
  onPreview: (index: number) => void;
}

function ImageItem(props: ImageItemProps) {
  return (
    <View style={imageStyle.$wrap}>
      <Pressable
        onPress={() => {
          props.onPreview(props.index + 1);
          // props.onChange(props.value);
        }}
      >
        <Image
          style={StyleSheet.imageFullStyle}
          source={formatTosUrl(props.url, { size: 'size4' })}
        />
      </Pressable>

      {props.checked && (
        <FadeView pointerEvents="none" style={imageStyle.$mask}></FadeView>
      )}

      <Checkbox
        hitSlop={40}
        style={imageStyle.$checkbox}
        checked={props.checked}
        content={() => (
          <Text
            style={{
              width: 22,
              height: 22,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: '600',
              textAlign: 'center',
              color: StyleSheet.currentColors.white
            }}
          >
            {props.selectIndex}
          </Text>
        )}
      />
      <Pressable
        style={[imageStyle.$checkbox, { width: 22, height: 22 }]}
        onPress={() => {
          props.onChange(props.value);
        }}
      ></Pressable>
    </View>
  );
}

const imageStyle = StyleSheet.create({
  $wrap: {
    width: 108,
    height: 145,
    borderRadius: 6,
    overflow: 'hidden'
  },
  $checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    borderRadius: 500
  },
  $mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.4)
  }
});
/** components end */

export function AlbumSheet(props: AlbumProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const [value, setValue] = useState<string>('');
  const loadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const [currentSelected, setCurrentSelected] = useState<{
    [key in string]: SelectedItem;
  }>({});
  const valueRef = useRef<string>('');

  const { albumPhotos, photosSet, changePhotos } = usePublishStore(
    useShallow(state => ({
      albumPhotos: state.albumPhotos,
      photosSet: state.photosSet,
      changePhotos: state.changePhotos
    }))
  );

  const len = useMemo(() => {
    return Object.values(photosSet).filter(i => i).length;
  }, [photosSet]);

  const onPressGoToDrawing = () => {
    props.onClose?.();
    useMakePhotoStoreV2.getState().reset();
    router.push({
      pathname: '/make-photo/'
    });
  };

  // useEffect(() => {
  //   if (!props.isVisible) {
  //     // changePhotos({}); // 清空选择
  //   }
  // }, [props.isVisible]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return (
    <SheetModal
      maskShown={true}
      maskOpacity={0.8}
      closeBtn={true}
      remainHeight={0}
      //   titleBarStyle={{ display: 'none' }}
      {...props}
      style={{
        backgroundColor: StyleSheet.currentColors.subset.blue.black,
        ...props.style
      }}
    >
      <View style={[st.$wrap]}>
        <View
          style={[
            StyleSheet.rowStyle,
            { justifyContent: 'space-between', marginBottom: 20 }
          ]}
        >
          <TouchableOpacity onPress={props.onClose}>
            <Icon icon="close2" size={20} />
          </TouchableOpacity>
          <Text
            preset="title"
            style={{
              fontSize: 14,
              color: StyleSheet.currentColors.white,
              textAlign: 'center'
            }}
          >
            狸史相册
          </Text>
          {/* <TouchableOpacity
            onPress={() => {
              props.onClose();
            }}
          > */}
          <Text style={{ color: '#FF6A3B', fontWeight: '500', fontSize: 14 }}>
            {/* {len > 0 ? `已选(${len})` : '选择'} */}
          </Text>
          {/* <Icon icon="close" /> */}
          {/* </TouchableOpacity> */}
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          <View style={st.$imageList}>
            {albumPhotos.length ? (
              albumPhotos.map((item, index) => (
                <ImageItem
                  value={item}
                  onChange={v => {
                    if (len >= 9 && !photosSet[item.photoId || '']) {
                      showToast('最多选择9张图片发布~');
                      return;
                    }
                    let selectedPhoto = '';
                    try {
                      selectedPhoto = JSON.stringify(photosSet);
                    } catch (error) {
                      logWarn('埋点上报【选中图片】序列化失败', error);
                    }
                    reportMakePhotoTrack(
                      MakePhotoEvents.choose_image,
                      PageState.preview,
                      ElementSuffix.choose_image,
                      {
                        selected_photo: selectedPhoto
                      }
                    );
                    changeSelect(v);
                  }}
                  url={item.url || ''}
                  index={index}
                  checked={!!photosSet[item.photoId || '']}
                  selectIndex={photosSet[item.photoId || '']?.num}
                  onPreview={onPreview}
                  // {...item}
                  key={item.photoId}
                />
              ))
            ) : (
              <EmptyPlaceHolder
                button={props.showDrawingEntry}
                theme={Theme.DARK}
                type="emptyBegging"
                buttonText="去炖图"
                style={$emptyStyle}
                onButtonPress={onPressGoToDrawing}
              >
                空空如也
              </EmptyPlaceHolder>
            )}
          </View>
        </ScrollView>
        <View
        // entering={FadeInDown.duration(300)}
        // exiting={FadeOutUp.duration(500)}
        >
          <View style={[st.$buttonWrap, !len ? { height: 0 } : null]}>
            {len ? (
              <>
                <DeleteButton onPress={onDeletePhoto} />
                <BounceView>
                  <PrimaryButton
                    width={100}
                    height={46}
                    onPress={() => {
                      reportMakePhotoTrack(
                        MakePhotoEvents.go_to_publish,
                        PageState.preview,
                        ElementSuffix.go_to_publish
                      );
                      props.onClose();
                      router.push('/publish/');
                    }}
                  >
                    <View
                      style={[
                        StyleSheet.rowStyle,
                        { justifyContent: 'center', gap: 5 }
                      ]}
                    >
                      <Icon icon="publish" size={15} />
                      <Text
                        style={{
                          fontWeight: '600',
                          color: StyleSheet.currentColors.white
                        }}
                      >
                        去发布{len > 0 ? '(' + len + ')' : ''}
                      </Text>
                    </View>
                    {/* 去发布{len} */}
                  </PrimaryButton>
                </BounceView>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </SheetModal>
  );

  function onMomentumScrollEnd() {
    if (debounceRef.current) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = undefined;
    }, 300);
    console.log('onMomentumScrollEnd');
    if (loadingRef.current) return;
    loadingRef.current = true;
    usePublishStore
      .getState()
      .getAlbumPhotos()
      .then(() => {
        loadingRef.current = false;
      })
      .catch(e => {
        console.log(e);
        loadingRef.current = false;
        showToast('拉取相册失败');
      });
  }

  function changeSelect(item: PartialMessage<Photo>) {
    if (!item?.photoId) return;

    const { photosSet } = usePublishStore.getState();
    const len = Object.keys(photosSet).length;
    if (!photosSet[item.photoId]) {
      changePhotos({
        ...photosSet,
        [item.photoId]: {
          ...item,
          num: len + 1
        }
      });
      return;
    }

    const { num } = photosSet[item.photoId];
    const newVal = Object.keys(photosSet).reduce(
      (result, key) => {
        if (photosSet[key].num > num) {
          result[key] = {
            ...photosSet[key],
            num: photosSet[key].num - 1
          };
        } else if (photosSet[key].num < num) {
          result[key] = photosSet[key];
        }
        return result;
      },
      {} as { [key in string]: SelectedItem }
    );
    changePhotos(newVal);
  }

  function onDeletePhoto(close: () => void) {
    // console.log('currentSelected-----', currentSelected);
    const { photosSet } = usePublishStore.getState();
    reportMakePhotoTrack(
      MakePhotoEvents.delete_image,
      PageState.preview,
      ElementSuffix.delete_image
    );
    usePublishStore
      .getState()
      .removePhotos(photosSet)
      .then(() => {
        showToast('删除成功');
        close();
        changePhotos({});
        // setCurrentSelected({});
      })
      .catch((e: ErrorRes) => {
        showToast('删除失败');
        logWarn('delete_photo', e);
      });
  }

  function onPreview(index: number) {
    showPreviewImages({
      index: index - 1,
      list: albumPhotos || [],
      // shareNode,
      renderTopRightSlot: photo => (
        <DeleteButton
          style={{
            height: 30,
            width: 50,
            paddingVertical: 0,
            paddingHorizontal: 0,
            borderRadius: 0,
            backgroundColor: ''
          }}
          // height={38}
          onPress={close => {
            if (photo.photoId) {
              usePublishStore
                .getState()
                .removePhotos({
                  [photo.photoId]: { ...photo, num: 0 }
                })
                .then(() => {
                  showToast('删除成功');
                })
                .catch(e => {
                  logWarn('DeleteButton', e);
                  showToast('删除失败');
                });
            }

            close();
            hidePreviewImages();
          }}
        />
      ),
      renderBottomLeftSlot: photo => (
        <TakePhotoButton
          onPress={() => {
            photo?.photoId &&
              onTakePhoto(
                {
                  photoId: photo.photoId,
                  source: Source.DRAWING_WITH_PROMPT
                },
                props.resetLoading
              );
            props.onClose?.();
            hidePreviewImages();
          }}
        ></TakePhotoButton>
      )
      // onDoubleClickLike: onLike
    });
  }
}

/* style */
const height = getScreenSize('height');
const st = StyleSheet.create({
  $wrap: {
    backgroundColor: StyleSheet.currentColors.subset.blue.black,
    padding: StyleSheet.spacing.md,
    borderRadius: 18,
    maxHeight: Math.max(height - 132, 480)
  },
  $imageList: {
    ...StyleSheet.rowStyle,
    // marginTop: 20,
    gap: 8,
    flexWrap: 'wrap',
    // maxHeight: height * 0.6,
    flex: 1
  },
  $buttonWrap: {
    ...StyleSheet.rowStyle,
    justifyContent: 'space-between',
    marginTop: 24,
    height: 46
    // marginBottom: 36
  }
});
/* style end */

const $emptyStyle: ViewStyle = {
  minHeight: 500
};
