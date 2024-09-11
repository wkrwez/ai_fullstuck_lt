import { CreatedAct } from '@/src/api/parallel-world/feed';
import { selectState } from '@/src/store/_utils';
import { useAppStore } from '@/src/store/app';
import {
  FOLD_STATUS_ENUM,
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import {
  PLOT_CREATE_STATUS_ENUM,
  useParallelWorldConsumerStore
} from '@/src/store/parallel-world-consumer';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { UserProfile } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { DisconnectHandler } from '../_utils/disconnect-handler';
import { REVIEW_ERR_ENUM, showErr } from '../_utils/error-msg';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { TimelinePlot } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';
import { useReset } from './reset.hook';

export const ERR_DISPLAY_DUR = 1000;

// 新建世界线时创建节点
export const useCreatePlotInNewWorld = () => {
  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );

  const {
    pushWorldRouteStack,
    popWorldRouteStack,
    switchPageFoldStatus,
    toggleParallelWorldLoading
  } = useParallelWorldStore(
    useShallow(state =>
      selectState(state, [
        'pushWorldRouteStack',
        'popWorldRouteStack',
        'switchPageFoldStatus',
        'toggleParallelWorldLoading'
      ])
    )
  );

  const { timeline, activeTimelineSectionIdx } = useParallelWorldMainStore(
    useShallow(state =>
      selectState(state, ['timeline', 'activeTimelineSectionIdx'])
    )
  );

  const { choiceText, changeChoiceText, changeLastCreateWorldPayload } =
    useParallelWorldFeedStore(
      useShallow(state =>
        selectState(state, [
          'choiceText',
          'changeChoiceText',
          'changeLastCreateWorldPayload'
        ])
      )
    );

  const { resetConsumer } = useReset();

  // 创建时，所有consumer中的数据都直接通过getState拿
  const {
    createPlotByChoice,
    toggleIsNewWorldMounted,
    createAbortController,
    changeNewTimeLine,
    changeActiveTimelineSectionIdx,
    updateActs,
    changePlotId,
    saveCreatedWorld,
    changePlotCreateStatus
    // toggleIsPlotContentPlaying
  } = useParallelWorldConsumerStore(
    useShallow(state =>
      selectState(state, [
        'createPlotByChoice',
        'toggleIsNewWorldMounted',
        'createAbortController',
        'changeNewTimeLine',
        'changeActiveTimelineSectionIdx',
        'updateActs',
        'changePlotId',
        'saveCreatedWorld',
        'changePlotCreateStatus'
        // 'toggleIsPlotContentPlaying'
      ])
    )
  );

  // 手动创建timeline的节点
  const manualCreateTimelinePlot = (plotId: string) => {
    const consumerState = useParallelWorldConsumerStore.getState();

    const newPlot: TimelinePlot = {
      plotId: plotId ?? '',
      cardId: consumerState.newWorld?.cardId ?? '',
      choice: choiceText,
      isFollowed: false,
      // TODO 检查一下
      author: {
        avatar: user?.avatar ?? '',
        name: user?.name ?? '',
        uid: user?.uid ?? ''
      } as UserProfile
    } as TimelinePlot;

    return newPlot;
  };

  const createVirtualTimeline = (actInfo: CreatedAct | null) => {
    // 创建新的世界线
    const virtualPlot = manualCreateTimelinePlot(actInfo?.plotId as string);

    const virtualTimeline = [
      ...timeline.slice(0, activeTimelineSectionIdx + 1),
      virtualPlot
    ];

    const virtualPlotIndex = virtualTimeline.length - 1;

    // 新建时间线
    changeNewTimeLine(virtualTimeline);
    changeActiveTimelineSectionIdx(virtualPlotIndex);
  };

  const createStart = (actInfo: CreatedAct | null) => {
    createVirtualTimeline(actInfo);

    const consumerState = useParallelWorldConsumerStore.getState();

    changePlotId(actInfo?.plotId ?? '');

    // 页面展示逻辑
    // toggleParallelWorldLoading(false);
    // 跳转组件路由
    pushWorldRouteStack({
      route: PARALLEL_WORLD_PAGES_ENUM.CONSUMER,
      cardId: consumerState.newWorld?.cardId ?? '',
      plotId: actInfo?.plotId ?? ''
    });
    switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);
    // toggleIsPlotContentPlaying(true);
  };

  const saveWhenCreateFinished = async (actInfo: CreatedAct | null) => {
    try {
      const consumerState = useParallelWorldConsumerStore.getState();

      const virtualPlotIdx = consumerState.activeTimelineSectionIdx;

      const refPlot = consumerState.newTimeLine.slice(0, virtualPlotIdx);

      const virtualPlot = consumerState.newTimeLine[virtualPlotIdx];

      console.log('Date1---------->', Date.now());
      await Promise.all([
        // 保存世界线
        saveCreatedWorld({
          cardId: consumerState.newWorld?.cardId as string,
          refPlotId: refPlot.map(s => s?.plotId),
          createPlotId: [virtualPlot.plotId]
        }),
        // 保存新的Plot
        updateActs({
          acts: consumerState.acts as WorldAct[],
          plotId: virtualPlot?.plotId,
          cardId: consumerState.newWorld?.cardId as string
        })
      ]);
      console.log('Date2---------->', Date.now());
    } catch (e) {
      console.log('saveWhenCreateFinished:', e);
    }
  };

  const createFinished = async (actInfo: CreatedAct | null) => {
    toggleIsNewWorldMounted(true);
    changeChoiceText('');
    await saveWhenCreateFinished(actInfo);
  };

  const createError = () => {
    changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.FAILED);
    // 预留错误展示时间
    setTimeout(() => {
      // 清空对比请求
      changeLastCreateWorldPayload(null);
      // 清空状态
      resetConsumer();
      // 处理页面逻辑
      // toggleIsPlotContentPlaying(false);
      toggleParallelWorldLoading(false);

      switchPageFoldStatus(FOLD_STATUS_ENUM.UNFOLD);
      // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.FEED);
      const state = useParallelWorldStore.getState();
      const routeStack = state.worldRouteStack;
      if (
        routeStack[routeStack.length - 1].route !==
        PARALLEL_WORLD_PAGES_ENUM.FEED
      ) {
        popWorldRouteStack();
      }
    }, ERR_DISPLAY_DUR);
  };

  const createPlot = async () => {
    const state = useParallelWorldConsumerStore.getState();

    if (!state?.newWorld?.cardId) return;

    // 记录执行状态
    let isStarted = false;
    changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.START);

    const disconnectHandler = new DisconnectHandler(createError);

    const controller = createAbortController();

    createPlotByChoice(
      {
        prePlotId: timeline[activeTimelineSectionIdx]?.plotId,
        cardId: state.newWorld.cardId,
        choice: choiceText
      },
      controller.signal,
      async act => {
        console.log('act is:', JSON.stringify(act));
        // 初始化，只执行一次
        // if (!isStarted) {
        //   isStarted = true;
        //   changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.CONTENT_CREATING);
        //   createStart(act);
        // }
        // 处理plotContent加载结束
        // if (act?.isPlotContent && act.isFinish) {
        //   changePlotCreateStatus(PLOT_CREATE_STATUS_ENUM.ACT_PENDING);
        // }
        // 处理act生成开始
        if (act?.act?.actId) {
          console.log('------->', act);

          if (!isStarted) {
            isStarted = true;
            createStart(act);
          }

          // createStart(act);

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
        logWarn('createPlotInNewWorld', e);
        disconnectHandler.offDisconnect();
        // 暂时不处理这个报错
        if (e.code === 1) return;

        showErr(e, REVIEW_ERR_ENUM.WORLD_CREATE);

        createError();
      }
    );

    disconnectHandler.onDisconnect();
  };

  return { createPlot };
};
