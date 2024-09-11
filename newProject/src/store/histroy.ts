/** 浏览历史 */
import { create } from 'zustand';

type CacheInfo = {
  liked?: boolean;
  likeCount?: bigint;
  deleted?: boolean;
  following?: boolean;
};

type HistoryCache = Record<string, CacheInfo | null>;

type States = {
  blacklist: string[];
  // 图文详情维度的互动历史
  viewHistory: HistoryCache;
  // 用户维度的互动历史
  userInteraction: HistoryCache;
};

export enum InteractionType {
  USER = 'user',
  POST = 'post'
}

const HistoryKeyMap: Record<InteractionType, keyof States> = {
  [InteractionType.POST]: 'viewHistory',
  [InteractionType.USER]: 'userInteraction'
};

type Actions = {
  updateHistory: (type?: InteractionType, value?: HistoryCache) => void;
  clear: (type?: InteractionType) => void;
  get: (type: InteractionType, id: string) => CacheInfo | null;
  delete: (type: InteractionType, id: string) => void;
  update: (type: InteractionType, id: string, data: CacheInfo) => void;
};

export const useHistoryStore = create<States & Actions>()((set, get) => ({
  viewHistory: {},
  blacklist: [],
  userInteraction: {},
  updateHistory: (type?: InteractionType, value?: HistoryCache) => {
    const key = type ? HistoryKeyMap[type] : undefined;
    if (key && value) {
      set(state => ({
        ...state,
        [key]: value
      }));
    }
  },
  clear(type?: InteractionType) {
    const { updateHistory } = get();
    updateHistory(type, {});
  },
  delete(type, id) {
    const { viewHistory, updateHistory } = get();
    updateHistory(type, { ...viewHistory, [id]: null });
  },
  get(type, id) {
    const key = type ? HistoryKeyMap[type] : undefined;
    const state = get();
    return key ? (state[key] as HistoryCache)[id] : null;
  },
  addBlacklist(id: string) {
    set({
      blacklist: get().blacklist.concat([id])
    });
  },
  update(type, id, data) {
    const key = type ? HistoryKeyMap[type] : undefined;
    const stateAndActions = get();
    if (key) {
      const history = stateAndActions[key] as HistoryCache;
      stateAndActions.updateHistory(type, {
        ...history,
        [id]: { ...(history[id] || {}), ...data }
      });
    }
  }
}));
