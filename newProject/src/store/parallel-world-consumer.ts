import { throttle } from 'lodash';
import { create } from 'zustand';
import {
  ParallelWorldPlotRequest,
  QueryParallelWorldInfoRequest,
  queryParallelWorldInfo,
  queryParallelWorldPlot
} from '../api/parallel-world';
import {
  SaveWorldReqRequest,
  UpdatePlotActRequest,
  saveWorld,
  uploadPlotAct
} from '../api/parallel-world/consumer';
import {
  CreatePlotRequest,
  CreateWorldRequest,
  CreatedAct,
  PlotChoicesRequest,
  createPlot,
  createWorld,
  queryPlotChoices
} from '../api/parallel-world/feed';
import { PickPbQueryParams } from '../api/utils';
import { ErrorRes } from '../api/websocket/stream_connect';
import { hideLoading, showLoading } from '../components';
import { logWarn } from '../utils/error-log';
import {
  ActImage,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import {
  CreateWorldRes,
  PlotChoice,
  QueryChoicesRes,
  TimelinePlot,
  UpdatePlotActRes
} from '@/proto-registry/src/web/raccoon/world/world_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { PlotInfo } from './parallel-world-main';

/* 创建Plot状态枚举 */
export enum PLOT_CREATE_STATUS_ENUM {
  // 触发流畅：用于限制重复触发
  START,
  // 创建content
  CONTENT_CREATING,
  // 等待act
  ACT_PENDING,
  // 创建act
  ACT_CREATING,
  // 创建完成
  CREATED,
  // 创建失败
  FAILED
}

// 生图信息
interface GenImgInfo {
  desc: string;
  img: ActImage[];
  isLoading: boolean;
}

// 生图信息Map
interface GenImgMap {
  [actId: string]: GenImgInfo;
}

type States = {
  /* 新世界线 */
  newWorld: PickPbQueryParams<CreateWorldRes> | null;
  // 用于后续判断是新建世界线还是新建节点
  isNewWorldMounted: boolean;
  // 章节创建阶段
  plotCreateStatus: PLOT_CREATE_STATUS_ENUM;
  // 控制取消生成
  abortController: AbortController | null;
  // 章节内容 - 用于提前展示
  plotId: string;
  plotContent: string;
  isPlotContentPlaying: boolean;
  // isPlotContentLoading: boolean;
  // 幕
  // isActGenerating: boolean;
  acts: (WorldAct | null)[];
  actIndex: number;
  // actsBuffer: (WorldAct | null)[];
  actsBackup: (WorldAct | null)[];
  isActsSaved: boolean; // 当前幕是否保存
  /* 世界线 */
  newTimeLine: TimelinePlot[];
  activeTimelineSectionIdx: number;
  // 用于编辑点副本
  editableActs: (WorldAct | null)[];
  /* 是否可编辑 */
  isGenCardEditable: boolean;
  /* 文案编辑弹窗 */
  isTextEditModalVisible: boolean;
  textEditAct: WorldAct | null;
  /** 图片换一换 */
  isImgGenModalVisible: boolean;
  imgGenAct: WorldAct | null;
  genImgMap: GenImgMap;
  /* 下一章 */
  isNextChapterModalVisible: boolean;
  /* 下一章提示 */
  aiPlotChoices: PlotChoice[];
  // isAiPlotChoicesLoading: boolean;
  choiceText: string; // 用户输入
};

type Actions = {
  reset: () => void;
  /* 世界线状态 */
  changePlotCreateStatus: (status: PLOT_CREATE_STATUS_ENUM) => void;
  /* 生成世界线，返回id */
  createParallelWorld: (
    payload: CreateWorldRequest
  ) => Promise<CreateWorldRes | undefined>;
  changeNewWorld: (world: CreateWorldRes | null) => void;
  initNewWorldInfo: (payload: QueryParallelWorldInfoRequest) => void;
  // 修改世界线初始化状态
  toggleIsNewWorldMounted: (isMounted: boolean) => void;
  // 创建控制器
  createAbortController: () => AbortController;
  // 初始化plotId
  changePlotId: (id: string) => void;
  // 备份acts
  backupActs: () => void;
  // 恢复acts的备份
  restoreActsBackup: () => void;
  // 获取plot
  createPlotByChoice: (
    payload: CreatePlotRequest,
    signal: AbortSignal,
    onMessage: (act: CreatedAct | null) => void,
    onError: (e: Uint8Array | PartialMessage<ErrorRes>) => void
  ) => Promise<void>;
  getPlot: (payload: ParallelWorldPlotRequest) => Promise<void>;
  // toggleIsPlotContentLoading: (isLoading: boolean) => void;
  // toggleIsActGenerating: (isLoading: boolean) => void;
  changeActs: (acts: WorldAct[]) => void;
  // changeActsBuffer: (acts: WorldAct[]) => void;
  changeActIndex: (index: number) => void;
  // toggleIsPlotLoading: (isLoading: boolean) => void;
  // 清除章节信息
  // clearPlot: () => void;
  toggleIsPlotContentPlaying: (isPlaying: boolean) => void;
  clearPlotContent: () => void;
  // 更新acts
  changeEditableActs: (acts: (WorldAct | null)[]) => void;
  updateActs: (
    payload: UpdatePlotActRequest
  ) => Promise<UpdatePlotActRes | void>;
  toggleIsActsSaved: (isSaved: boolean) => void;
  // 修改时间线
  changeNewTimeLine: (newTimeLine: TimelinePlot[]) => void;
  changeActiveTimelineSectionIdx: (idx: number) => void;
  resetVirtualTimeline: () => void;
  /* 是否可编辑 */
  toggleIsGenCardEditable: (isEditable: boolean) => void;
  /* 文案编辑弹窗 */
  openTextEditModal: () => void;
  closeTextEditModal: () => void;
  changeTextEditAct: (act: WorldAct | null) => void;
  /* 图片换一换弹窗 */
  openImgGenModal: () => void;
  closeImgGenModal: () => void;
  changeImgGenAct: (act: WorldAct | null) => void;
  changeGenImgMap: (actId: string, genImgInfo: GenImgInfo) => void;
  /* 下一章 */
  openNextChapterModal: () => void;
  closeNextChapterModal: () => void;
  /* world保存 */
  saveCreatedWorld: (payload: SaveWorldReqRequest) => Promise<void>;
  /* 下一章提示 */
  getAiChoices: (
    payload: PlotChoicesRequest
  ) => Promise<QueryChoicesRes | undefined>;
  // clearAiChoices: () => void;
  changeChoiceText: (text: string) => void;
};

const getDefaultStates = (): States => ({
  newWorld: null,
  isNewWorldMounted: false,
  plotCreateStatus: PLOT_CREATE_STATUS_ENUM.CREATED,
  plotContent: '',
  plotId: '',
  isPlotContentPlaying: false,
  abortController: null,
  // isActGenerating: false,
  acts: [],
  actIndex: 0,
  // actsBuffer: [],
  actsBackup: [],
  isActsSaved: false,
  newTimeLine: [],
  activeTimelineSectionIdx: 0,
  editableActs: [],
  isGenCardEditable: false,
  isTextEditModalVisible: false,
  textEditAct: null,
  isImgGenModalVisible: false,
  imgGenAct: null,
  genImgMap: {},
  isNextChapterModalVisible: false,
  aiPlotChoices: [],
  // isAiPlotChoicesLoading: false,
  choiceText: ''
});

export const useParallelWorldConsumerStore = create<States & Actions>()(
  (set, get) => ({
    ...getDefaultStates(),
    reset: () => {
      set(getDefaultStates());
    },
    /* 世界线id */
    changeNewWorld(world) {
      set({ newWorld: world });
    },
    toggleIsNewWorldMounted(isMounted) {
      set({ isNewWorldMounted: isMounted });
    },
    async initNewWorldInfo(payload) {
      try {
        const res = await queryParallelWorldInfo(payload);

        const { acts = [], ...plotInfo } = res?.plot ?? {};

        set({
          acts,
          newWorld: {
            worldId: res?.world?.worldId ?? '',
            cardId: res?.world?.cardId ?? '',
            worldNum: String(res?.world?.worldNum ?? '')
          },
          plotId: (plotInfo as PlotInfo).plotId,
          newTimeLine: res?.timelinePlots ?? [],
          activeTimelineSectionIdx: (plotInfo as PlotInfo).plotIndex ?? 0
        });
      } catch (e) {
        logWarn('initNewWorldInfo', e);
        console.log('initNewWorldInfo ERROR PAYLOAD: ', payload);
      }
    },
    changePlotId(id) {
      set({ plotId: id });
    },
    changePlotCreateStatus(status) {
      set({ plotCreateStatus: status });
    },
    toggleIsPlotContentPlaying(isPlaying) {
      set({ isPlotContentPlaying: isPlaying });
    },
    createAbortController() {
      const abortController = new AbortController();
      set({ abortController });
      return abortController;
    },
    clearPlotContent() {
      console.log('clearPlotContent TIME: ', Date.now());

      set({ plotContent: '' });
    },
    /* 生成平行世界(获取id) */
    async createParallelWorld(payload) {
      try {
        const res = await createWorld(payload);
        console.log('createParallelWorld------------> res', res);
        set({ newWorld: res });
        return res;
      } catch (e) {
        logWarn('createParallelWorld', e);
        throw e;
      }
    },
    backupActs: () => {
      const { acts } = get();
      set({ actsBackup: [...acts], acts: [] });
    },
    restoreActsBackup: () => {
      const { actsBackup } = get();
      set({ acts: [...actsBackup], actsBackup: [] });
    },
    /* 生成【章节Plot信息】 */
    async createPlotByChoice(payload, signal, onMessage, onError) {
      const { backupActs } = get();
      backupActs();

      set({ actIndex: 0 });

      let plotBuffer = '';
      const setContent = throttle((text: string) => {
        set({ plotContent: text });
      }, 1000);

      console.log('createPlotByChoice--> start', Date.now());

      await createPlot(
        payload,
        actInfo => {
          const { acts, plotContent } = get();

          if (signal.aborted) {
            console.log('aborted!!!!!!!!!!!!!!');
            return;
          }

          /* 处理 plotContent */
          if (actInfo?.isPlotContent) {
            return; // TODO:暂时不处理plotContent的逻辑
            console.log('createPlotByChoice--> plotContent', Date.now());

            if (!actInfo.isFinish) {
              plotBuffer += actInfo.deltaContent;
              console.log('createPlot------->', Date.now());
              setContent(plotBuffer);
            } else {
              // TODO处理deltaContent输出结束
              console.log(
                'createPlotByChoice------------>plotContent',
                JSON.stringify({ a: plotContent })
              );
            }
          }

          /* 处理 Acts */
          if (actInfo?.act?.actIndex !== undefined) {
            let newActs: (WorldAct | null)[] = [];
            console.log('createPlotByChoice--> act start', Date.now());

            // 最后一个返回的节点超出的情况，新建节点
            const currentActsLength = acts?.length ?? 0;
            if (actInfo.act.actIndex > currentActsLength - 1) {
              const appendCount =
                actInfo.act.actIndex - (currentActsLength - 1);
              const appendList: (WorldAct | null)[] = new Array(
                appendCount
              ).fill(null);
              // 将元素添加到对应的最后一个节点
              appendList[appendCount - 1] = actInfo.act as WorldAct;
              // 合并列表
              newActs = [...acts, ...appendList];
            } else {
              // 更新节点
              newActs = [...acts];
              newActs[actInfo.act.actIndex] = actInfo.act as WorldAct;
            }
            set({ acts: newActs });
          }

          // console.log(1234, actsBuffer[0]?.image?.imageUrl);

          if (!actInfo?.isPlotContent && actInfo?.isFinish) {
            console.log('finished!!!!!!!!!', actInfo);
            set({ actsBackup: [] });
          }

          // 执行 onMessage
          if (onMessage) onMessage(actInfo);
        },
        e => {
          if (e.code === 1) {
            logWarn('createPlot ERROR 1: ', e);
            return;
          }
          const { restoreActsBackup, resetVirtualTimeline } = get();
          restoreActsBackup();
          resetVirtualTimeline();
          onError(e);
          logWarn('createPlot ERROR: ', e);
          console.log('createPlot ERROR PAYLOAD: ', payload);
        }
      );
    },
    async getPlot(payload) {
      showLoading('加载中...');
      try {
        const res = await queryParallelWorldPlot(payload);

        set({ acts: res?.plot?.acts ?? [] });
      } catch (e) {
        logWarn('getPlot', e);
        console.log('getPlot payload:', payload);
      } finally {
        hideLoading();
      }
    },
    changeActs(acts) {
      set({ acts: acts });
    },
    // changeActsBuffer(acts) {
    //   set({ actsBuffer: acts });
    // },
    changeActIndex(index) {
      set({ actIndex: index });
    },
    // 编辑
    changeEditableActs(acts) {
      set({ editableActs: acts });
    },
    async updateActs(payload) {
      try {
        console.log('updateActs------------>', JSON.stringify(payload));
        const res = await uploadPlotAct(payload);

        if (res) {
          // 更新成功后一定要获取ai生成的choices
          set({ isActsSaved: true });

          // 更新最后一章时，要重新获取choices
          const { newTimeLine, getAiChoices } = get();
          if (newTimeLine[newTimeLine.length - 1]?.plotId === payload?.plotId) {
            await getAiChoices({
              cardId: payload.cardId,
              plotId: payload?.plotId
            });
          }
          return res;
        }
      } catch (e) {
        logWarn('updateActs', e);
        console.log('updateActs PAYLOAD: ', JSON.stringify(payload));
      }
    },
    toggleIsActsSaved(isSaved) {
      set({ isActsSaved: isSaved });
    },
    // 时间线
    changeNewTimeLine: newTimeLine => {
      set({ newTimeLine: newTimeLine });
    },
    changeActiveTimelineSectionIdx(idx: number) {
      set({ activeTimelineSectionIdx: idx });
    },
    resetVirtualTimeline: () => {
      const {
        plotCreateStatus,
        activeTimelineSectionIdx,
        newTimeLine,
        changeNewTimeLine,
        changeActiveTimelineSectionIdx
      } = get();

      // 此处的比较取决于createStart的执行时机
      if (plotCreateStatus < PLOT_CREATE_STATUS_ENUM.ACT_CREATING) {
        return;
      }

      const virtualPlotIdx = activeTimelineSectionIdx;

      const originTimeline = newTimeLine.slice(0, virtualPlotIdx);

      // 新建时间线
      changeNewTimeLine(originTimeline);
      changeActiveTimelineSectionIdx(virtualPlotIdx - 1);
    },
    /* 是否可编辑 */
    toggleIsGenCardEditable(isEditable: boolean) {
      set({ isGenCardEditable: isEditable });
    },
    /* 文案编辑弹窗 */
    openTextEditModal() {
      set({ isTextEditModalVisible: true });
    },
    closeTextEditModal() {
      set({ isTextEditModalVisible: false });
    },
    changeTextEditAct(act) {
      set({ textEditAct: act });
    },
    /* 图片换一换弹窗 */
    openImgGenModal() {
      set({ isImgGenModalVisible: true });
    },
    closeImgGenModal() {
      set({ isImgGenModalVisible: false });
    },
    changeImgGenAct(act) {
      set({ imgGenAct: act });
    },
    // 生图结果缓存,
    changeGenImgMap(actId, genImgInfo) {
      console.log('changeGenImgMap----------------->', actId, genImgInfo);

      set({
        genImgMap: {
          ...get().genImgMap,
          [actId]: genImgInfo
        }
      });
    },
    /* 生图描述 */
    openNextChapterModal() {
      set({ isNextChapterModalVisible: true });
    },
    closeNextChapterModal() {
      set({ isNextChapterModalVisible: false });
    },
    /* 世界线保存 */
    async saveCreatedWorld(payload) {
      try {
        console.log('saveCreatedWorld------------>', payload);
        const res = await saveWorld(payload);
        console.log('saveCreatedWorld------------>res is', res);
      } catch (e) {
        logWarn('saveCreatedWorld', e);
      }
    },
    // 提示
    changeChoiceText(text) {
      set({ choiceText: text });
    },
    async getAiChoices(payload) {
      try {
        console.log('getAiChoices--------------->payload', payload);
        const res = await queryPlotChoices(payload);
        console.log('getAiChoices--------------->res', res);
        set({
          aiPlotChoices: res.choices
          // isAiPlotChoicesLoading: false
        });
        return res;
      } catch (e) {
        set({
          aiPlotChoices: []
          // isAiPlotChoicesLoading: false
        });
        logWarn('getAiChoices: ', e);
      }
    }
  })
);
