import { create } from 'zustand';
import { ESearchResourceType, getQuerySourceByType } from '../api/search';
import { logWarn } from '../utils/error-log';

export interface INewsItem {
  keyword: string;
  subIcon: ENewsSearchSubIcon;
}

export enum ENewsSearchSubIcon {
  HOT = 0,
  NEW = 1
}

export interface IResourceTab {
  feature: string;
  name: string;
}

type States = {
  initPlaceTexts: string[];
  initRanks: INewsItem[];
  lastPlaceText: string;
  initTags: IResourceTab[];
};

type Actions = {
  initTexts: () => void; // 轮播词预备
  initHotRanks: () => void; // 热榜准备
  updateLastPlaceText: (text: string) => void; //  更新最后一个轮播词
  initSearchTags: () => void; // 搜索结果 tags
};

const resetState = () => {
  return {
    initPlaceTexts: [],
    initRanks: [],
    lastPlaceText: '',
    initTags: []
  };
};

export const useSearchStore = create<States & Actions>()((set, get) => ({
  ...resetState(),
  async initTexts() {
    try {
      const texts = await getQuerySourceByType(ESearchResourceType.HOME);
      const content = texts?.materialList?.[0]?.content || JSON.stringify([]);
      set({
        initPlaceTexts: JSON.parse(content)
      });
    } catch (error) {
      logWarn('[home search text error]', error);
    }
  },
  async initHotRanks() {
    try {
      const texts = await getQuerySourceByType(ESearchResourceType.HOT_RANK);
      const content = texts?.materialList?.[0]?.content || JSON.stringify([]);
      set({
        initRanks: JSON.parse(content)
      });
    } catch (error) {
      logWarn('[home search rank error]', error);
    }
  },
  updateLastPlaceText(text: string) {
    set({
      lastPlaceText: text
    });
  },
  async initSearchTags() {
    try {
      const texts = await getQuerySourceByType(ESearchResourceType.RESULT_TAG);
      const content = JSON.parse(
        texts?.materialList?.[0]?.content || JSON.stringify([])
      );

      set({
        initTags:
          content?.map((i: { tabText: any; value: any }) => {
            return {
              name: i?.tabText,
              feature: i?.value
            };
          }) || []
      });
    } catch (error) {
      logWarn('[home search tags error]', error);
    }
  }
}));
