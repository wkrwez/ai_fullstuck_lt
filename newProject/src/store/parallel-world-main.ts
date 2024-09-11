import { create } from 'zustand';
import {
  QueryWorldRes,
  TimelinePlot
} from '../../proto-registry/src/web/raccoon/world/world_pb';
import {
  ParallelWorldPlotRequest,
  QueryParallelWorldInfoRequest,
  queryParallelWorldInfo,
  queryParallelWorldPlot
} from '../api/parallel-world';
import { hideLoading, showLoading } from '../components';
import { UserProfile } from '../types';
import { logWarn } from '../utils/error-log';
import {
  ActDialog,
  ActType,
  WorldAct,
  WorldInfo,
  WorldPlot
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useConfigStore } from './config';
import {
  initParallelWorldEmojiInfo,
  useEmojiCreatorStore
} from './emoji-creator';

export type PlotInfo = Omit<WorldPlot, 'acts'>;

/** 详情 */
type States = {
  cardId: string;
  worldInfo: WorldInfo;
  isInitAnimationPlay: boolean;
  topic?: string;
  acts: WorldAct[];
  actIndex: number;
  playList: number[];
  playedList: number[];
  timeline: TimelinePlot[];
  activeTimelineSectionIdx: number;
  defaultTimelineSectionIdx: number;
  isParallelWordGuideVisible: boolean;
  isParallelWordGuideOpenByBack: boolean;
  isCommentVisible: boolean;
  isCommentInputVisible: boolean;
};
// 获取默认状态
const getDefaultStates = (): States => ({
  // cardId: '29739252245856256',
  cardId: '',
  worldInfo: {} as WorldInfo,
  isInitAnimationPlay: false,
  // 当前章节内容
  acts: [],
  actIndex: 0,
  // 播放状态
  playList: [],
  playedList: [],
  // 时间线
  timeline: [],
  activeTimelineSectionIdx: 0,
  defaultTimelineSectionIdx: -1, // 初始化时使用，判断是否展示视频
  isParallelWordGuideVisible: false,
  isParallelWordGuideOpenByBack: false,
  isCommentVisible: false,
  isCommentInputVisible: false
});

type Actions = {
  reset: () => void;
  changeCardId: (cardId: string) => void;
  getParallelWorldInfo: (payload: QueryParallelWorldInfoRequest) => void;
  getParallelWorldPlot: (payload: ParallelWorldPlotRequest) => void;
  clearActs: () => void;
  changeActIndex: (idx: number) => void;
  changePlayList: (list: number[]) => void;
  toggleIsInitAnimationPlay: (isPlay: boolean) => void;
  changePlayedList: (list: number[]) => void;
  changeActiveTimelineSectionIdx: (idx: number) => void;
  openParallelWordGuide: (isByBack?: boolean) => void;
  closeParallelWordGuide: () => void;
  toggleIsParallelWordGuideOpenByBack: (isByBack: boolean) => void;
  openCommentModal: () => void;
  closeCommentModal: () => void;
  openCommentInputModal: () => void;
  closeCommentInputModal: () => void;
};

export const useParallelWorldMainStore = create<States & Actions>()(
  (set, get) => ({
    ...getDefaultStates(),
    reset: () => {
      set(getDefaultStates());
    },
    changeCardId(cardId: string) {
      set({ cardId });
    },
    // 获取：基本信息+时间线+第一幕剧情
    async getParallelWorldInfo(payload) {
      try {
        const begin = Date.now();

        const res = await queryParallelWorldInfo(payload);

        initParallelWorldEmojiInfo(res);

        const end = Date.now();

        console.log('time spend', (end - begin) / 1000);

        const { acts = [], ...plotInfo } = res?.plot ?? {};

        const defaultPlotIndex = (plotInfo as PlotInfo).plotIndex ?? 0;

        const isInitAnimationPlay = defaultPlotIndex !== 0;

        set({
          acts,
          topic: res?.topic,
          worldInfo: res?.world,
          timeline: res?.timelinePlots ?? [],
          activeTimelineSectionIdx: defaultPlotIndex,
          isInitAnimationPlay,
          playList: isInitAnimationPlay ? [] : [0] // 播放动画时手动打开第一幕的流式
        });
      } catch (e) {
        logWarn('queryParallelWorldInfo', e);
        console.log('queryParallelWorldInfo ERROR PAYLOAD: ', payload);
      }
    },
    // 获取某一幕的剧情
    async getParallelWorldPlot(payload) {
      showLoading('加载中...');
      try {
        const res = await queryParallelWorldPlot(payload);

        console.log(
          'getParallelWorldPlot res ------------>',
          JSON.stringify(res)
        );

        set({ acts: res?.plot?.acts ?? [] });
      } catch (e) {
        logWarn('getParallelWorldPlot', e);
        console.log('getParallelWorldPlot PAYLOAD: ', payload);
      } finally {
        hideLoading();
      }
    },
    clearActs() {
      set({ acts: [] });
    },
    changeActIndex(idx) {
      set({ actIndex: idx });
    },
    changePlayList(list) {
      set({ playList: list });
    },
    toggleIsInitAnimationPlay(isPlay) {
      set({ isInitAnimationPlay: isPlay });
    },
    changePlayedList(list) {
      set({ playedList: list });
    },
    changeActiveTimelineSectionIdx(idx: number) {
      set({ activeTimelineSectionIdx: idx });
    },
    openParallelWordGuide(isByBack = false) {
      set({
        isParallelWordGuideVisible: true,
        isParallelWordGuideOpenByBack: isByBack
      });
    },
    closeParallelWordGuide() {
      set({ isParallelWordGuideVisible: false });
    },
    toggleIsParallelWordGuideOpenByBack(isByBack) {
      set({ isParallelWordGuideOpenByBack: isByBack });
    },
    openCommentModal() {
      set({ isCommentVisible: true });
    },
    closeCommentModal() {
      set({ isCommentVisible: false });
    },
    openCommentInputModal() {
      set({ isCommentInputVisible: true });
    },
    closeCommentInputModal() {
      set({ isCommentInputVisible: false });
    }
  })
);
