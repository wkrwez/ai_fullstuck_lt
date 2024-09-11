import { create } from 'zustand';

type SPanGestureStore = {
    slideTop: boolean,
    updateSlideTop: (b: boolean) => void
    slideHorOffset: number,
    updateSlideHorOffset: (b: number) => void
    canBeTopFlag: number
    updateCanBeTopFlag: (b: number) => void
}

type SLayoutCanScrollStore = {
    searchSticky: boolean
    updateSearchSticky: (b: boolean) => void
}

// 手势相关
export const usePanGestureStore = create<SPanGestureStore>()(set => ({
    slideTop: false,
    updateSlideTop: (b: boolean) => set((state) => ({
        slideTop: b
    })),
    slideHorOffset: 0,
    updateSlideHorOffset: (b: number) => set((state) => ({
        slideHorOffset: b
    })),
    canBeTopFlag: 0,
    updateCanBeTopFlag: (b: number) => set((state) => ({
        canBeTopFlag: b
    })),
}))

// layout 相关
export const useLayoutCanScrollStore = create<SLayoutCanScrollStore>()(set => ({
    searchSticky: false,
    updateSearchSticky: (b: boolean) => set((state) => ({
        searchSticky: b
    })),
}))