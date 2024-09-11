import { create } from 'zustand';

/* 页面枚举 */
export enum PARALLEL_WORLD_PAGES_ENUM {
  MAIN = 'MAIN',
  FEED = 'FEED',
  CONSUMER = 'CONSUMER',
  PUBLISH = 'PUBLISH'
}

/* 折叠状态枚举 */
export enum FOLD_STATUS_ENUM {
  FOLD = 'FOLD',
  UNFOLD = 'UNFOLD',
  FOLD_2_UNFOLD = 'LOOP'
}

type WorldRouteOperation = 'push' | 'pop';

export interface WorldRoute {
  route: PARALLEL_WORLD_PAGES_ENUM;
  cardId?: string; // publish页面不需要
  plotId?: string; // publish页面不需要
}

/** 详情 */
type States = {
  parallelWorldPage: PARALLEL_WORLD_PAGES_ENUM;
  pageFoldStatus: FOLD_STATUS_ENUM;
  isParallelWorldLoading: boolean;
  worldRouteStack: WorldRoute[];
};

type Actions = {
  reset: () => void;
  switchParallelWorldPage: (page: PARALLEL_WORLD_PAGES_ENUM) => void;
  switchPageFoldStatus: (status: FOLD_STATUS_ENUM) => void;
  toggleParallelWorldLoading: (isLoading: boolean) => void;
  pushWorldRouteStack: (route: WorldRoute) => void;
  popWorldRouteStack: () => WorldRoute | undefined;
  refreshWorldRouteStack: () => void;
};

const getDefaultStates = (): States => ({
  // 页面导航
  parallelWorldPage: PARALLEL_WORLD_PAGES_ENUM.MAIN,
  // 折叠状态
  pageFoldStatus: FOLD_STATUS_ENUM.UNFOLD,
  // 加载状态
  isParallelWorldLoading: false,
  worldRouteStack: []
});

export const useParallelWorldStore = create<States & Actions>()((set, get) => ({
  ...getDefaultStates(),
  reset() {
    set(getDefaultStates());
  },
  switchParallelWorldPage(page: PARALLEL_WORLD_PAGES_ENUM) {
    set({ parallelWorldPage: page });
  },
  switchPageFoldStatus(status: FOLD_STATUS_ENUM) {
    set({ pageFoldStatus: status });
  },
  toggleParallelWorldLoading(isLoading: boolean) {
    set({ isParallelWorldLoading: isLoading });
  },
  pushWorldRouteStack(route) {
    const { worldRouteStack } = get();
    set({ worldRouteStack: [...worldRouteStack, route] });
  },
  popWorldRouteStack() {
    const { worldRouteStack } = get();
    const newStack = [...worldRouteStack];
    const popRoute = newStack.pop();
    // publish直接跳过到上一个页面
    if (
      newStack[newStack.length - 1]?.route === PARALLEL_WORLD_PAGES_ENUM.PUBLISH
    ) {
      newStack.pop();
    }
    set({ worldRouteStack: newStack });
    return popRoute;
  },
  refreshWorldRouteStack() {
    const { worldRouteStack } = get();
    set({ worldRouteStack: [...worldRouteStack] });
  }
}));
