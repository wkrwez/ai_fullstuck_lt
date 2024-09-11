import { useMemoizedFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

enum ScrollDirection {
  PAGE_SLIDE_DOWN = 0,
  PAGE_SLIDE_UP = 1
}

export const useWaterfallGesture = (params?: {
  threshold?: number;
  onReachThreshold?: (bounces: boolean, cb: () => void) => void;
  active?: boolean;
}) => {
  const { threshold = 10, onReachThreshold, active } = params || {};
  const [bounces, setBounce] = useState(true);
  const scrollTop = useRef<number>(0);
  const scrollDirection = useRef<ScrollDirection>(
    ScrollDirection.PAGE_SLIDE_DOWN
  );
  const isFastScrolling = useRef<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const waterfallRef = useRef<ScrollView | null>(null);

  const update = useMemoizedFn(() => {
    if (scrollTop.current >= threshold) {
      if (onReachThreshold) {
        onReachThreshold(false, () => setBounce(false));
      } else {
        setBounce(false);
      }
    } else if (scrollTop.current < threshold) {
      if (onReachThreshold) {
        onReachThreshold(true, () => setBounce(true));
      } else {
        setBounce(true);
      }
    }
  });

  const onScroll = useMemoizedFn(({ offsetY }: { offsetY: number }) => {
    scrollDirection.current =
      offsetY === scrollTop.current
        ? scrollDirection.current
        : offsetY > scrollTop.current
          ? ScrollDirection.PAGE_SLIDE_DOWN
          : ScrollDirection.PAGE_SLIDE_UP;
    isFastScrolling.current = Math.abs(offsetY - scrollTop.current) > 50;
    scrollTop.current = offsetY;

    // 向下划并且超过阈值时立即更新
    if (
      scrollDirection.current === ScrollDirection.PAGE_SLIDE_DOWN &&
      offsetY > threshold &&
      bounces
    ) {
      update();
    }
  });

  const onScrollEnd = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
    update();
  };

  const onTouchEnd = () => {
    if (
      !isFastScrolling.current ||
      scrollDirection.current === ScrollDirection.PAGE_SLIDE_DOWN
    ) {
      update();
    } else {
      timer.current = setTimeout(() => {
        update();
      }, 300);
    }
  };

  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    []
  );

  useEffect(() => {
    if (active) {
      update();
    }
  }, [active]);

  return {
    onScroll,
    ref: waterfallRef,
    scrollViewProps: {
      ref: waterfallRef,
      bounces,
      ontouchstart: () => {
        console.log('===lin touch start');
      },
      onMomentumScrollEnd: onScrollEnd,
      onScrollEndDrag: onTouchEnd
    }
  };
};
