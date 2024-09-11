import React, { useEffect, useMemo, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { CommonColor } from '@/src/theme/colors/common';

interface IPaginationProps {
  current: number;
  total: number;
}

enum ECursorType {
  START = 'start',
  MIDDLE = 'middle',
  END = 'end'
}

/** 策略参考：https://wvixbzgc0u7.feishu.cn/wiki/ICbwwXCpWiCB9bki8blcAQi7n2c  */

const TRANS_DURATION = 300;

export function Dot({ isMini = false, isCurrent = false }) {
  const scaleValue = useSharedValue(1);

  const $scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }]
  }));

  useEffect(() => {
    if (isMini) {
      scaleValue.value = withTiming(2 / 3, {
        duration: TRANS_DURATION
      });
    } else {
      scaleValue.value = withTiming(1, {
        duration: TRANS_DURATION
      });
    }
  }, [isMini]);

  return (
    <Animated.View
      style={[$dot, isCurrent ? $isActive : null, $scaleStyle]}
    ></Animated.View>
  );
}

export default function Pagination({ current, total }: IPaginationProps) {
  const LIMIT = 5; // 设定为 5
  const MAX = total - 1; // 数组上限
  const REST = 2; // 设定为 2 [middle 阶段左右滑时边界值改变]

  const [defaultIndex, setDefaultIndex] = useState(0);
  const [type, setType] = useState('');
  const [cursor, setCursor] = useState<ECursorType>(ECursorType.START); // 游标，标志为哪一个阶段
  const offsetX = useSharedValue(0);

  const [midMax, setMidMax] = useState<number>(0);
  const [midMin, setMidMin] = useState<number>(0);
  const [account, setAccount] = useState<number>(0);

  const isLessLimit = useMemo(() => MAX < LIMIT, []); // 小于正常标红

  useEffect(() => {
    // 边界判断，且设定左滑右滑
    if (!isLessLimit) {
      setDefaultIndex(defaultIndex => {
        if (defaultIndex - current < 0) {
          setType('left');
        } else {
          setType('right');
        }
        return current;
      });
    }
  }, [current, isLessLimit]);

  const _ease = (v: number) => {
    return withTiming(v, {
      duration: TRANS_DURATION
    });
  };

  const miniIndex = useMemo(() => {
    if (!isLessLimit) {
      if (cursor === ECursorType.START) {
        if (current < LIMIT - 1 && type === 'left') {
          return LIMIT - 1;
        }
        if (current === LIMIT - 1) {
          setCursor(() => {
            offsetX.value = _ease(-12 * (current - LIMIT + 2));
            setAccount(1);
            return ECursorType.MIDDLE;
          });
          setMidMax(current + 1);
          setMidMin(current - 3);
          return;
        }
        setMidMax(0);
        setMidMin(0);
        return LIMIT - 1;
      }
      if (cursor === ECursorType.END) {
        if (current > MAX - LIMIT + 1 && type === 'right') {
          return MAX - LIMIT + 1;
        }
        if (current === MAX - LIMIT + 1) {
          setCursor(() => {
            offsetX.value = _ease(-12 * (account - 1));
            setAccount(a => a - 1);
            return ECursorType.MIDDLE;
          });
          setMidMax(current + 3);
          setMidMin(current - 1);
          return;
        }
        setMidMax(0);
        setMidMin(0);
        return MAX - LIMIT + 1;
      }
      if (cursor === ECursorType.MIDDLE) {
        if (current === MAX - REST + 1 && type === 'left') {
          setCursor(ECursorType.END);
        }
        if (current === REST - 1 && type === 'right') {
          setCursor(ECursorType.START);
        }
        if (current === midMax) {
          setMidMax(midMax + 1);
          setMidMin(midMin + 1);
          offsetX.value = _ease(-12 * (account + 1));
          setAccount(a => a + 1);
        }
        if (current === midMin) {
          setMidMax(midMax - 1);
          setMidMin(midMin - 1);
          offsetX.value = _ease(-12 * (account - 1));
          setAccount(a => a - 1);
        }
      }
    }
  }, [cursor, isLessLimit, current, midMax, midMin, account, type]);

  const $translateX = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: offsetX.value
      }
    ]
  }));

  return (
    <View
      style={[
        $pagination,
        {
          width: isLessLimit ? 60 : 56
        }
      ]}
    >
      {isLessLimit ? (
        <View
          style={[
            $wrapper,
            {
              justifyContent: 'center'
            }
          ]}
        >
          {Array.from({ length: total })
            .fill(0)
            .map((item, itemIndex) => {
              return (
                <View
                  key={itemIndex}
                  style={[$dot, itemIndex === current ? $isActive : null]}
                ></View>
              );
            })}
        </View>
      ) : (
        <Animated.View style={[$translateX]}>
          <View
            style={[
              $wrapper,
              {
                justifyContent: 'flex-start'
              }
            ]}
          >
            {Array.from({ length: total })
              .fill(0)
              .map((item, itemIndex) => {
                const isLR =
                  itemIndex === miniIndex && cursor !== ECursorType.MIDDLE;
                const isMiddle =
                  (itemIndex === midMax || itemIndex === midMin) &&
                  cursor === ECursorType.MIDDLE;
                const isCurrent = itemIndex === current;
                return (
                  <Dot isMini={isLR || isMiddle} isCurrent={isCurrent}></Dot>
                );
              })}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const $pagination: ViewStyle = {
  overflow: 'hidden',
  height: 6,
  flexDirection: 'row',
  alignItems: 'center'
};

const $wrapper: ViewStyle = {
  height: 6,
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1
};

const $dot: ViewStyle = {
  width: 6,
  height: 6,
  marginRight: 6,
  borderRadius: 2,
  backgroundColor: '#E5E4E9'
};

const $isActive: ViewStyle = {
  width: 6,
  height: 6,
  backgroundColor: CommonColor.brand1
};
