import { router } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  Text,
  TextInput,
  View
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { publishParallelWorld } from '@/src/api/parallel-world/publish';
import {
  Icon,
  Screen,
  hideLoading,
  showLoading,
  showToast
} from '@/src/components';
import { selectState } from '@/src/store/_utils';
import {
  FOLD_STATUS_ENUM,
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { useParallelWorldPublishStore } from '@/src/store/parallel-world-publish';
import { colors, typography } from '@/src/theme';
import { $flexHBetween, $flexHCenter } from '@/src/theme/variable';
import {
  addCommonReportParams,
  reportClick,
  reportExpo
} from '@/src/utils/report';
import { logWarn } from '@Utils/error-log';
import CoverChangeModal from './_components/cover-change-modal';
// import { getGenImgHeightByWidth } from './_components/gen-card';
import ChangeImgButton, {
  CHANGE_IMG_BUTTON_HEIGHT
} from './_components/gen-card/change-img-button';
import StaticCard from './_components/gen-card/static-card';
import { glowLineStyle } from './_components/others/ai-pressable-input';
import LiHelp, { CHOICE_LOADING_TIP } from './_components/others/li-help';
import ParallelWorldButton from './_components/others/parallel-world-button';
import { useReset } from './_hooks/reset.hook';
import { REVIEW_ERR_ENUM, showErr, toastErr } from './_utils/error-msg';
import { TimelinePlot } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';
import {
  VIEWER_CARD_IMG_HEIGHT,
  getGenImgHeightByWidth,
  parallelWorldColors
} from './_constants';

const { width: screenW, height: screenH } = Dimensions.get('window');

const imgW = screenW - 162;

const PUBLISH_SUCCESS_DELAY = 500;

const CARD_HEIGHT = VIEWER_CARD_IMG_HEIGHT + 40;

const findBreakPoint = (
  timeline: TimelinePlot[],
  newTimeLine: TimelinePlot[]
): number => {
  let breakPoint = 0;
  const l = Math.max(timeline.length, newTimeLine.length);
  for (let i = 0; i < l; i++) {
    if (timeline[i]?.plotId !== newTimeLine[i]?.plotId) {
      breakPoint = i;
      break;
    }
  }

  return breakPoint;
};

const AnimatedMask = Animated.createAnimatedComponent(Pressable);

export default function ParallelWorldPublish() {
  const { switchPageFoldStatus, pushWorldRouteStack, popWorldRouteStack } =
    useParallelWorldStore(
      useShallow(state =>
        selectState(state, [
          'switchPageFoldStatus',
          'pushWorldRouteStack',
          'popWorldRouteStack'
        ])
      )
    );

  const { acts, newTimeLine, newWorld } = useParallelWorldConsumerStore(
    useShallow(state => selectState(state, ['acts', 'newTimeLine', 'newWorld']))
  );

  const {
    openChangeCoverModal,
    coverImg,
    changeCoverImg,
    isCreatingTitle,
    changeTitle,
    createTitle,
    title
  } = useParallelWorldPublishStore(
    useShallow(state =>
      selectState(state, [
        'openChangeCoverModal',
        'coverImg',
        'changeCoverImg',
        'isCreatingTitle',
        'changeTitle',
        'createTitle',
        'title'
      ])
    )
  );

  const { timeline } = useParallelWorldMainStore(
    useShallow(state => selectState(state, ['timeline']))
  );

  const { resetWorld } = useReset();

  const inputRef = React.useRef<TextInput>(null);

  const $isFocused = useSharedValue<boolean>(false);

  const handleTileChange = (text: string) => {
    if (text === CHOICE_LOADING_TIP) return;
    changeTitle(text);
  };

  const handleInputFocus = () => {
    $isFocused.value = true;
    reportClick('release_button', {
      clicktype: 0
    });
  };
  const handleInputBlur = () => {
    $isFocused.value = false;
    inputRef.current?.blur();
  };

  const $maskStyle_A = useAnimatedStyle(() => {
    return {
      zIndex: $isFocused.value ? 1 : -1,
      opacity: withTiming($isFocused.value ? 1 : 0)
    };
  });

  const handleCreateTitle = () => {
    createTitle({ cardId: newWorld?.cardId as string });
    // reportClick('set_next_world', {
    //   contentid: newWorld?.cardId,
    //   world_contentid: newWorld?.worldId,
    //   set_next_world_button: 5
    // });
    reportClick('release_button', {
      clicktype: 1
    });
  };

  const handleBack = () => {
    popWorldRouteStack();
  };

  const handlePublish = async () => {
    const breakPoint = findBreakPoint(timeline, newTimeLine);
    console.log('breakPoint------>', breakPoint);

    const refPlot = newTimeLine.slice(0, breakPoint);
    const createPlotId = newTimeLine.slice(breakPoint);

    const payload = {
      imageId: coverImg?.imageId as string,
      title: title,
      cardId: newWorld?.cardId as string,
      refPlotId: refPlot.map(s => s?.plotId),
      createPlotId: createPlotId.map(s => s?.plotId)
    };

    handleInputBlur();

    reportClick('release_button', {
      clicktype: 3
    });

    try {
      showLoading();
      const res = await publishParallelWorld(payload);

      showToast('发布成功', PUBLISH_SUCCESS_DELAY + 100);
      switchPageFoldStatus(FOLD_STATUS_ENUM.FOLD);

      reportExpo(
        'release_button',
        {
          clicktype: 3
        },
        'success'
      );

      setTimeout(() => {
        switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);

        router.push({
          pathname: '/feed' as RelativePathString,
          params: {
            appendId: newWorld?.cardId ?? ''
          }
        });

        resetWorld();
      }, PUBLISH_SUCCESS_DELAY);
    } catch (e) {
      toastErr(e, REVIEW_ERR_ENUM.TITLE);
      // showToast('发布失败');
      logWarn('publish', e);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (acts[0]?.image) changeCoverImg(acts[0]?.image);
    reportExpo('release', {
      contentod: newWorld?.cardId
    });
    addCommonReportParams('world', {
      received_release: 1
    });
  }, []);

  return (
    <>
      <Screen
        headerTitle={() => (
          <Text
            style={{ color: colors.white, fontSize: 16, fontWeight: '600' }}
          >
            发布内容
          </Text>
        )}
        backButton={false}
        headerLeft={() => (
          <Pressable onPress={handleBack} style={{ ...$flexHCenter }}>
            <Icon icon="back_pw" />
            <Text
              style={{
                color: colors.white,
                fontSize: 14
              }}
            >
              返回
            </Text>
          </Pressable>
        )}
        headerRight={() => <View style={{ width: 80 }}></View>}
        screenStyle={{
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          paddingVertical: 18,
          width: '100%'
        }}
        theme="dark"
      >
        <View
          style={{
            alignItems: 'stretch',
            gap: 48,
            paddingHorizontal: 18,
            paddingTop: 12,
            height: '100%'
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <StaticCard
              imageUrl={coverImg?.imageUrl ?? ''}
              imgHeight={VIEWER_CARD_IMG_HEIGHT - 80}
              textNode={
                <View style={{ ...$flexHBetween }}>
                  <Text style={{ fontSize: 13, fontWeight: '600' }}></Text>
                  <View style={{ ...$flexHCenter, gap: 4 }}>
                    <Icon icon="pw_black" size={16}></Icon>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '400',
                        fontFamily: typography.fonts.world
                      }}
                    >
                      {`${newWorld?.worldNum}号平行世界`}
                    </Text>
                  </View>
                </View>
              }
            />
            <View
              style={{
                ...$flexHCenter,
                position: 'absolute',
                top:
                  getGenImgHeightByWidth(imgW) - CHANGE_IMG_BUTTON_HEIGHT - 10
              }}
            >
              <ChangeImgButton
                title="编辑封面"
                onImgRegenerate={() => {
                  openChangeCoverModal();
                  reportClick('release_button', {
                    clicktype: 2
                  });
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom:
              Platform.OS === 'android'
                ? screenH - CARD_HEIGHT - 160
                : screenH - CARD_HEIGHT - 220,
            width: '100%',
            gap: 8,
            paddingHorizontal: 14,
            zIndex: 100
          }}
        >
          <View
            style={{
              ...$flexHCenter,
              flexDirection: 'row-reverse',
              paddingHorizontal: 10
            }}
          >
            <LiHelp onPress={handleCreateTitle} disabled={isCreatingTitle} />
          </View>
          <View style={{ overflow: 'visible' }}>
            <View
              style={{
                ...$flexHCenter,
                // alignItems: 'flex-start',
                alignItems: 'center',
                padding: 10,
                borderRadius: 10,
                flex: 1,
                borderWidth: 2,
                ...glowLineStyle.$border
              }}
            >
              <TextInput
                allowFontScaling={false}
                ref={inputRef}
                style={{
                  flex: 1,
                  fontWeight: '400',
                  fontSize: 16,
                  marginTop: -2,
                  color: parallelWorldColors.fontGlow,
                  fontFamily: typography.fonts.world
                }}
                onChangeText={handleTileChange}
                value={isCreatingTitle ? CHOICE_LOADING_TIP : title}
                returnKeyType="send"
                placeholder="请输入标题..."
                onSubmitEditing={handlePublish}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                selectionColor={parallelWorldColors.fontGlow}
                placeholderTextColor="rgba(127, 217, 255, 0.6)"
                returnKeyLabel="发布"
                enablesReturnKeyAutomatically
                maxLength={20}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: colors.white,
                  opacity: 0.4,
                  lineHeight: 24
                }}
              >{`字数(${title.length}/20)`}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 18,
            alignItems: 'center',
            position: 'absolute',
            zIndex: 100,
            width: '100%',
            top: screenH - 200
          }}
        >
          <View
            style={{
              borderRadius: 21,
              padding: 2,
              borderWidth: 1,
              borderColor: parallelWorldColors.fontGlow
            }}
          >
            <ParallelWorldButton
              style={{
                backgroundColor: '#FF6A3B',
                borderRadius: 19,
                width: 196,
                height: 38
              }}
              disabled={!title}
              onPress={handlePublish}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 4
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: colors.white,
                    lineHeight: 18
                  }}
                >
                  发布到社区
                </Text>
                <Icon icon="publish_pw" size={16} />
              </View>
            </ParallelWorldButton>
          </View>
        </View>
        <AnimatedMask
          style={[
            $maskStyle_A,
            {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }
          ]}
          onPress={handleInputBlur}
        />
      </Screen>
      <CoverChangeModal />
    </>
  );
}
