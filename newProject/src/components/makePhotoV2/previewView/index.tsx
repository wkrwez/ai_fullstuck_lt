import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useCreditStore } from '@/src/store/credit';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { SelectedItem, usePublishStore } from '@/src/store/publish';
import { typography } from '@/src/theme';
import {
  $basicText,
  $flex,
  $flexCenter,
  $flexHStart,
  $flexRow
} from '@/src/theme/variable';
import { InvokeType } from '@/src/types';
import { catchErrorLog } from '@/src/utils/error-log';
import { getWaterMark } from '@/src/utils/getWaterMark';
import {
  addCommonReportParams,
  getPageID,
  reportClick
} from '@/src/utils/report';
import { savePicture } from '@/src/utils/savePicture';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Screen } from '@Components/screen';
import { Swiper } from '@Components/swiper';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import CreditCas, {
  CREDIT_LIMIT,
  CREDIT_TYPE,
  MINUS_BORDER_THEME2,
  MINUS_COLOR,
  MINUS_THEME2,
  PLUS_BORDER_THEME2,
  PLUS_COLOR,
  PLUS_THEME2,
  PURE_BORDER_MINUS2,
  PURE_BORDER_PLUS2
} from '../../credit-cas';
import { hideLoading, showLoading } from '../../loading';
import { PrimaryButton } from '../../primaryButton';
import { showToast } from '../../toast';
import Button, { EButtonType } from '../../v2/button';
import CreditWrapper from '../../v2/credit-wrapper';
import { BlueButton } from '../button';
import { strategyUpdateHandle } from '@/app/credit/error';
import { CensoredState } from '@/proto-registry/src/web/raccoon/common/state_pb';
import {
  Photo,
  PhotoProgress
} from '@/proto-registry/src/web/raccoon/makephoto/makephoto_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { useShallow } from 'zustand/react/shallow';

const MOCK1 = require('@Assets/mock/img1.jpg');
const MOCK2 = require('@Assets/mock/img2.jpg');

const data = [MOCK1, MOCK2, MOCK1];

const $pointItem = {
  width: 6,
  height: 6,
  backgroundColor: '#D9D9D9',
  borderRadius: 500,
  opacity: 0.3
};

const $pointItemCurrent = {
  opacity: 1
};

const $btnSave: ViewStyle = {
  ...StyleSheet.rowStyle,
  flex: 0,
  padding: 12,
  backgroundColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.14),
  borderRadius: 500
};

const $btnText: TextStyle = {
  marginLeft: 3,
  color: '#ffffff',
  fontWeight: '600'
};

const RETRY_ICON = require('@Assets/icon/makephoto/icon-retry.png');
const DEC1 = require('@Assets/makephoto/dec1.png');

interface PreviewViewProps {
  onBack: () => void;
  showAlbum: () => void;
  resetLoading?: () => void;
}
const theme = StyleSheet.currentColors.subset.blue;

const AnimatedLoading = () => {
  const spinValue = useSharedValue(0);
  useEffect(() => {
    spinValue.value = withRepeat(
      withTiming(360, { duration: 2000 }),
      -1, // -1表示无限循环
      false
    );
  }, []);
  const $animatedStyle = useAnimatedStyle(() => {
    const rotateKeyframes = interpolate(spinValue.value, [0, 360], [360, 0]);

    return {
      transform: [{ rotate: `${rotateKeyframes}deg` }]
    };
  });
  return (
    <Animated.View style={$animatedStyle}>
      <Icon icon="load_point" size={6}></Icon>
    </Animated.View>
  );
};

const LoadingPoints = ({
  photos
}: {
  photos: PartialMessage<PhotoProgress>[];
}) => {
  const len = 3 - (photos || []).length;
  const arr = new Array(len).fill(0);
  if (len <= 0) return [];
  return arr.map((_, index) => <AnimatedLoading key={index} />);
};

const ERROR_IMAGE = require('@Assets/makephoto/error.png');

export function PreviewView(props: PreviewViewProps) {
  const { pageState, photos } = useMakePhotoStoreV2(
    useShallow(state => ({
      pageState: state.pageState,
      photos: state.photos
    }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);
  const { width } = useScreenSize('window');
  const height = useMemo(() => {
    return ((width - 32) * 936) / 704;
  }, []);
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    if (pageState === PageState.preview) {
      // 更新策略
      // showLoading();
      strategyUpdateHandle(InvokeType.INVOKE_DRAWING_REDO);
      setCurrentIndex(0);
    }
  }, [pageState]);

  useEffect(() => {
    photos.forEach(item => {
      if (item.url) {
        Image.prefetch(item.url + getWaterMark());
      }
    });
  }, [photos]);

  const { totalCredits, consumption } = useCreditStore(
    useShallow(state => ({
      totalCredits: state.totalCredits,
      consumption: state.consumption
    }))
  );

  if (pageState !== PageState.preview) {
    return;
  }

  return (
    <Animated.View
      entering={FadeIn.delay(1000).duration(2000)}
      style={[StyleSheet.absoluteFill]}
    >
      <Screen
        title="炖图"
        theme="dark"
        safeAreaEdges={['bottom', 'top']}
        screenStyle={{
          // backgroundColor: '#495569'
          backgroundColor: theme.black
        }}
        headerLeft={() => {
          const moreThanLimit = totalCredits >= CREDIT_LIMIT;
          const theme = moreThanLimit ? CREDIT_TYPE.PLUS : CREDIT_TYPE.MINUS;
          return (
            <View style={{ position: 'absolute', left: 32 }}>
              <CreditCas
                theme={theme}
                text={`${totalCredits}`}
                borderColors={
                  moreThanLimit ? PLUS_BORDER_THEME2 : MINUS_BORDER_THEME2
                }
                pureBorderColor={
                  moreThanLimit ? PURE_BORDER_PLUS2 : PURE_BORDER_MINUS2
                }
                insetsColors={moreThanLimit ? PLUS_THEME2 : MINUS_THEME2}
                $customTextStyle={{
                  color: moreThanLimit ? PLUS_COLOR : MINUS_COLOR
                }}
                size={20}
                hasPad
              ></CreditCas>
            </View>
          );
        }}
        headerRight={() => (
          <TouchableOpacity onPress={goAlbum}>
            <Text style={{ color: '#7FD9FF', fontWeight: '500' }}>
              狸史相册
            </Text>
          </TouchableOpacity>
        )}
        onBack={props.onBack}
      >
        <View
          style={{
            padding: 16,
            flex: 1,
            width: width
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 10,
              fontWeight: '500',
              opacity: 0.8,
              color: StyleSheet.currentColors.white
            }}
          >
            图片已存进
            <Text
              onPress={goAlbum}
              color="#6eb5d4"
              style={{ marginBottom: 9, fontSize: 10 }}
            >
              狸史相册
            </Text>
          </Text>
          <Swiper
            data={photos || []}
            onChangeIndex={onChangeIndex}
            renderItem={({ item }: { item: PartialMessage<PhotoProgress> }) => {
              if (
                item.cencorState !== CensoredState.CENSORED_BLOCKED &&
                item.url
              ) {
                return (
                  <Image
                    key={item.photoId}
                    source={item.url || ''}
                    tosSize="size2"
                    // todo 暂时去掉此处的tos参数裁剪
                    // source={formatTosUrl(item.url || '', { size: 'size1' })}
                    // source={images[props.index].url}
                    style={{ width: width - 32, height }}
                  />
                );
              }
              return (
                <Image
                  key={item.photoId}
                  source={ERROR_IMAGE}
                  style={{ resizeMode: 'center', width: width - 32, height }}
                />
              );
            }}
            keyExtractor={(item: PartialMessage<PhotoProgress>) => item.photoId}
          ></Swiper>
          <View
            style={[
              StyleSheet.rowStyle,
              { gap: 6, marginTop: 15, justifyContent: 'center' }
            ]}
          >
            {photos.map((item, index) => (
              <View
                style={[$pointItem, index === currentIndex && { opacity: 1 }]}
                key={index}
              ></View>
            ))}

            <LoadingPoints photos={photos} />
            {/* <Icon icon="load_point" size={6}></Icon>
            <Icon icon="load_point" size={6}></Icon> */}
          </View>
          <View
            style={[
              StyleSheet.rowStyle,
              { justifyContent: 'center', marginTop: 12 }
            ]}
          >
            {photos.length === 3 && (
              <>
                <View>
                  <Image
                    source={DEC1}
                    style={{
                      marginLeft: -33,
                      marginRight: 4,
                      width: 33,
                      height: 30,
                      opacity: 0.1
                    }}
                  />
                </View>
                <View style={[$flex, $flexCenter]}>
                  <CreditWrapper
                    cornerSize={10}
                    cornerText={consumption?.display}
                    $cornerTextStyle={{
                      fontSize: 12,
                      lineHeight: 18
                    }}
                    buttonContainer={
                      <Button
                        style={{
                          borderRadius: 13,
                          paddingHorizontal: 14,
                          paddingVertical: 7
                        }}
                        type={EButtonType.LINEAR}
                        linearColors={['#E8F5FF', '#CAE8FF', '#CDEAFF']}
                        linearStart={{ x: 0.5, y: 0 }}
                        linearEnd={{ x: 0.5, y: 1 }}
                        linearLocations={[0.2533, 0.8487, 1.0]}
                        onPress={onRetry}
                        creditContainer={
                          consumption?.cost !== undefined ? (
                            <CreditCas
                              theme={CREDIT_TYPE.MINUS}
                              text={consumption?.cost + ''}
                              isLinear={false}
                              extraText={consumption?.originCost + ''}
                              size={16}
                              borderColors={['transparent', 'transparent']}
                              insetsColors={['transparent', 'transparent']}
                              $customTextStyle={{
                                color: '#437397',
                                fontFamily: typography.fonts.baba.bold,
                                fontSize: 13,
                                lineHeight: 19
                              }}
                              $customExtraTextStyle={{
                                color: 'rgba(67, 115, 151, 0.50)',
                                fontFamily: typography.fonts.baba.bold,
                                fontSize: 13,
                                lineHeight: 19
                              }}
                            ></CreditCas>
                          ) : (
                            <></>
                          )
                        }
                      >
                        <View style={[$flexRow, $flexCenter]}>
                          <Text
                            style={[
                              $basicText,
                              {
                                color: '#437397',
                                fontSize: 13,
                                lineHeight: 19,
                                fontWeight: '600'
                              }
                            ]}
                          >
                            让小狸重炖
                          </Text>
                          <Image
                            source={RETRY_ICON}
                            style={{
                              position: 'relative',
                              width: 12,
                              height: 12.5,
                              marginStart: 4,
                              marginEnd: 10
                            }}
                          />
                        </View>
                      </Button>
                    }
                  ></CreditWrapper>
                </View>
              </>
            )}
          </View>
          <Text
            style={{
              fontSize: 10,
              color: '#ffffff',
              textAlign: 'center',
              marginTop: 4
            }}
          >
            - 多炖几次效果更好 -
          </Text>
          <View
            style={[
              StyleSheet.rowStyle,

              {
                justifyContent: 'space-between',
                position: 'absolute',
                width: width - 32,
                left: 16,
                right: 16,
                bottom: $containerInsets.paddingBottom ? 0 : 16
              }
            ]}
          >
            <TouchableOpacity style={$btnSave} onPress={saveImage}>
              <Icon size={15} icon="download_btn" />
              <Text style={$btnText}>保存至本地</Text>
            </TouchableOpacity>

            <PrimaryButton
              width={100}
              height={48}
              // style={{ width: 100, borderRadius: 500, ...StyleSheet.rowStyle }}
              onPress={() => {
                setPhotos();
                addCommonReportParams('publish', {
                  create_page_id: getPageID()
                });
                props.resetLoading?.();
                router.push('/publish/');
                reportClick('prepare_publish');
              }}
            >
              <View
                style={[
                  StyleSheet.rowStyle,
                  {
                    width: 100,
                    justifyContent: 'center',
                    gap: 3
                  }
                ]}
              >
                <Icon icon="publish" size={15} />
                <Text style={[$btnText]}>去发布</Text>
              </View>
            </PrimaryButton>
          </View>
        </View>
      </Screen>
    </Animated.View>
  );

  async function onRetry() {
    const { takePhoto, resetTakePhoto, changePageState, setRetryState } =
      useMakePhotoStoreV2.getState();
    resetTakePhoto();
    takePhoto({ invokeType: InvokeType.INVOKE_DRAWING_REDO });
    changePageState(PageState.effect);
    setRetryState(1);
    reportClick('regenerate');
  }

  function onChangeIndex(index: number) {
    setCurrentIndex(index - 1);
    console.log(999, index);
  }

  function saveImage() {
    const url = photos[indexRef.current]?.url;
    if (!url) {
      catchErrorLog('save_image_err', { url, photos, index: indexRef.current });
      showToast('保存失败，请重试');
      return;
    }

    showLoading();
    console.log(url, photos[indexRef.current].cencorState);
    savePicture(
      url,
      photos[indexRef.current].cencorState !== CensoredState.CENSORED_BLOCKED
    )
      .then(res => {
        showToast('保存成功');
        hideLoading();
      })
      .catch(e => {
        console.log(e);
        showToast('保存失败');
        hideLoading();
      });

    reportClick('image_generate_save', {
      save_image_id: photos[indexRef.current].photoId
    });
  }

  function setPhotos() {
    const photoSet: { [key in string]: SelectedItem } = {};
    let index = 1;
    photos.forEach(item => {
      if (!item.photoId) return;
      if (item.cencorState === CensoredState.CENSORED_BLOCKED) return;
      if (usePublishStore.getState().deletedPhotoSet[item.photoId]) return;
      photoSet[item.photoId] = {
        ...item,
        num: index
      };
      index += 1;
    });
    usePublishStore.getState().changePhotos(photoSet);
  }

  function goAlbum() {
    setPhotos();
    props.showAlbum();
    // router.push({
    //   pathname: '/publish/',
    //   params: {
    //     lishi: 1
    //   }
    // });
  }
}
