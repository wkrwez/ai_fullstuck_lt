import { create } from 'zustand';
import { appInfoClient } from '@/src/api/appinfo';
import { persist } from 'zustand/middleware';
import { StoreStorageKey, mkvStorage } from './persistent';

type States = {
  switchMap: { [key: string]: string };
};

enum SwitchType {
  ON = 'true',
  OFF = 'false',
  LEGANCY_ON = 'on',
  LEGANCY_OFF = 'off'
}

export enum SwitchName {
  // 个人页支持拉黑
  ENABLE_USER_REPORT = 'user_report',
  // 捏图页不露出 ip
  DISABLE_DRAWING_IP = 'pic_ip_avatar',
  // 隐藏首页顶部 ip 头像
  DISABLE_IP_ICON = 'feed_top_icon',
  // 创作者版本去除AI水印
  DISABLE_AI_WATER_MARK = 'author_water_mark',
  // 隐藏玩法入口-平行世界
  DISABLE_ENTRY_PARREL_WORLD = 'parallel_universe',
  // 隐藏玩法入口-发布
  DISABLE_ENTRY_PUBLISH = 'disable_entry_publish',
  // 隐藏搜索入口
  DISABLE_SEARCH_ENREY = 'diable_search_entry'
}

type Actions = {
  init: () => Promise<unknown>;
  get: (key: SwitchName) => string;
  restore: (switchMap: Record<string, string>) => void;
  checkIsOpen: (key: SwitchName) => boolean;
};

export const useControlStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      switchMap: {},
      init: async () => {
        try {
          const { switchMap } = await appInfoClient.fetchSwitches({});
          set({ switchMap });
          return switchMap;
        } catch (error) {
          return {};
        }
      },
      restore: switchMap => {
        set({
          switchMap
        });
      },
      get(key) {
        return get().switchMap[key] || '';
      },
      checkIsOpen(key) {
        const { get: getKey } = get();
        const value = getKey(key);
        if (value === SwitchType.ON || value === SwitchType.LEGANCY_ON) {
          return true;
        }
        return false;
      }
    }),
    {
      name: StoreStorageKey.ControlStore,
      storage: mkvStorage,
      partialize: state => {
        return {
          switchMap: state.switchMap
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn('Failed to rehydrate:', error);
        }
      }
    }
  )
);
