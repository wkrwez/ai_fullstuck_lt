import { create } from 'zustand';
import { safeParseJson } from '../utils/safeParseJson';
import { useStorageStore } from './storage';

type States = {
  commentExpo: number; // 评论曝光
  commentTimes: number; // 评论次数
};
type StatesKey = keyof States;

type Actions = {
  init: () => void;
  cache: () => void;
  add: (key: StatesKey) => void;
  clear: (key: StatesKey) => void;
  reset: () => void;
  showCommmentGuide: () => boolean;
};

const resetState = () => ({
  commentExpo: 0,
  commentTimes: 0
});

/**
 * 1. 首次建联后，取值
 * 2. app退后台后，存值
 */

export const useBehaviorStore = create<States & Actions>((set, get) => {
  return {
    ...resetState(),
    init() {
      //初始化数据
      const data = useStorageStore.getState().behaviorData;
      if (data) {
        set({ ...(safeParseJson(data) || resetState()) });
      }
    },
    cache() {
      // 缓存到本地
      useStorageStore.getState().__setStorage({
        behaviorData: JSON.stringify({
          commentExpo: get().commentExpo,
          commentTimes: get().commentTimes
        })
      });
    },
    add(key) {
      set({
        [key]: get()[key] + 1
      });
    },
    clear(key) {
      set({
        [key]: 0
      });
    },
    clearAll() {
      useStorageStore.getState().__setStorage({ behaviorData: undefined });
      get().reset();
    },
    reset() {
      set({ ...resetState() });
    },
    // 评论引导气泡
    showCommmentGuide() {
      const { commentExpo, commentTimes } = get();
      return !(commentExpo > 10 || commentTimes > 3);
    }
  };
});
