import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Screen } from '@/src/components';
import { showToast } from '@/src/components';
import { selectState } from '@/src/store/_utils';
import {
  PARALLEL_WORLD_PAGES_ENUM,
  WorldRoute,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { colors, typography } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Icon } from '@Components/icons';
import TimelineBottom from './_components/bottomBar/timeline-bottom';
import TextEditModal from './_components/comsumer-input-modal/text-edit-modal';
import ConsumerHeaderLeft from './_components/consumer-tool-bar/header-left';
import ConsumerHeaderRight from './_components/consumer-tool-bar/header-right';
import GenCard from './_components/gen-card';
import StaticCard from './_components/gen-card/static-card';
import { ImgGenModal } from './_components/img-gen-modal';
import NextChapterModal from './_components/next-chapter-modal';
import ParallelWorldButton from './_components/others/parallel-world-button';
import SceneViewer from './_components/scene-viewer';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useShallow } from 'zustand/react/shallow';
import { VIEWER_CARD_IMG_HEIGHT, parallelWorldColors } from './_constants';

const LoadingHeader = ({ worldNum }: { worldNum: string }) => (
  <View
    style={{
      height: '100%',
      alignItems: 'center',
      flexDirection: 'row'
    }}
  >
    <Text
      style={{
        fontFamily: typography.fonts.world,
        fontSize: 18,
        color: 'white'
      }}
    >
      你正在创建
    </Text>
    <Text
      style={{
        paddingHorizontal: 2,
        color: parallelWorldColors.fontGlow,
        fontSize: 18,
        fontFamily: typography.fonts.world
      }}
    >{`第${worldNum}号`}</Text>
    <Text
      style={{
        fontFamily: typography.fonts.world,
        fontSize: 18,
        color: 'white'
      }}
    >
      平行世界
    </Text>
  </View>
);

export default function ParallelWorldConsumer({
  routeInfo
}: {
  routeInfo: WorldRoute;
}) {
  const { pushWorldRouteStack } = useParallelWorldStore(
    useShallow(state => selectState(state, ['pushWorldRouteStack']))
  );

  const {
    newWorld,
    isGenCardEditable,
    isTextEditModalVisible,
    openTextEditModal,
    changeTextEditAct,
    genImgMap,
    openImgGenModal,
    changeImgGenAct,
    isImgGenModalVisible,
    isNextChapterModalVisible,
    openNextChapterModal,
    acts,
    // actsBuffer,
    editableActs,
    newTimeLine,
    activeTimelineSectionIdx,
    changeActiveTimelineSectionIdx,
    getPlot,
    actIndex,
    changeActIndex,
    // isPlotContentPlaying,
    initNewWorldInfo,
    plotCreateStatus
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'newWorld',
        // 'actsBuffer',
        'abortController',
        'isGenCardEditable',
        'isTextEditModalVisible',
        'openTextEditModal',
        'changeTextEditAct',
        'genImgMap',
        'openImgGenModal',
        'changeImgGenAct',
        'isImgGenModalVisible',
        'isNextChapterModalVisible',
        'openNextChapterModal',
        'acts',
        'editableActs',
        'newTimeLine',
        'activeTimelineSectionIdx',
        'changeActiveTimelineSectionIdx',
        'getPlot',
        'actIndex',
        'changeActIndex',
        // 'isPlotContentPlaying',
        'initNewWorldInfo',
        'plotCreateStatus'
      ])
    )
  );

  const viewerRef = useRef<ICarouselInstance>(null);

  const { isPlotFinished, isTimelineVisible, canExceed } = useMemo(() => {
    const isPlotFinished = plotCreateStatus >= PLOT_CREATE_STATUS_ENUM.CREATED;

    const isTimelineVisible = isPlotFinished && !isGenCardEditable;

    const canExceed = isPlotFinished && !isGenCardEditable;

    return { isPlotFinished, isTimelineVisible, canExceed };
  }, [plotCreateStatus, isGenCardEditable]);

  const handlePlotChange = async (idx: number) => {
    if (idx === activeTimelineSectionIdx) return;
    await getPlot({ plotId: newTimeLine[idx]?.plotId });
    changeActiveTimelineSectionIdx(idx);
  };

  const handleImgRegenerate = (act: WorldAct | null) => {
    const generatingId = Object.keys(genImgMap).find(
      key => genImgMap[key].isLoading
    );

    if (generatingId && generatingId !== act?.actId) {
      showToast('有其他图片生成中，请稍后...');
      return;
    }

    if (act) {
      openImgGenModal();
      changeImgGenAct(act);
    }
  };

  const handleExceed = useMemoizedFn(async () => {
    if (!canExceed) {
      return;
    }

    if (activeTimelineSectionIdx < newTimeLine.length - 1) {
      handlePlotChange(activeTimelineSectionIdx + 1);
      return;
    }
    openNextChapterModal();
  });

  const isNextVisible = useMemo(() => {
    const isLast = actIndex === acts.length - 1;

    if (plotCreateStatus < PLOT_CREATE_STATUS_ENUM.CREATED) {
      return !isLast;
    } else {
      if (!isLast) {
        return true;
      } else {
        return canExceed;
      }
    }
  }, [actIndex, plotCreateStatus, canExceed, acts]);

  // 初始化页码：TODO -> 改为受控组件
  useEffect(() => {
    if (actIndex >= 0) {
      viewerRef.current?.scrollTo({ index: actIndex });
    }

    reportExpo('new_content_preview', {
      contentid: newWorld?.cardId
    });
  }, []);

  const renderGenCard = useMemoizedFn((act: WorldAct | null, index: number) => (
    <GenCard
      key={act?.actId ?? index}
      isInView={actIndex === index}
      imgHeight={VIEWER_CARD_IMG_HEIGHT}
      act={act}
      isEdit={isGenCardEditable && actIndex === index}
      // onStreamFinish={act => {
      //   // setFinishedActIdx(list => [...list, act?.actIndex ?? -1]);
      // }}
      onTextEdit={act => {
        changeTextEditAct(cloneDeep(act));
        openTextEditModal();
        reportClick('world_editing', {
          contentid: newTimeLine[activeTimelineSectionIdx].cardId,
          script_contentid: JSON.stringify(act?.actItems[actIndex]),
          image_contentid: JSON.stringify(act?.image),
          world_editing_button: 1
        });
      }}
      onImgRegenerate={handleImgRegenerate}
    />
  ));

  useEffect(() => {
    if (routeInfo?.cardId !== newWorld?.cardId) {
      initNewWorldInfo({ cardId: routeInfo?.cardId ?? '' });
    }
  }, [routeInfo]);

  return (
    <>
      <View style={{ flex: 1, opacity: isNextChapterModalVisible ? 0 : 1 }}>
        <Screen
          headerTitle={() =>
            !isPlotFinished && (
              <LoadingHeader worldNum={newWorld?.worldNum ?? ''} />
            )
          }
          screenStyle={styles.$screen}
          theme="dark"
          backButton={false}
          headerLeft={() => <ConsumerHeaderLeft />}
          headerRight={() => isPlotFinished && <ConsumerHeaderRight />}
        >
          <View style={bgCardStyles.$card}>
            <StaticCard
              imageUrl=""
              imgHeight={VIEWER_CARD_IMG_HEIGHT}
              textNode={<View style={{ height: 54 }}></View>}
            />
          </View>
          <SceneViewer
            ref={viewerRef}
            key={newTimeLine[activeTimelineSectionIdx]?.plotId ?? ''}
            id={newTimeLine[activeTimelineSectionIdx]?.plotId}
            acts={isGenCardEditable ? editableActs : acts}
            // isNextVisible={false}
            isPrevVisible={actIndex !== 0}
            isNextVisible={isNextVisible}
            onIndexChange={changeActIndex}
            onExceed={handleExceed}
            renderItem={renderGenCard}
          />
          {/* {isPlotContentPlaying && <PlotContentLoading />} */}
        </Screen>
        {isTimelineVisible && (
          <TimelineBottom
            sections={newTimeLine}
            key={newTimeLine.length}
            visible={isTimelineVisible}
            active={activeTimelineSectionIdx}
            onActive={handlePlotChange}
            barRight={
              <ParallelWorldButton
                onPress={() => {
                  // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.PUBLISH);
                  pushWorldRouteStack({
                    route: PARALLEL_WORLD_PAGES_ENUM.PUBLISH
                  });

                  reportClick('world_editing', {
                    contentid: newWorld?.cardId,
                    new_content_button: 6
                  });
                }}
                style={timelineStyles.$button}
              >
                <Text style={timelineStyles.$text}>先写到这里</Text>
                <Icon icon="publish_pw" size={16} />
              </ParallelWorldButton>
            }
          />
        )}
      </View>

      {isNextChapterModalVisible && <NextChapterModal />}
      {isTextEditModalVisible && (
        <TextEditModal isVisible={isTextEditModalVisible} />
      )}
      {isImgGenModalVisible && <ImgGenModal />}
    </>
  );
}

const styles = createStyle({
  $screen: {
    backgroundColor: 'transparent',
    alignItems: 'stretch',
    paddingVertical: 18,
    position: 'relative',
    width: '100%'
  }
});

const timelineStyles = createStyle({
  $button: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.white
  },
  $text: {
    marginRight: 4,
    fontWeight: '500',
    fontSize: 16,
    color: 'white'
  }
});

const bgCardStyles = createStyle({
  $card: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0.2,
    left: 0,
    right: 0,
    alignItems: 'center',
    top: 24,
    transform: [{ rotate: '5deg' }, { scale: 1.05 }]
  }
});
