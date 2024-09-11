import { router } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Icon, Screen } from '@/src/components';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import {
  PARALLEL_WORLD_PAGES_ENUM,
  WorldRoute,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { colors } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { AnimatedImage } from '@Components/animatedImage';
import { Image } from '@Components/image';
import ChoiceCard from './_components/choice-card';
import { AiChoiceCard } from './_components/choice-card/ai-choice-card';
import ChoiceInputCard from './_components/choice-card/choice-input-card';
import { FeedInputModal } from './_components/feed-input-modal/feed-input-modal';
import { useReset } from './_hooks/reset.hook';
import { PlotChoice } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';

const EDIT_STICKER = require('@Assets/image/parallel-world/edit-sticker.png');

export default function ParallelWorldFeed({
  routeInfo
}: {
  routeInfo: WorldRoute;
}) {
  const { popWorldRouteStack, pushWorldRouteStack } = useParallelWorldStore(
    useShallow(state => ({
      popWorldRouteStack: state.popWorldRouteStack,
      pushWorldRouteStack: state.pushWorldRouteStack
    }))
  );

  const {
    activeTimelineSectionIdx,
    timeline,
    openParallelWordGuide,
    getParallelWorldInfo
  } = useParallelWorldMainStore(
    useShallow(state => ({
      activeTimelineSectionIdx: state.activeTimelineSectionIdx,
      timeline: state.timeline,
      openParallelWordGuide: state.openParallelWordGuide,
      getParallelWorldInfo: state.getParallelWorldInfo
    }))
  );

  const {
    plotId,
    isFeedInputVisible,
    openFeedInputModal,
    getChoices,
    closeFeedInputModal,
    plotChoices,
    getPlotTags,
    changeChoiceText
  } = useParallelWorldFeedStore(
    useShallow(state => ({
      plotId: state.plotId,
      isFeedInputVisible: state.isFeedInputVisible,
      openFeedInputModal: state.openFeedInputModal,
      getChoices: state.getChoices,
      closeFeedInputModal: state.closeFeedInputModal,
      plotChoices: state.plotChoices,
      getPlotTags: state.getPlotTags,
      changeChoiceText: state.changeChoiceText
    }))
  );

  const { resetMain, resetFeed } = useReset();

  const { loginIntercept } = useAuthState();

  const $isFold = useSharedValue(false);

  const $scroll_a = useAnimatedStyle(() => {
    return { transform: [{ scaleY: withTiming($isFold.value ? 0 : 1) }] };
  });

  // choice卡片展示数据
  const { aiChoices, choices } = useMemo(() => {
    const aiChoices: PlotChoice[] = [];
    const choices: PlotChoice[] = [];

    plotChoices.forEach(c => {
      if (c.isAi) {
        aiChoices.push(c);
      } else {
        choices.push(c);
      }
    });
    return { aiChoices, choices };
  }, [plotChoices]);

  const handleBack = () => {
    popWorldRouteStack();
    openParallelWordGuide(true);
    reportClick('world_feed_back', {
      plotId: timeline[activeTimelineSectionIdx]?.plotId,
      contentid: routeInfo?.cardId ?? ''
    });
  };

  const handleOpenInputModal = () => {
    openFeedInputModal();
    $isFold.value = true;

    // reportClick('world_feed', {
    //   world_feed_button: 1,
    //   contentid: routeInfo?.cardId ?? ''
    // });
    reportClick('set_world', {
      plotId: timeline[activeTimelineSectionIdx]?.plotId,
      contentid: routeInfo?.cardId ?? ''
    });
  };

  const handleCloseInputModal = () => {
    $isFold.value = false;
    closeFeedInputModal();
    reportClick('world_feed_closeInput', {
      plotId: timeline[activeTimelineSectionIdx]?.plotId,
      contentid: routeInfo?.cardId ?? ''
    });
  };

  const handleEnterOthers = (d: PlotChoice) => {
    // 清空状态
    // resetParallelWorld();
    resetFeed();
    resetMain();
    // 导航到新世界线
    // router.push(`/parallel-world/${d.cardId}`);
    pushWorldRouteStack({
      route: PARALLEL_WORLD_PAGES_ENUM.MAIN,
      cardId: d.cardId
    });

    reportClick('world_feed', {
      plotId: timeline[activeTimelineSectionIdx]?.plotId,
      contentid: routeInfo?.cardId ?? '',
      next_contentid: d.cardId,
      world_feed_button: 3,
      world_contentid: d.cardId
    });
  };

  useEffect(() => {
    getPlotTags({ plotId: timeline[activeTimelineSectionIdx]?.plotId });
    reportExpo('world_feed', {
      plotId: timeline[activeTimelineSectionIdx]?.plotId,
      contentid: routeInfo?.cardId ?? ''
    });
  }, []);

  // 处理初始化
  useEffect(() => {
    if (routeInfo?.plotId !== plotId) {
      // 初始化当前页面 - choice页
      getChoices({
        cardId: routeInfo?.cardId ?? '',
        plotId: routeInfo?.plotId ?? ''
      });
      // 初始化前一个页面 - 预览页
      getParallelWorldInfo({
        cardId: routeInfo?.cardId ?? ''
      });
    }
  }, [routeInfo]);

  return (
    <>
      <Screen
        headerTitle={() => (
          <View style={styles.$title}>
            <Icon icon="word_line" size={18}></Icon>
            <Text style={styles.$titleText}>平行世界</Text>
          </View>
        )}
        backButton={false}
        headerLeft={() => (
          <Pressable onPress={handleBack} style={styles.$close}>
            <Icon icon="close2" />
          </Pressable>
        )}
        headerStyle={{ zIndex: 10 }}
        headerRight={() => (
          <Pressable
            onPress={handleBack}
            style={{ width: 100, alignItems: 'flex-end' }}
          >
            {/* <Text
              style={{
                color: parallelWorldColors.fontGlow,
                fontSize: 16,
                fontWeight: '400'
              }}
            >
              前情提要
            </Text> */}
          </Pressable>
        )}
        screenStyle={styles.$screen}
        theme="dark"
      >
        <LinearGradient
          colors={['rgba(22, 28, 38, 1)', 'rgba(22, 28, 38, 0)']}
          start={{ x: 1, y: 0.8 }}
          end={{ x: 1, y: 1 }}
          style={styles.$headerMask}
        ></LinearGradient>
        <Animated.ScrollView style={[styles.$scroll, $scroll_a]}>
          <>
            <Image
              source={EDIT_STICKER}
              style={{
                position: 'absolute',
                width: 70,
                height: 70,
                zIndex: 1000,
                right: -12,
                top: 24
              }}
            />
            <ChoiceInputCard
              onInput={() => {
                loginIntercept(handleOpenInputModal, {
                  scene: LOGIN_SCENE.TO_CREATE
                });

                reportClick('world_feed', {
                  plotId: timeline[activeTimelineSectionIdx]?.plotId,
                  contentid: routeInfo?.cardId ?? '',
                  world_feed_button: 1
                });
              }}
            />
            {aiChoices.map((choice, index) => (
              <AiChoiceCard
                containerStyle={getAiCardStyle(index, aiChoices.length)}
                choice={choice}
                key={choice.choice}
                onEnter={d => {
                  loginIntercept(
                    () => {
                      changeChoiceText(d.choice);
                      handleOpenInputModal();

                      reportClick('world_feed', {
                        plotId: timeline[activeTimelineSectionIdx]?.plotId,
                        contentid: routeInfo?.cardId ?? '',
                        world_feed_button: 2,
                        world_contentid: choice.cardId
                      });
                    },
                    { scene: LOGIN_SCENE.TO_CREATE }
                  );
                }}
              />
            ))}
            <View style={{ paddingVertical: 8, gap: 8 }}>
              {choices.map((choice, index) => (
                <ChoiceCard
                  key={choice.choice}
                  choice={choice}
                  onEnter={handleEnterOthers}
                />
              ))}
            </View>
          </>
        </Animated.ScrollView>

        <AnimatedImage
          source={L1_IMG}
          style={styles.$l1Style}
          duration={2000}
        />
        <AnimatedImage
          source={L2_IMG}
          style={styles.$l2Style}
          duration={2000}
        />
      </Screen>
      {/* 创建世界线 */}
      {isFeedInputVisible && (
        <FeedInputModal
          onClose={handleCloseInputModal}
          isVisible={isFeedInputVisible}
        />
      )}
    </>
  );
}

const L1_IMG = require('@Assets/apng/l1.png');
const L2_IMG = require('@Assets/apng/l2.png');

const styles = createStyle({
  $screen: {
    position: 'relative',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingVertical: 18,
    width: '100%'
  },
  $title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  $titleText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  $close: { width: 100, alignItems: 'flex-start' },
  $headerMask: {
    position: 'absolute',
    height: 200,
    top: -200,
    width: '100%',
    zIndex: 1
  },
  $scroll: {
    overflow: 'visible',
    position: 'relative',
    paddingHorizontal: 18,
    height: '100%'
  },
  $l1Style: {
    position: 'absolute',
    width: 87.5,
    height: 150,
    top: 0,
    left: 10,
    zIndex: 2
  },
  $l2Style: {
    position: 'absolute',
    width: 87.5,
    height: 150,
    bottom: 30,
    right: 30,
    zIndex: 2
  }
});

const getAiCardStyle = (
  index: number,
  choicesCount: number
): StyleProp<ViewStyle> => {
  let style: StyleProp<ViewStyle> = {
    paddingVertical: 4
  };
  if (index === 0) {
    style = {
      ...style,
      marginTop: -20,
      paddingTop: 28
    };
  }
  if (index === choicesCount - 1) {
    style = {
      ...style,
      paddingBottom: 8,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10
    };
  }
  return style;
};
