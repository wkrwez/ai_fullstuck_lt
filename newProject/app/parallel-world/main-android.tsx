import { useMemoizedFn } from 'ahooks';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Image } from '@/src/components';
import { AnimatedImage } from '@/src/components/animatedImage';
import { selectState } from '@/src/store/_utils';
import { useDetailStore } from '@/src/store/detail';
import { WorldRoute, useParallelWorldStore } from '@/src/store/parallel-world';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { GameType, UserProfile } from '@/src/types';
import { createStyle } from '@/src/utils';
import { Screen } from '@Components/screen';
import { StyleSheet } from '@Utils/StyleSheet';
import { InteractionBottom } from './_components/bottomBar/interaction-bottom';
import TimelineBottom from './_components/bottomBar/timeline-bottom';
import { abstractActStoryText } from './_components/gen-card';
import DisplayCard from './_components/gen-card/display-card';
import EnterVideo from './_components/gen-card/enter-video';
import StaticCard from './_components/gen-card/static-card';
import { HeaderLeft, HeaderRight } from './_components/header';
import ParallelWorldGuideModal from './_components/parallel-world-guide-modal';
import SceneViewer from './_components/scene-viewer';
import { useReset } from './_hooks/reset.hook';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { PortalHost } from '@gorhom/portal';
import { useShallow } from 'zustand/react/shallow';
import { VIEWER_CARD_IMG_HEIGHT, VIEWER_CARD_IMG_WIDTH } from './_constants';
import { getEnterText } from './main';

const L8 = require('@Assets/apng/l8.png');

export default function ParallelWorldMainAndroid({
  routeInfo
}: {
  routeInfo: WorldRoute;
}) {
  const { worldRouteStack, popWorldRouteStack } = useParallelWorldStore();

  const {
    getParallelWorldInfo,
    acts,
    timeline,
    activeTimelineSectionIdx,
    getParallelWorldPlot,
    changeActIndex,
    changeActiveTimelineSectionIdx,
    isParallelWordGuideVisible,
    openParallelWordGuide,
    isInitAnimationPlay,
    toggleIsInitAnimationPlay,
    cardId,
    changeCardId,
    actIndex,
    playList,
    playedList,
    clearActs,
    changePlayList,
    changePlayedList
  } = useParallelWorldMainStore(
    useShallow(state =>
      selectState(state, [
        'getParallelWorldInfo',
        'acts',
        'timeline',
        'activeTimelineSectionIdx',
        'getParallelWorldPlot',
        'changeActIndex',
        'changeActiveTimelineSectionIdx',
        'isParallelWordGuideVisible',
        'openParallelWordGuide',
        'isInitAnimationPlay',
        'toggleIsInitAnimationPlay',
        'cardId',
        'changeCardId',
        'actIndex',
        'playList',
        'playedList',
        'clearActs',
        'changePlayList',
        'changePlayedList'
      ])
    )
  );

  const navigation = useNavigation();

  useEffect(() => {
    console.log('playList======>', playList);
  }, [playList]);

  // 图片切换的组件实例
  const viewerRef = useRef<ICarouselInstance>(null);

  const { getChoices } = useParallelWorldFeedStore(
    useShallow(state => selectState(state, ['getChoices']))
  );

  const handlePlotChange = (idx: number) => {
    if (idx === activeTimelineSectionIdx) return;

    // 清空acts相关的状态
    clearActs();
    changePlayedList([]);
    // 设置[0]可以让第一个卡片开始播放
    changePlayList([0]);
    changeActIndex(0);

    changeActiveTimelineSectionIdx(idx);
    getParallelWorldPlot({ plotId: timeline[idx]?.plotId });
  };

  const changeAct = (i: number) => {
    if (i > 0) {
      // 检查是否需要跳过下一章
      const preAct = acts[i - 1];
      const act = acts[i];
      const preStoryText = abstractActStoryText(preAct.actItems);
      const storyText = abstractActStoryText(act.actItems);
      if (preStoryText && storyText && storyText === preStoryText) {
        changePlayedList([...playedList, i]);
      }
    }

    // 修改播放章节
    if (playList.indexOf(i) < 0) {
      changePlayList([...playList, i]);
    }
    // 修改当前章节
    changeActIndex(i);
  };

  const handleActChange = (i: number, force?: boolean) => {
    if (isInitAnimationPlay) return; // 播放视频时禁止初始化
    changeAct(i);
  };

  const handleSkip = (index: number) => {
    const isFinished = playedList.indexOf(index) >= 0;

    if (isFinished) {
      return false;
    } else {
      changePlayedList([...playedList, actIndex]);
      return true;
    }
  };

  const handleStart = () => {
    toggleIsInitAnimationPlay(false);
    changeAct(0);
  };

  // 退出重置
  const { resetWorld, resetMain, resetFeed } = useReset();

  const handleBack = useMemoizedFn(() => {
    if (worldRouteStack.length > 1) {
      resetMain();
      resetFeed();
      popWorldRouteStack();
    } else {
      // 退出当前卡片
      navigation.goBack();
      resetWorld();
    }
  });

  useEffect(() => {
    if (cardId) {
      getParallelWorldInfo({
        cardId: cardId
      });
    }
  }, [cardId]);

  useEffect(() => {
    if (timeline.length && activeTimelineSectionIdx >= 0 && cardId) {
      const currentPlot = timeline[activeTimelineSectionIdx];

      // 获取世界线选择
      getChoices({
        plotId: currentPlot?.plotId,
        cardId: cardId
      });
    }
  }, [timeline, activeTimelineSectionIdx, cardId]);

  useEffect(() => {
    if (routeInfo.cardId !== cardId) {
      const { getDetail, requestDetail } = useDetailStore.getState();
      const detailId = routeInfo.cardId;

      if (detailId && !getDetail(detailId)?.loading) {
        requestDetail({
          cardId: detailId,
          gameType: GameType.WORLD
        });
      }

      changeCardId(routeInfo?.cardId ?? '');
    }
  }, [routeInfo]);

  useEffect(() => {
    if (actIndex >= 0) {
      viewerRef.current?.scrollTo({ index: actIndex });
    }
  }, []);

  return (
    <>
      <Screen
        theme="dark"
        onBack={handleBack}
        screenStyle={[styles.$screen]}
        headerLeft={() => <HeaderLeft detailId={cardId} />}
        headerRight={() => <HeaderRight detailId={cardId} />}
      >
        <View
          style={{
            position: 'absolute',
            zIndex: -1,
            opacity: 0.2,
            left: 0,
            right: 0,
            alignItems: 'center',
            top: 24,
            transform: [{ rotate: '5deg' }, { scale: 1.05 }]
          }}
        >
          <StaticCard
            imageUrl=""
            imgHeight={VIEWER_CARD_IMG_HEIGHT}
            textNode={<View style={{ height: 54 }}></View>}
          />
        </View>
        <View
          style={{
            height: '100%',
            opacity: isParallelWordGuideVisible ? 0.1 : 1
          }}
        >
          <SceneViewer
            acts={acts}
            key={timeline[activeTimelineSectionIdx]?.plotId ?? ''}
            id={timeline[activeTimelineSectionIdx]?.plotId}
            ref={viewerRef}
            // onNext={handleNext}
            onIndexChange={handleActChange}
            onSkip={handleSkip}
            renderItem={(act, index) => (
              <DisplayCard
                onFinished={i => {
                  if (playedList.indexOf(actIndex) < 0) {
                    changePlayedList([...playedList, i]);
                  }
                }}
                cardIndex={index}
                isPlay={playList[playList.length - 1] === index}
                isSkip={playedList.indexOf(index) >= 0}
                imgHeight={VIEWER_CARD_IMG_HEIGHT}
                act={act as WorldAct}
                key={act?.actId ?? index}
              />
            )}
            onExceed={openParallelWordGuide}
          />
        </View>
        {isParallelWordGuideVisible && (
          <ParallelWorldGuideModal visible={isParallelWordGuideVisible} />
        )}
        {isInitAnimationPlay && (
          <View
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                alignItems: 'center'
              }
            ]}
          >
            <View
              style={{
                top: 8,
                borderColor: 'black',
                width: VIEWER_CARD_IMG_WIDTH + 20,
                height: VIEWER_CARD_IMG_HEIGHT + 150,
                backgroundColor: 'white',
                position: 'absolute',
                overflow: 'hidden'
              }}
            >
              <EnterVideo
                isLoading={true}
                videoText={getEnterText(
                  timeline[activeTimelineSectionIdx]?.author?.name ?? ''
                )}
                onFinish={handleStart}
              />
            </View>
          </View>
        )}
        <AnimatedImage
          source={L8}
          duration={1000}
          style={[
            StyleSheet.absoluteFill,
            {
              position: 'absolute',
              top: -20,
              left: VIEWER_CARD_IMG_HEIGHT * 0.125,
              height: VIEWER_CARD_IMG_HEIGHT + 150,
              width: VIEWER_CARD_IMG_HEIGHT * 0.75
            }
          ]}
        />
      </Screen>
      <TimelineBottom
        sections={timeline}
        visible={!isParallelWordGuideVisible}
        active={activeTimelineSectionIdx}
        onActive={handlePlotChange}
        barRight={<InteractionBottom detailId={cardId} />}
      />
      <PortalHost name="CommentPortalHost" />
    </>
  );
}

const styles = createStyle({
  $screen: {
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingVertical: 18,
    width: '100%'
  }
});
