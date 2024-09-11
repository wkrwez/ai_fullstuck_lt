import { create } from 'zustand';
import {
  CreatePlotChoiceRequest,
  CreateWorldRequest,
  PlotChoicesRequest,
  PlotTagsRequest,
  createPlotChoice,
  queryPlotChoices,
  queryPlotTags
} from '../api/parallel-world/feed';
import { logWarn } from '../utils/error-log';
import { CHOICE_FAIL_TIP } from '@/app/parallel-world/_components/others/li-help';
import { PlotTag } from '@/proto-registry/src/web/raccoon/world/common_pb';
import {
  PlotChoice,
  QueryChoicesRes
} from '@/proto-registry/src/web/raccoon/world/world_pb';

type LastCreateWorldPayload = CreateWorldRequest & { choice: string };

/** 详情 */
type States = {
  cardId: string;
  plotId: string;
  isFeedInputVisible: boolean;
  plotChoices: PlotChoice[];
  isPlotChoicesLoading: boolean;
  plotTags: PlotTag[];
  choiceText: string;
  isCreatingChoice: boolean;
  // 缓存上次的创建世界线请求参数
  lastCreateWorldPayload: LastCreateWorldPayload | null;
};

type Actions = {
  reset: () => void;
  openFeedInputModal: () => void;
  closeFeedInputModal: () => void;
  getChoices: (
    payload: PlotChoicesRequest
  ) => Promise<QueryChoicesRes | undefined>;
  getPlotTags: (payload: PlotTagsRequest) => Promise<void>;
  changeChoiceText: (text: string) => void;
  createChoice: (payload: CreatePlotChoiceRequest) => Promise<void>;
  toggleIsCreatingChoice: (isCreating: boolean) => void;
  changeLastCreateWorldPayload: (
    payload: LastCreateWorldPayload | null
  ) => void;
};

const getDefaultStates = (): States => ({
  plotId: '',
  cardId: '',
  isFeedInputVisible: false,
  plotChoices: [],
  isPlotChoicesLoading: false,
  plotTags: [],
  choiceText: '',
  isCreatingChoice: false,
  lastCreateWorldPayload: null
});

export const useParallelWorldFeedStore = create<States & Actions>()(
  (set, get) => ({
    ...getDefaultStates(),
    reset: () => {
      set(getDefaultStates());
    },
    openFeedInputModal() {
      set({ isFeedInputVisible: true });
    },
    closeFeedInputModal() {
      set({ isFeedInputVisible: false });
    },
    // 转折点列表
    async getChoices(payload) {
      set({ isPlotChoicesLoading: true });
      try {
        console.log('queryPlotChoices--------------->payload', payload);
        const res = await queryPlotChoices(payload);
        console.log('queryPlotChoices--------------->res', res);

        set({
          plotChoices: res.choices,
          plotId: payload?.plotId,
          cardId: payload?.cardId
        });
        return res;
      } catch (e) {
        logWarn('getChoices', e);
        console.log('getChoices ERROR Payload: ', payload);
        set({ plotChoices: [] });
      } finally {
        set({ isPlotChoicesLoading: false });
      }
    },
    // 剧情走向
    async getPlotTags(payload) {
      const res = await queryPlotTags(payload);
      set({ plotTags: res.tags });
    },
    // 创建新世界的提示词
    changeChoiceText(text) {
      set({ choiceText: text });
    },

    // 小狸帮想
    async createChoice(payload) {
      console.log('createPlotChoice----------->payload', payload);

      set({ isCreatingChoice: true });
      try {
        const res = await createPlotChoice(
          payload,
          d => {
            console.log('createPlotChoice----------->res', d);
            set({
              choiceText: d?.choice ?? '',
              isCreatingChoice: false
            });
          },
          e => {
            console.log('createPlotChoice ERROR: ', e);
            set({
              choiceText: CHOICE_FAIL_TIP,
              isCreatingChoice: false
            });
          }
        );
        console.log('createChoice------------>', res);
      } catch (e) {
        logWarn('createChoice', e);
      } finally {
      }
    },
    toggleIsCreatingChoice(isCreating) {
      set({ isCreatingChoice: isCreating });
    },
    changeLastCreateWorldPayload(payload) {
      set({ lastCreateWorldPayload: payload });
    }
  })
);
