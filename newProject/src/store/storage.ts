/**
 * 所有需要Storage的字段放这里,由于Storage 存储空间有限 2MB ，禁止放任何列表数据
 */
import { create } from 'zustand';
import { safeParseJson } from '@Utils/safeParseJson';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

type CommonJsonRecord = Record<string, string | boolean | number | undefined>;

// 其他Storage信息
type StorageState = {
  // 比如放用户的行为配置和开关等
  isAudioInput: boolean;
  isNewInstall: boolean;
  agreePolicy: boolean;
  skipUpdateVersion: string;
  notiReachDatedByApp: number; // 初始进入 app 通知 三天过期
  notiReachDatedByMsgCenter: number; // 消息中心 通知 1week 过期
  notiReachDatedByComment: number; //  评论 通知 1week 过期
  notiReachDatedByFollow: number; // 关注 通知 1week 过期
  notiReachDatedBySubscribe: number; //  订阅 通知 1week 过期
  notiReachDatedByPublish: number; //  发布作品 通知 1week 过期
  lastAppInvokeTime: number;
  visMakephotoDouble: number;
  makePhotoIp?: number;
  debugMode: boolean; // 开启debug模式
  emojiRedDotRecord?: string; // emoji 红点记录 {[uid: string]?: boolean}
  emojiInputTipRecord?: string; // emoji 小狸提示记录 {[uid: string]?: number}
  device: string;
  cid: string;
  resourceCache: { [key in string]: unknown };
  behaviorData?: string; // 用户行为数据
};

export enum EnotiType {
  notiReachDatedByApp = 'notiReachDatedByApp',
  notiReachDatedByMsgCenter = 'notiReachDatedByMsgCenter',
  notiReachDatedByComment = 'notiReachDatedByComment',
  notiReachDatedByFollow = 'notiReachDatedByFollow',
  notiReachDatedBySubscribe = 'notiReachDatedBySubscribe',
  notiReachDatedByPublish = 'notiReachDatedByPublish'
}

type StorageAction = {
  __setStorage: (partial: Partial<CombineStorageType>) => void;
  setNewInstall: (isNew: boolean) => void;
  updateJsonRecord: (
    storageKey: keyof StorageState,
    update: (obj: CommonJsonRecord) => CommonJsonRecord
  ) => void;
};

export type CombineStorageType = StorageState & StorageAction;

export const useStorageStore = create<CombineStorageType>()(
  persist(
    set => ({
      debugMode: false,
      makePhotoIp: undefined,
      isAudioInput: false,
      isNewInstall: true,
      agreePolicy: false,
      skipUpdateVersion: '',
      notiReachDatedByApp: 0, // 初始进入 app 通知 三天过期
      notiReachDatedByMsgCenter: 0, // 消息中心 通知 1week 过期
      notiReachDatedByComment: 0, //  评论 通知 1week 过期
      notiReachDatedByFollow: 0, // 关注 通知 1week 过期
      notiReachDatedBySubscribe: 0, //  订阅 通知 1week 过期
      notiReachDatedByPublish: 0, //  发布作品 通知 1week 过期,
      lastAppInvokeTime: 0,
      visMakephotoDouble: 0, // 是否访问过双人合照
      emojiRedDotRecord: undefined,
      emojiInputTipRecord: undefined,
      behaviorData: undefined, // 用户行为数据
      device: '', // 当前设备
      cid: '', //当前设备id
      resourceCache: {}, // 缓存
      // 危险方法，尽量避免使用
      setNewInstall(isNewInstall) {
        set({
          isNewInstall
        });
      },
      updateJsonRecord(key, update) {
        const valueString = this[key];
        const valueObj =
          typeof valueString === 'string'
            ? safeParseJson<CommonJsonRecord>(valueString) || {}
            : {};
        set({
          [key]: JSON.stringify(update(valueObj))
        });
      },
      __setStorage: partial => {
        set(partial);
      }
    }),
    {
      name: 'lipu-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
