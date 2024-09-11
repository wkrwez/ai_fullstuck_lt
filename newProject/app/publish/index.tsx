import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  Switch,
  TextInput,
  TextInputContentSizeChangeEventData,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { DraggableGrid } from 'react-native-draggable-grid';
import {
  GestureDetector,
  PanGestureHandler,
  ScrollView
} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { GenPhotoStory, PublishPhoto } from '@/src/api/makephotov2';
import { GetImagegenProto } from '@/src/api/makephotov2';
import { checkSecurity } from '@/src/api/utils';
import { Socket } from '@/src/api/websocket';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { hideLoading, showLoading, showToast } from '@/src/components';
import { BounceView } from '@/src/components/animation';
import { DeleteButton } from '@/src/components/deleteButton';
import { TakePhotoButton } from '@/src/components/detail/takePhotoButton';
import { MakePhotoEvents } from '@/src/components/makePhotoV2/constant';
import {
  hidePreviewImages,
  showPreviewImages
} from '@/src/components/previewImageModal';
import { PrimaryButton } from '@/src/components/primaryButton';
import useNotification from '@/src/components/v2/notification/hook';
import { useKeyboard } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useConfigStore } from '@/src/store/config';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import {
  AdviceTitle,
  SelectedItem,
  usePublishStore
} from '@/src/store/publish';
import { EnotiType } from '@/src/store/storage';
import { catchErrorLog, logWarn } from '@/src/utils/error-log';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { omit } from '@/src/utils/omit';
import {
  getPageID,
  reportClick,
  reportExpo,
  reportPage
} from '@/src/utils/report';
import { Source } from '@/src/utils/report';
import { AdviceInput } from '@Components/adviceList';
import { AlbumSheet } from '@Components/album';
import { Button } from '@Components/button';
import { Icon } from '@Components/icons';
import { IconChecked } from '@Components/icons';
import { Image } from '@Components/image';
import { RollButton } from '@Components/makePhotoV2/rollButton';
import { Loading } from '@Components/promptLoading';
import { Screen } from '@Components/screen';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { savePicture } from '@Utils/savePicture';
import { uuid } from '@Utils/uuid';
import { onTakePhoto } from '../make-photo/onTakePhoto';
import { Photo } from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { CommonActions } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

const bgColor = '#4D5A70';

const st = StyleSheet.create({
  $previewItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 6,
    overflow: 'hidden'
  },
  $addImageIcon: {
    backgroundColor: '#2F333D',
    ...StyleSheet.columnStyle,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  },
  $previewCont: {
    padding: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.08)
  },
  $previewWrap: {
    flexWrap: 'wrap',
    gap: 10,
    width: 260
  },
  $formItem: {
    // marginHorizontal: 9,
    // backgroundColor: bgColor,
    padding: 15,
    borderRadius: 10
  },
  $tip: {
    position: 'absolute',
    bottom: 11,
    right: 10
  },
  $text: {
    fontSize: 12,
    fontWeight: '400',
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.4)
  },
  $textinput: {
    color: StyleSheet.currentColors.white,
    textAlign: 'justify',
    fontWeight: '500',
    fontSize: 16
  },
  $textinput2: {
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.87),
    textAlign: 'justify',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 33
  },
  $checkWrap: {
    ...StyleSheet.circleStyle,
    ...StyleSheet.centerStyle,
    width: 12,
    height: 12,
    backgroundColor: '#ccc'
  },
  $checkedWrap: {
    backgroundColor: '#6ED4FF'
  },
  $tipWrap: {
    ...StyleSheet.rowStyle,
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: 8,
    ...StyleSheet.rowStyle
  },
  $tipText: {
    marginLeft: StyleSheet.spacing.xxs,
    color: StyleSheet.hex(StyleSheet.currentColors.white, 0.7)
  },
  $publishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: StyleSheet.currentColors.white
  },
  $publishButtonTextSm: {
    fontSize: 12
  },
  $error: {
    color: StyleSheet.currentColors.red
  },
  $publishButon: {}
});

const $topButton: ViewStyle = {
  position: 'absolute',
  top: -12,
  right: 0
};

// const page_visit_id = uuid();
const theme = StyleSheet.currentColors.subset.blue;

let PIC_WRITE_FLAG = 0;
export default function Publish() {
  const [isSave, setSaveState] = useState(true);
  const [showAlbum, setShowAlbum] = useState(false);
  const { photos } = usePublishStore(
    useShallow(state => ({ photos: state.photos }))
  );
  const showKeyboard = useKeyboard();
  const { paddingBottom } = useSafeAreaInsetsStyle(['bottom'], 'padding');
  const titleRef = useRef<TextInput>(null);
  const storyRef = useRef<TextInput>(null);
  const titleTextRef = useRef('');
  const storyTextRef = useRef('');
  const submitDisRef = useRef(false);
  const currentStoryIdRef = useRef('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [showAdviceInput, setShowAdviceInput] = useState(false);
  const [showStoryAdviceInput, setShowStoryAdviceInput] = useState(false);
  const navigation = useNavigation();
  const [advicing, setAdvicing] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [contentHeight, setContentHeight] = useState(178);
  const { lishi } = useLocalSearchParams();
  const recTagsRef = useRef<AdviceTitle[]>();

  const showRecommend = useSharedValue(false);
  const showStoryTag = useSharedValue(false);

  const $recommendStyle = useAnimatedStyle(() => {
    return {
      opacity: showRecommend.value ? 1 : 0,
      pointerEvents: showRecommend.value ? 'auto' : 'none'
    };
  });

  const $storyRecommendStyle = useAnimatedStyle(() => {
    return {
      opacity: showStoryTag.value ? 1 : 0,
      pointerEvents: showStoryTag.value ? 'auto' : 'none'
    };
  });

  // 数据上报相关
  const startAdviceTimeRef = useRef(0);
  const firstWordTimeRef = useRef(0);
  const picwriteIdRef = useRef('');

  useEffect(() => {
    // 延迟一会儿报
    setTimeout(() => {
      reportPage('page_view');
    }, 100);
    setStory('');
    if (lishi) {
      onInvokeAddPhoto();
    }

    const { keyword } = useMakePhotoStoreV2.getState();
    if (keyword) {
      setStory(
        keyword
          .split(',')
          .map(i => `#${i}#`)
          .join(' ')
      );
    }

    useConfigStore
      .getState()
      .getConfig('1011', true)
      .then(res => {
        const recTags = res as string[];

        if (recTags.length) {
          recTagsRef.current = recTags.map((text, index) => ({
            text,
            traceid: '',
            index: index + 1
          }));
        }
      })
      .catch(e => {
        catchErrorLog('1011_config_error', e);
      });
  }, []);

  useEffect(() => {
    titleTextRef.current = title;
  }, [title]);

  useEffect(() => {
    storyTextRef.current = story;
  }, [story]);

  const mainPhoto = useMemo(() => {
    return photos && photos[0];
  }, [photos]);

  const validTitle = useMemo(() => {
    if (!title.length) return false;
    if (title.length > 30) return false;
    return true;
  }, [title]);

  const validStory = useMemo(() => {
    // if (!story.length) return false;
    if (story.length > 500) return false;
    return true;
  }, [story]);

  const blurAll = () => {
    storyRef.current?.blur();
    titleRef.current?.blur();
  };

  const submitDis = useMemo(() => {
    return !validTitle || !validStory || !photos;
  }, [validTitle, validStory, photos]);

  const { notificationVisible, setNotificationVisible, setInitLock } =
    useNotification({
      expire: 7,
      signal: EnotiType.notiReachDatedByPublish
    });

  const onCloseNotification = () => {
    setInitLock(true);
    setNotificationVisible(false);
  };

  const onContentSizeChange = ({
    nativeEvent
  }: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (nativeEvent.contentSize.height > 178) {
      setContentHeight(nativeEvent.contentSize.height);
    }
  };
  useEffect(() => {
    submitDisRef.current = submitDis;
  }, [submitDis]);

  const publishButton = useMemo(() => {
    return (
      <BounceView style={$topButton}>
        <Button
          style={{
            backgroundColor: StyleSheet.currentColors.brand1,
            borderRadius: 500,
            paddingHorizontal: 16,
            paddingVertical: 4,
            height: 32
          }}
          onPress={onSubmit}
          disabled={submitDis}
        >
          <View
            style={[StyleSheet.rowStyle, { justifyContent: 'center', gap: 3 }]}
          >
            <Icon icon="publish" size={12} />
            <Text style={[st.$publishButtonText, st.$publishButtonTextSm]}>
              发布
            </Text>
          </View>
        </Button>
      </BounceView>
    );
  }, [submitDis, onSubmit]);

  const primaryPublishButton = useMemo(() => {
    return (
      <View
        style={[
          StyleSheet.rowStyle,
          {
            backgroundColor: theme.black,
            paddingTop: 8,
            paddingBottom: +(paddingBottom || 0) + 8,
            justifyContent: 'center'
          }
        ]}
      >
        <PrimaryButton onPress={onSubmit} disabled={submitDis}>
          <View
            style={[StyleSheet.rowStyle, { justifyContent: 'center', gap: 5 }]}
          >
            <Icon icon="publish" size={15} />
            <Text style={st.$publishButtonText}>发布到社区</Text>
          </View>
        </PrimaryButton>
      </View>
    );
  }, [paddingBottom, onSubmit, submitDis]);

  return (
    <>
      <Screen
        theme="dark"
        title="发布作品"
        headerRight={() => showKeyboard && publishButton}
        contentContainerStyle={{
          height: 'auto',
          paddingHorizontal: 8, //为什么是9 ...
          minHeight: '100%'
        }}
        safeAreaEdges={['top']}
        screenStyle={{ backgroundColor: theme.black }}
      >
        <ScrollView
          style={{
            flex: 1
          }}
          overScrollMode={'never'}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 64
          }}
        >
          <View style={[st.$formItem, { paddingBottom: 0 }]}>
            <TextInput
              allowFontScaling={false}
              style={[
                st.$textinput,
                {
                  borderBottomWidth: 0.5,
                  borderColor: StyleSheet.hex(
                    StyleSheet.currentColors.white,
                    0.08
                  ),
                  paddingBottom: 16,
                  paddingRight: 65
                }
              ]}
              numberOfLines={1}
              placeholder="好的标题会获得更多赞哦"
              placeholderTextColor="rgba(255,255,255,0.5)"
              ref={titleRef}
              maxLength={30}
              value={title}
              onChangeText={t => {
                // if (t.length > 20) {
                //   setTitle(t.slice(0, 20));
                //   return;
                // }
                setTitle(t);
              }}
              onFocus={() => {
                showRecommend.value = true;
                setShowAdviceInput(true);
                picwriteIdRef.current = uuid();
                PIC_WRITE_FLAG = 1;
                reportExpo(
                  'picwrite_title_edit',
                  {
                    title_edit_id: picwriteIdRef.current,
                    title
                  },
                  'start'
                );
              }}
              onBlur={() => {
                showRecommend.value = false;
                setShowAdviceInput(false);
                PIC_WRITE_FLAG = 0;
                reportExpo(
                  'picwrite_title_edit',
                  {
                    title_edit_id: picwriteIdRef.current,
                    title
                  },
                  'end'
                );
              }}
            />

            <Text
              style={[
                st.$tip,
                {
                  bottom: Platform.OS === 'ios' ? 14 : 20
                },
                st.$text,
                !validTitle && title.length ? st.$error : null
              ]}
            >
              {!showKeyboard && !title.length
                ? '必填'
                : `字数(${title.length}/30)`}
            </Text>
          </View>

          <View style={[st.$formItem, advicing ? null : { paddingTop: 6 }]}>
            <View
              style={{
                minHeight: contentHeight
                // overflow: 'scroll'
              }}
            >
              {advicing ? (
                <Text style={[st.$textinput2]}>{story}</Text>
              ) : (
                <TextInput
                  allowFontScaling={false}
                  style={[
                    st.$textinput2,
                    // { backgroundColor: '#ff0000' },
                    { flex: 1 }
                  ]}
                  multiline
                  placeholder="添加正文"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={story}
                  ref={storyRef}
                  textAlignVertical="top"
                  onChangeText={setStory}
                  onContentSizeChange={onContentSizeChange}
                  onFocus={() => {
                    if (recTagsRef.current) {
                      showStoryTag.value = true;
                      setShowStoryAdviceInput(true);
                    }
                  }}
                  onBlur={() => {
                    showStoryTag.value = false;
                    setShowStoryAdviceInput(false);
                  }}
                />
              )}
              {adviceLoading && <Loading style={{ marginBottom: 10 }} />}
            </View>

            <View
              style={[
                st.$tip,
                StyleSheet.columnStyle,
                { alignItems: 'flex-end', zIndex: 2 }
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setStory('');
                  setContentHeight(178);
                }}
              >
                <Icon icon="makephoto_remove2" />
              </TouchableOpacity>
              <Text
                style={[
                  st.$text,
                  !validStory && story.length ? st.$error : null
                ]}
              >
                字数({story.length}/500)
              </Text>
            </View>

            <View style={StyleSheet.rowStyle}>
              <RollButton
                loading={adviceLoading}
                text="让小狸瞎编"
                onPress={() => onAdviceStory()}
              />
            </View>
          </View>

          {/* <View style={{ minHeight: '100%' }}> */}
          {/* <Pressable onPress={blurAll}> */}
          <View style={st.$previewCont}>
            <DraggableGrid
              numColumns={3}
              style={st.$previewWrap}
              renderItem={item => {
                if (item.key === 9999) {
                  if (photos.length >= 9) {
                    return <></>;
                  }
                  return (
                    <TouchableOpacity
                      style={[st.$previewItem, st.$addImageIcon]}
                      onPress={onInvokeAddPhoto}
                    >
                      <Icon icon="makephoto_preview_add" />
                    </TouchableOpacity>
                  );
                }
                return (
                  <View
                    style={st.$previewItem}
                    // @ts-ignore
                    key={item.photoId}
                  >
                    <Image
                      // @ts-ignore
                      source={formatTosUrl(item.url || '', { size: 'size4' })}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </View>
                );
              }}
              // @ts-ignore
              data={photos
                .map((i, index) => ({ ...i, key: i.photoId, index }))
                // @ts-ignore
                .concat({ key: 9999, disabledDrag: true })}
              onItemPress={item => {
                // @ts-ignore
                onPreviewImage(item.index);
              }}
              onDragRelease={data => {
                const newPhotoSet = data
                  .filter(item => item.key !== 9999)
                  .reduce((result, item, index) => {
                    // @ts-ignore
                    result[item.photoId] = {
                      ...item,
                      num: index + 1
                    };
                    return result;
                  }, {});
                usePublishStore.getState().changePhotos(newPhotoSet);
              }}
            />
          </View>

          <View style={st.$tipWrap}>
            <View style={[StyleSheet.rowStyle, { gap: 4 }]}>
              <Icon icon="makephoto_download" size={11}></Icon>
              <Text
                style={{
                  color: StyleSheet.currentColors.white,
                  fontSize: 14,
                  fontWeight: '400'
                }}
              >
                保存至相册
              </Text>
            </View>
            <Switch
              trackColor={{
                false: '#69707b',
                true: '#6fd3fe'
              }}
              thumbColor={StyleSheet.currentColors.white}
              ios_backgroundColor={'#69707b'}
              onValueChange={isSave => {
                reportClick(MakePhotoEvents.save_image, { isSave });
                setSaveState(isSave);
              }}
              value={isSave}
            />
          </View>

          {Platform.OS === 'android' && primaryPublishButton}
          {/* </Pressable> */}
          <AlbumSheet
            showDrawingEntry={true}
            isVisible={showAlbum}
            onClose={() => {
              setShowAlbum(false);
            }}
          />
          {/* </View> */}
        </ScrollView>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center'
            },
            $recommendStyle
          ]}
        >
          <AdviceInput
            refreshParams={mainPhoto}
            fetchList={fetchAdviceList}
            visitID={getPageID()}
            reportEditIdRef={picwriteIdRef}
            visible={showAdviceInput}
            onSelect={v => {
              setTitle(t => t + v);
              // const photoId = usePublishStore.getState().photos[0]?.photoId;
              // if (photoId)
              //   reportClick('picwrite_rec_title', {
              //     page_visit_id,
              //     title: v
              //   });
            }}
          />
        </Animated.View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center'
            },
            $storyRecommendStyle
          ]}
        >
          <AdviceInput
            refreshParams={{}}
            refresh={false}
            fetchList={() => Promise.resolve(recTagsRef.current || [])}
            visitID={getPageID()}
            visible={showStoryAdviceInput}
            onSelect={v => {
              setStory(t => t + v);
            }}
          ></AdviceInput>
        </Animated.View>
      </Screen>
      {Platform.OS === 'ios' && primaryPublishButton}
    </>
  );

  function onInvokeAddPhoto() {
    usePublishStore.getState().getAlbumPhotos(true);
    reportClick(MakePhotoEvents.add_image_click);
    blurAll();
    setShowAlbum(true);
  }

  function fetchAdviceList() {
    return usePublishStore.getState().getAdvicePrompts(storyTextRef.current);
  }

  function onSubmit() {
    if (submitDisRef.current) return;

    const photoIds = usePublishStore
      .getState()
      .photos.map(i => i.photoId)
      .filter((item): item is string => typeof item === 'string');
    const story = storyTextRef.current || ' ';
    const title = titleTextRef.current || story.slice(0, 30);
    if (!photoIds.length) {
      showToast('请选择图片');
      return;
    }
    submitDisRef.current = true;
    showLoading();
    stopAdvice();

    if (PIC_WRITE_FLAG) {
      reportExpo(
        'picwrite_title_edit',
        {
          title_edit_id: picwriteIdRef.current,
          title
        },
        'end'
      );
      PIC_WRITE_FLAG = 0;
    }
    PublishPhoto({
      photoIds,
      story,
      title,
      pt: {
        page: getPageID()
      }
    })
      .then(res => {
        reportExpo('publish_success', {
          sourceid: res.cardId
        });
        // resetRoute();

        if (isSave) {
          saveImages();
        }
        useMakePhotoStoreV2.getState().reset();
        usePublishStore.getState().reset();
        if (res.cardId) {
          router.push({
            pathname: '/feed' as RelativePathString,
            params: {
              appendId: res.cardId
            }
          });
        }
      })
      .catch((e: ErrorRes) => {
        console.warn(e, '发布失败');
        if (checkSecurity(e)) {
          showToast('安全审核不通过，请重新编辑~');
        } else {
          showToast('发布失败，请重试');
        }
      })
      .finally(() => {
        submitDisRef.current = false;
        hideLoading();
      });

    reportClick('submit', {
      story,
      title,
      photo_ids: JSON.stringify(photoIds)
    });
  }

  function saveImages() {
    const urls = usePublishStore.getState().photos.map(i => i.url);
    urls.forEach(url => {
      if (url) {
        savePicture(url, true);
      }
    });
  }

  function resetRoute() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'feed/index',
            params: {
              notificationVisible: notificationVisible
            }
          }
        ]
      })
    );
  }

  function onAdviceStory(retry?: boolean) {
    if (advicing) {
      stopAdvice();

      reportExpo(
        'picwrite_api',
        {
          trace_id: currentStoryIdRef.current,
          total_time_cost: Date.now() - startAdviceTimeRef.current,
          first_word_time_cost: firstWordTimeRef.current,
          end_type: 'user_stop'
        },
        'get_content'
      );
      reportClick('picwrite_stop_button');
      return;
    }

    const { photoId } = usePublishStore.getState().photos[0] || {};
    if (photoId) reportClick('picwrite_button');
    if (!photoId) {
      showToast('请选择图片~');
      return;
    }
    let newStory = storyTextRef.current ? storyTextRef.current + '\n' : '';
    setAdvicing(true);
    setAdviceLoading(true);
    let loaded = false;
    if (Platform.OS === 'ios') {
      Haptics.impactAsync();
    }
    const newMsgId = uuid();
    currentStoryIdRef.current = newMsgId;
    startAdviceTimeRef.current = Date.now();
    let first_word_time_cost = Date.now();
    GenPhotoStory(
      {
        photoId,
        title: titleTextRef.current || '',
        imageRegrasp: !retry,
        pt: {
          page: getPageID()
        }
      },
      ({ delta, finished }, msgId, traceid) => {
        if (!first_word_time_cost) {
          first_word_time_cost = Date.now() - first_word_time_cost;
          firstWordTimeRef.current = first_word_time_cost;
        }
        if (msgId !== currentStoryIdRef.current) return;
        newStory += delta || '';
        setStory(newStory);
        Haptics.selectionAsync();
        if (!loaded) {
          loaded = true;
          setAdviceLoading(false);
        }
        if (finished) {
          setStory(newStory);
          reportExpo(
            'picwrite_api',
            {
              trace_id: traceid,
              total_time_cost: Date.now() - startAdviceTimeRef.current,
              first_word_time_cost,
              end_type: 'api_end'
            },
            'get_content'
          );

          showToast('小狸的故事写好了，快看看吧~');
          console.log('finished-------', newStory);
          setAdvicing(false);
        }
      },
      e => {
        setAdvicing(false);
        setAdviceLoading(false);
        if (checkSecurity(e) && !retry) {
          // 只重试一次
          setStory('');
          onAdviceStory(true);
        } else {
          showToast('生成小故事失败~');
        }
        console.log(e);

        logWarn('GenPhotoStory', e);
      },
      newMsgId
    );

    Socket.events.on(
      'disconnect',
      () => {
        stopAdvice();
        showToast('当前网络信号差，请重试~');
      },
      true
    );
    reportClick('edit_button');
    // requestAnimationFrame()
    // string photo_id = 1;
    // string title = 2;
    // bool image_regrasp = 3; //是否重新进行图片理解
  }

  function stopAdvice() {
    setAdvicing(false);
    setAdviceLoading(false);
    currentStoryIdRef.current = '';
  }

  function onFocus() {
    // todo 数据上报
    // console.log('focus', focus);
    // const photoId = usePublishStore.getState().photos[0]?.photoId;
    // if (photoId && !focus) {
    //   reportClick(
    //     'picwrite_title_edit',
    //     { page_visit_id, title: titleTextRef.current },
    //     'end'
    //   );
    // } else if (photoId && focus) {
    //   reportClick(
    //     'picwrite_title_edit',
    //     { page_visit_id, title: titleTextRef.current },
    //     'start'
    //   );
    //   reportClick('picwrite_rec_title', {
    //     page_visit_id,
    //     title: titleTextRef.current
    //   });
    // }
    // setFocus(true);
    // setFocus(!focus);
  }

  function onRemovePhoto(item: SelectedItem) {
    const { photosSet, changePhotos } = usePublishStore.getState();
    const newPhotoSet = omit(photosSet, [item?.photoId]);
    changePhotos(newPhotoSet);
  }

  function onPreviewImage(index: number) {
    const list = usePublishStore.getState().photos;

    showPreviewImages({
      index: index,
      list: photos,
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
          onPress={close => {
            if (photo.photoId) {
              usePublishStore
                .getState()
                .removePhotos({ [photo.photoId]: { ...photo, num: 0 } });
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
              onTakePhoto({
                photoId: photo.photoId,
                source: Source.DRAWING_WITH_PROMPT
              });
            hidePreviewImages();
          }}
        ></TakePhotoButton>
      )
    });
  }
}
