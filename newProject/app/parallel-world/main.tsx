import { useMemoizedFn } from 'ahooks';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AnimatedImage } from '@/src/components/animatedImage';
import { selectState } from '@/src/store/_utils';
import { useDetailStore } from '@/src/store/detail';
import {
  FOLD_STATUS_ENUM,
  WorldRoute,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { GameType } from '@/src/types';
import { createStyle } from '@/src/utils';
import { Screen } from '@Components/screen';
import { StyleSheet } from '@Utils/StyleSheet';
import { InteractionBottom } from './_components/bottomBar/interaction-bottom';
import TimelineBottom from './_components/bottomBar/timeline-bottom';
import GenCard from './_components/gen-card';
import DisplayMaskCard from './_components/gen-card/display-mask-card2';
import StaticCard from './_components/gen-card/static-card';
import { HeaderLeft, HeaderRight } from './_components/header';
import ParallelWorldGuideModal from './_components/parallel-world-guide-modal';
import { useReset } from './_hooks/reset.hook';
import { PortalHost } from '@gorhom/portal';
import { useShallow } from 'zustand/react/shallow';
import { VIEWER_CARD_IMG_HEIGHT } from './_constants';

const L8 = require('@Assets/apng/l8.png');

export const getEnterText = (authorName: string) =>
  `你正在进入【${authorName}】创建的平行世界章节`;

export default function ParallelWorldMain({
  routeInfo
}: {
  routeInfo: WorldRoute;
}) {
  const { worldRouteStack, popWorldRouteStack, switchPageFoldStatus } =
    useParallelWorldStore(
      useShallow(state =>
        selectState(state, [
          'worldRouteStack',
          'popWorldRouteStack',
          'switchPageFoldStatus'
        ])
      )
    );

  const {
    worldInfo,
    getParallelWorldInfo,
    acts,
    timeline,
    activeTimelineSectionIdx,
    getParallelWorldPlot,
    clearActs,
    changeActIndex,
    changeActiveTimelineSectionIdx,
    isParallelWordGuideVisible,
    openParallelWordGuide,
    cardId,
    changeCardId,
    actIndex,
    toggleIsInitAnimationPlay,
    isInitAnimationPlay
  } = useParallelWorldMainStore(
    useShallow(state =>
      selectState(state, [
        'worldInfo',
        'getParallelWorldInfo',
        'acts',
        'timeline',
        'activeTimelineSectionIdx',
        'getParallelWorldPlot',
        'clearActs',
        'changeActIndex',
        'changeActiveTimelineSectionIdx',
        'isParallelWordGuideVisible',
        'openParallelWordGuide',
        'cardId',
        'changeCardId',
        'actIndex',
        'toggleIsInitAnimationPlay',
        'isInitAnimationPlay'
      ])
    )
  );

  const navigation = useNavigation();

  // 图片切换的组件实例
  const { getChoices } = useParallelWorldFeedStore(
    useShallow(state => selectState(state, ['getChoices']))
  );

  const handlePlotChange = async (idx: number) => {
    if (idx === activeTimelineSectionIdx) return;

    await getParallelWorldPlot({ plotId: timeline[idx]?.plotId });

    // 修改状态
    changeActIndex(0);
    changeActiveTimelineSectionIdx(idx);
  };

  // 退出重置
  const { resetWorld, resetMain, resetFeed } = useReset();

  const handleBack = useMemoizedFn(() => {
    if (worldRouteStack.length > 1) {
      resetMain();
      resetFeed();
      popWorldRouteStack();
      switchPageFoldStatus(FOLD_STATUS_ENUM.FOLD_2_UNFOLD);
    } else {
      // 退出当前卡片
      navigation.goBack();
      resetWorld();
    }
  });

  // 初始化卡片信息
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

  // 获取首页数据
  useEffect(() => {
    if (cardId && cardId !== worldInfo.cardId) {
      getParallelWorldInfo({
        cardId: cardId
      });
    }
  }, [cardId]);

  // 提前获取choices
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

  return (
    <>
      <Screen
        theme="dark"
        onBack={handleBack}
        screenStyle={[styles.$screen]}
        headerLeft={() => <HeaderLeft detailId={cardId} />}
        headerRight={() => <HeaderRight detailId={cardId} />}
      >
        <View style={styles.$content}>
          <View style={styles.$bg}>
            <StaticCard
              imageUrl=""
              imgHeight={VIEWER_CARD_IMG_HEIGHT}
              textNode={<View style={{ height: 54 }}></View>}
            />
          </View>
          {timeline[activeTimelineSectionIdx]?.plotId && acts?.length > 0 ? (
            <DisplayMaskCard
              key={timeline[activeTimelineSectionIdx]?.plotId ?? ''}
              acts={acts}
              showLoadVideo={isInitAnimationPlay}
              onVideoPlayed={() => {
                toggleIsInitAnimationPlay(false);
              }}
              activeIdx={actIndex}
              onChange={changeActIndex}
              videoText={getEnterText(
                timeline[activeTimelineSectionIdx]?.author?.name ?? ''
              )}
              isBtnVisible={!isParallelWordGuideVisible}
              onExceed={openParallelWordGuide}
              imgHeight={VIEWER_CARD_IMG_HEIGHT}
              containerStyle={{
                opacity: isParallelWordGuideVisible ? 0.1 : 1
              }}
            />
          ) : null}
          {isParallelWordGuideVisible && (
            <ParallelWorldGuideModal visible={isParallelWordGuideVisible} />
          )}
        </View>
        <AnimatedImage
          source={L8}
          duration={1000}
          style={[StyleSheet.absoluteFill, styles.$bgLightning]}
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
  },
  $content: {
    position: 'relative',
    paddingTop: 10,
    height: '100%',
    alignItems: 'center'
  },
  $bg: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
    top: 24,
    transform: [{ rotate: '5deg' }, { scale: 1.05 }]
  },
  $bgLightning: {
    position: 'absolute',
    top: -20,
    left: VIEWER_CARD_IMG_HEIGHT * 0.125,
    height: VIEWER_CARD_IMG_HEIGHT + 150,
    width: VIEWER_CARD_IMG_HEIGHT * 0.75
  }
});
