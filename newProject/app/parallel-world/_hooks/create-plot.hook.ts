import { useMemoizedFn } from 'ahooks';
import { CreatedAct } from '@/src/api/parallel-world/feed';
import { hideLoading, showLoading } from '@/src/components';
import { selectState } from '@/src/store/_utils';
import { useAppStore } from '@/src/store/app';
import {
  FOLD_STATUS_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { UserProfile } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { DisconnectHandler } from '../_utils/disconnect-handler';
import { REVIEW_ERR_ENUM, showErr } from '../_utils/error-msg';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { TimelinePlot } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';

export const ERR_DISPLAY_DUR = 1000;

// 已有世界线创建节点
export const useCreatePlot = () => {
  const { user } = useAppStore(
    useShallow(state => selectState(state, ['user']))
  );

  const { switchPageFoldStatus, toggleParallelWorldLoading } =
    useParallelWorldStore(
      useShallow(state =>
        selectState(state, [
          'switchPageFoldStatus',
          'toggleParallelWorldLoading'
        ])
      )
    );

  const {
    newTimeLine,
    newWorld,
    createAbortController,
    choiceText,
    changeChoiceText,
    activeTimelineSectionIdx,
    createPlotByChoice,
    updateActs,
    toggleIsActsSaved,
    openNextChapterModal,
    saveCreatedWorld,
    changeNewTimeLine,
    changePlotId,
    changeActiveTimelineSectionIdx,
    closeNextChapterModal,
    changePlotCreateStatus
    // clearAiChoices,
    // changeActsBuffer,
    // resetVirtualTimeline,
    // toggleIsPlotContentPlaying
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'newTimeLine',
        'newWorld',
        'createAbortController',
        'choiceText',
        'changeChoiceText',
        'activeTimelineSectionIdx',
        'createPlotByChoice',
        'updateActs',
        'toggleIsActsSaved',
        'openNextChapterModal',
        'saveCreatedWorld',
        'changeNewTimeLine',
        'changePlotId',
        'changeActiveTimelineSectionIdx',
        'closeNextChapterModal',
        'changePlotCreateStatus'
        // 'changeActsBuffer',
        // 'clearAiChoices',
        // 'resetVirtualTimeline',
        // 'toggleIsPlotContentPlaying'
      ])
    )
  );

  const toggleLoading = (isLoading: boolean) => {
    if (isLoading) {
      switchPageFoldStatus(FOLD_STATUS_ENUM.FOLD);
      toggleParallelWorldLoading(true);
    } else {
      switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);
      toggleParallelWorldLoading(false);
    }
  };

  // 创建新的世界线节点
  const manualCreateTimelinePlot = useMemoizedFn((plotId: string) => {
    const consumerState = useParallelWorldConsumerStore.getState();
    const newPlot: TimelinePlot = {
      plotId: plotId ?? '',
      cardId: consumerState.newWorld?.cardId ?? '',
      choice: choiceText,
      isFollowed: false,
      // TODO
      author: {
        avatar: user?.avatar ?? '',
        name: user?.name ?? '',
        uid: user?.uid ?? ''
      } as UserProfile
    } as TimelinePlot;
    return newPlot;
  });

  const createVirtualTimeline = (actInfo: CreatedAct | null) => {
    // const consumerState = useParallelWorldConsumerStore.getState();

    // 创建新的世界线
    const virtualPlot = manualCreateTimelinePlot(actInfo?.plotId as string);

    const virtualTimeline = [...newTimeLine, virtualPlot];

    const virtualPlotIndex = virtualTimeline.length - 1;

    // 新建时间线
    changeNewTimeLine(virtualTimeline);
    changeActiveTimelineSectionIdx(virtualPlotIndex);
  };

  const createStart = useMemoizedFn(async (actInfo: CreatedAct | null) => {
    createVirtualTimeline(actInfo);

    // hideLoading();
    toggleLoading(false);

    closeNextChapterModal();
    changePlotId(actInfo?.plotId ?? '');
    // 打开plotLoading弹窗 TODO(可能会去掉)
    // toggleIsPlotContentPlaying(true);
  });

  // 创建完保存
  const saveWhenCreateFinished = useMemoizedFn(async (actInfo: CreatedAct) => {
    try {
      const consumerState = useParallelWorldConsumerStore.getState();

      // 保存世界线
      const virtualPlotIdx = consumerState.activeTimelineSectionIdx;

      const refPlot = consumerState.newTimeLine.slice(0, virtualPlotIdx);

      const virtualPlot = consumerState.newTimeLine[virtualPlotIdx];

      await Promise.all([
        // 保存世界线
        saveCreatedWorld({
          cardId: consumerState.newWorld?.cardId as string,
          refPlotId: refPlot.map(s => s?.plotId),
          createPlotId: [virtualPlot?.plotId]
        }),
        // 保存新的Plot
        updateActs({
          acts: consumerState.acts as WorldAct[],
          plotId: virtualPlot?.plotId,
          cardId: consumerState.newWorld?.cardId as string
        })
      ]);
    } catch (e) {
      logWarn('saveWhenCreateFinished', e);
    }
  });

  const createFinished = async (actInfo: CreatedAct) => {
    changeChoiceText('');
    // clearAiChoices();
    await saveWhenCreateFinished(actInfo);
  };

  // const resetVirtualTimeline = () => {
  //   const consumerState = useParallelWorldConsumerStore.getState();

  //   console.log('!!!!!!!!!!plotCreateStatus', consumerState.plotCreateStatus);
  //   // 此处的比较取决于createStart的执行时机
  //   if (consumerState.plotCreateStatus < PLOT_CREATE_STATUS_ENUM.ACT_CREATING) {
  //     return;
  //   }

  //   const virtualPlotIdx = consumerState.activeTimelineSectionIdx;

  //   const originTimeline = consumerState.newTimeLine.slice(0, virtualPlotIdx);

  //   // 新建时间线
  //   changeNewTimeLine(originTimeline);
  //   changeActiveTimelineSectionIdx(virtualPlotIdx - 1);
  // };

  const createError = () => {
    // resetVirtualTimeline();
    // hideLoading();
    toggleLoading(false);

    changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.FAILED);
    // clearPlotContent();
    setTimeout(() => {
      // changeActsBuffer([]);
      // toggleIsPlotContentPlaying(false);
      openNextChapterModal();
    }, ERR_DISPLAY_DUR);
  };

  const disconnectHandler = new DisconnectHandler(createError);

  const createPlot = async () => {
    if (!newWorld) return;

    // showLoading('正在创建章节...');
    toggleLoading(true);
    changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.START);

    let isStarted = false;

    const abortController = createAbortController();

    createPlotByChoice(
      {
        prePlotId: newTimeLine[activeTimelineSectionIdx]?.plotId,
        cardId: newWorld.cardId,
        choice: choiceText
      },
      abortController.signal,
      async act => {
        console.log('act is:', JSON.stringify(act));

        // 初始化
        // if (!isStarted) {
        //   isStarted = true;
        //   changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.CONTENT_CREATING);
        //   createStart(act);
        // }
        // if (act?.isPlotContent && act.isFinish) {
        //   changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.ACT_PENDING);
        // }
        if (act?.act?.actId) {
          if (!isStarted) {
            isStarted = true;
            createStart(act);
          }
          // toggleIsPlotContentPlaying(false);
          changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.ACT_CREATING);
        }

        // 流程结束
        if (!act?.isPlotContent && act?.isFinish) {
          disconnectHandler.offDisconnect();
          await createFinished(act);
          changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.CREATED);
        }
      },
      e => {
        logWarn('createPlot', e);
        // 暂时不处理这个报错
        if (e.code === 1) return;

        // 关闭断链监听
        disconnectHandler.offDisconnect();

        showErr(e, REVIEW_ERR_ENUM.WORLD_CREATE);

        createError();
      }
    );

    disconnectHandler.onDisconnect();
  };

  return { createPlot };
};
