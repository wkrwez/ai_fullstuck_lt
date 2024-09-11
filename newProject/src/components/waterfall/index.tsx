import React, {
  Children,
  JSX,
  LegacyRef,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  NativeViewGestureHandlerProps
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import {
  DataProvider,
  RecyclerListView
} from 'recyclerlistview-masonrylayoutmanager';
import { feedClient } from '@/src/api/services';
import CellCard from '@/src/gums/feed/cellcard';
import { useHistoryStore } from '@/src/store/histroy';
import { $flex, $flexCenter, $flexColumn } from '@/src/theme/variable';
import { ListResponse } from '@/src/types';
import { EmptyPlaceHolder, EmptyWrapper } from '@Components/Empty';
import { Text } from '@Components/text';
import type { PartialMessage } from '@bufbuild/protobuf';
// import {
//   CardType,
//   IPType
// } from '@step.ai/proto-gen/raccoon/showcase/showcase_pb';
import {
  CardInfo,
  RichCardInfo
} from '@step.ai/proto-gen/raccoon/common/showcase_pb';
import { CardType } from '@step.ai/proto-gen/raccoon/common/types_pb';
import { Pagination } from '@step.ai/proto-gen/raccoon/common/utils_pb';
import { WindowCorrection } from 'recyclerlistview-masonrylayoutmanager/dist/reactnative/core/ViewabilityTracker';
import { useShallow } from 'zustand/react/shallow';
import PercentageCircle from './PercentageCircle';
import { LayoutUtil } from './layout-utils';
import { useLayoutCanScrollStore, usePanGestureStore } from './states';
import { EWaterFallType } from './type';

/**
 * file: recyclerview 实现
 */
export type FetchMethodPayloadType = {
  pagination: PartialMessage<Pagination>;
};
export type FetchMethodType = (
  payload: FetchMethodPayloadType
) => Promise<ListResponse>;

export interface IWaterFallProps {
  // id: bigint;
  fetchMethod: FetchMethodType;
  defaultFetch?: boolean;
  onScroll: (y: number) => void;
  emptyText?: string;
  onCreate?: () => void;
  children?: ReactNode;
  afford?: number;
}

interface ICustomScrollViewProps {
  props: JSX.IntrinsicAttributes &
    ScrollViewProps &
    NativeViewGestureHandlerProps &
    RefAttributes<ScrollView>;
  headerComponent: React.ReactNode;
  children: React.ReactNode;
  topPix: number;
  isSticky: boolean;
  beRefresh: boolean;
  setBeRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  notBounce: boolean;
  lastSticky: boolean;
  setLastSticky: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ICustomRefreshControlProps {
  bottomPercent: number;
  topPercent: number;
  offsetTop: number;
}

// interface ICardSourceType {
//   url: string,
//   width: number,
//   height: number,
//   title: string
//   avatar: string
//   username: string
// }

// 水平阈值
const slideHorThrehold = 50;
const SIZE = 10; // 每次拉几条数据

/**
 * 自定义 CustomRefreshControl
 * @param param0
 * @returns
 */
function CustomRefreshControl({
  bottomPercent,
  topPercent,
  offsetTop
}: ICustomRefreshControlProps) {
  // 自定义更新下拉 percent
  const rotation = useSharedValue(0);
  const percent = useSharedValue(0);

  useEffect(() => {
    // 开启旋转
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 640,
        easing: Easing.linear
      }),
      -1
    );
  }, [rotation]);

  useEffect(() => {
    // 开启百分比
    percent.value = withRepeat(
      withTiming(50, {
        duration: 100,
        easing: Easing.out(Easing.ease)
      }),
      -1
    );
  }, [percent]);

  const animatedStyles = useAnimatedStyle(() => {
    const rotateKeyframes = interpolate(rotation.value, [180, 360], [180, 360]);

    return {
      transform: [{ rotate: `${rotateKeyframes}deg` }]
    };
  });

  // 最大半椭圆
  const percentLimit = 50;
  const [reducePercent, setReducePercent] = useState(percentLimit);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // 更新速率 & 动画边界
    const gap = 4;
    if (!offsetTop) {
      if (reducePercent === percentLimit) {
        timer.current = setInterval(() => {
          setReducePercent(p => {
            if (p - gap <= 0) {
              clearInterval(timer.current);
              return 0;
            }
            return p - gap;
          });
        }, 40);
      }
      if (reducePercent === 0) {
        timer.current = setInterval(() => {
          setReducePercent(p => {
            if (p + gap >= percentLimit) {
              clearInterval(timer.current);
              return percentLimit;
            }
            return p + gap;
          });
        }, 40);
      }
    }
  }, [offsetTop, reducePercent]);

  const borderWidth = 3;
  const borderRadius = 11;
  const borderColor = '#D9D9D9';

  return (
    <View style={[$waterfallLoader, { marginTop: offsetTop }]}>
      {offsetTop ? (
        <View style={$flex}>
          <View style={$topCircle}>
            <PercentageCircle
              radius={borderRadius}
              percent={bottomPercent}
              color={borderColor}
              borderWidth={borderWidth}
            ></PercentageCircle>
          </View>
          <View style={$bottomCircle}>
            <PercentageCircle
              radius={borderRadius}
              percent={topPercent}
              color={borderColor}
              borderWidth={borderWidth}
            ></PercentageCircle>
          </View>
        </View>
      ) : (
        <Animated.View style={[$flex, $flexCenter, animatedStyles]}>
          <View style={$topCircle}>
            <PercentageCircle
              radius={borderRadius}
              percent={reducePercent}
              color={borderColor}
              borderWidth={borderWidth}
            ></PercentageCircle>
          </View>
          <View style={$bottomCircle}>
            <PercentageCircle
              radius={borderRadius}
              percent={reducePercent}
              color={borderColor}
              borderWidth={borderWidth}
            ></PercentageCircle>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * 瀑布流核心
 * @param param0
 * @returns
 */
export function WaterFall({
  // id,
  fetchMethod,
  onScroll,
  defaultFetch = false,
  emptyText,
  onCreate,
  afford = 0
}: IWaterFallProps) {
  // 原装数据
  const [sourceData, setSourceData] = useState<RichCardInfo[]>([]);
  const [count, setCount] = useState(0);
  // 是否 loading [页脚]
  const [loading, setLoading] = useState(false);
  // 同步 refresh control offset
  const [topPix, setTopPix] = useState(0);
  // 删除状态
  const { viewHistory, blacklist } = useHistoryStore(
    useShallow(state => ({
      viewHistory: state.viewHistory,
      blacklist: state.blacklist
    }))
  );

  const recyclerRef = useRef<ScrollView>(null);

  const updateSearchSticky = useLayoutCanScrollStore(
    state => state.updateSearchSticky
  );
  const updateSlideTop = usePanGestureStore(state => state.updateSlideTop);
  const slideHorOffset = usePanGestureStore(state => state.slideHorOffset);
  const updateSlideHorOffset = usePanGestureStore(
    state => state.updateSlideHorOffset
  );
  const searchSticky = useLayoutCanScrollStore(state => state.searchSticky);

  // // 翻页请求相关参数
  // const [lastTime, setLastTime] = useState<BigInt>();
  // const [lastType, setLastType] = useState<CardType>();
  const paginRef = useRef<Pagination | undefined>();
  const isEndRef = useRef(false);

  const loadingTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const data = sourceData.filter(item => {
      const cardId = item.card?.id;
      if (cardId && viewHistory[cardId]?.deleted) {
        return false;
      }
      if (item.user?.uid && blacklist.includes(item.user?.uid)) {
        return false;
      }
      return true;
    });
    if (data.length !== sourceData.length) {
      updateData(data);
    }
  }, [viewHistory, blacklist]);

  /**
   * 拉取数据
   * @param p1
   * @param p2
   */
  const fetchList = async (p1?: CardType, p2?: BigInt) => {
    if (isEndRef.current) return;
    setLoading(true);
    const res = await fetchMethod({
      pagination: paginRef.current || {
        cursor: undefined,
        size: SIZE
      }
    });

    const { cards, pagination } = res;
    // console.log(9999999, sourceData, cards);
    // 初始化一次
    console.log('fetchList', 'pagination', pagination, '', cards.length);
    const packData = sourceData.concat(cards);
    // console.log('packCard--------', packData);
    updateData(packData);
    // const { nextCursor, size } = pagination || {};

    if (!pagination?.nextCursor) {
      isEndRef.current = true;
      loadingTimer.current = setTimeout(() => {
        setLoading(false);
      }, 500);
    } else {
      paginRef.current = new Pagination({
        cursor: pagination?.nextCursor || '',
        size: SIZE
      });
    }
  };

  const updateData = (packData: RichCardInfo[]) => {
    const source = dataProvider.cloneWithRows(packData);
    setSourceData(() => packData);
    setDataProvider(source);
    setCount(packData.length);
  };

  useEffect(() => {
    if (defaultFetch) {
      fetchList();
    }
  }, []);

  // 是否下拉刷新
  const [isPullup, setIsPullup] = useState(false);

  const customScrollView = useMemo(
    () =>
      forwardRef(
        (
          {
            children,
            headerComponent,
            topPix,
            isSticky,
            beRefresh,
            setBeRefresh,
            notBounce,
            lastSticky,
            setLastSticky,
            ...props
          }: ICustomScrollViewProps,
          ref: LegacyRef<ScrollView>
        ) => {
          const accelerateMix = 15;
          const fakePercent =
            Math.abs(topPix + accelerateMix) > 50
              ? 50
              : Math.abs(topPix + accelerateMix);

          const scrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetY = e.nativeEvent.contentOffset.y;

            console.log(lastSticky, offsetY, 'endloose');
            if (!lastSticky && offsetY > 0) {
              // 开启首次回弹
              // recyclerRef.current && recyclerRef.current.scrollTo(0.1)
            }

            // scroll drag 松开
            if (offsetY <= 0 && !isPullup) {
              updateSlideTop(false);
              updateSearchSticky(false);
            } else if (offsetY < maxHold / 2 && moreThanHold) {
              // < 1/2 滑动阈值
              updateSlideTop(false);
              updateSearchSticky(false);
              setNotBounce(false);
            } else {
              setLastSticky(() => true);
            }

            if (fakePercent === 50) {
              setBeRefresh(() => true);
            }
          };

          useEffect(() => {
            if (beRefresh) {
              // 如果下拉刷新
              const refresh = async () => {
                // await fetchList();
                setBeRefresh(() => false);
              };
              refresh();
            }
          }, [beRefresh]);

          return (
            <ScrollView
              ref={ref}
              showsVerticalScrollIndicator={false}
              bounces={!notBounce}
              scrollEnabled={true}
              {...props}
            >
              {!isSticky ? (
                <CustomRefreshControl
                  bottomPercent={fakePercent}
                  topPercent={fakePercent}
                  offsetTop={beRefresh ? 0 : -50}
                ></CustomRefreshControl>
              ) : null}
              {children}
            </ScrollView>
          );
        }
      ),
    []
  );

  const handleListEnd = () => {
    fetchList();
  };

  /**
   * 页脚元素
   * @returns
   */
  const renderFooter = useCallback(() => {
    return loading ? (
      <ActivityIndicator
        size="small"
        style={[$pageLoading]}
        color="rgba(217, 217, 217, 1)"
      />
    ) : (
      <View style={{ height: 40 }}></View>
    );
  }, [loading]);

  /**
   * 封装器
   */
  const [dataProvider, setDataProvider] = useState(
    new DataProvider((r1, r2) => {
      return r1.key !== r2.key;
    })
  );
  /**
   * 布局陈列
   */
  const layoutProvider = useMemo(() => {
    const allData = dataProvider.getAllData();
    return LayoutUtil.getLayoutProvider(EWaterFallType.TWO_COLUMNS, allData);
  }, [dataProvider]);

  /**
   * 单元素陈列
   */
  const rowRenderer = useCallback(
    (type: string | number, data: RichCardInfo, index: number) => {
      return (
        <CellCard key={data.card?.id} data={data} index={index}></CellCard>
      );
    },
    []
  );

  // 上滑阈值
  const maxHold = 120;

  // 是否超过上滑阈值 [此阈值是提前返回 stickytop 判断]
  const [moreThanHold, setMoreThanHold] = useState(false);
  const [notBounce, setNotBounce] = useState(false);

  return (
    <EmptyWrapper
      isEmpty={count === 0}
      emptyText={emptyText}
      style={[
        $container,
        {
          // 只在空列表 居中
          marginBottom: count === 0 ? afford : 0
        }
      ]}
      onCreate={onCreate}
    >
      <RecyclerListView
        style={[$flex]}
        renderAheadOffset={200}
        onEndReached={handleListEnd}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={rowRenderer}
        renderFooter={renderFooter}
        // @ts-ignore todo
        externalScrollView={customScrollView as any}
        scrollThrottle={16}
        onEndReachedThreshold={10}
        onScroll={(_, x, y) => {
          onScroll(y);
        }}
        scrollViewProps={{
          headerComponent: CustomRefreshControl,
          topPix: topPix,
          ref: recyclerRef,
          isSticky: searchSticky,
          beRefresh: isPullup,
          setBeRefresh: setIsPullup,
          notBounce: notBounce
        }}
      />
    </EmptyWrapper>
  );
}

const $container: ViewStyle = {
  flex: 1,
  display: 'flex',
  paddingHorizontal: 6,
  alignItems: 'stretch',
  justifyContent: 'space-between'
};

const $waterfallLoader: ViewStyle = {
  ...$flexColumn,
  ...$flexCenter,
  height: 50
};

const $pageLoading: ViewStyle = {
  margin: 10
};

const $topCircle: ViewStyle = {
  transform: [
    {
      rotateY: '180deg'
    },
    {
      translateX: 0
    },
    {
      translateY: 11
    }
  ]
};

const $bottomCircle: ViewStyle = {
  transform: [
    {
      rotateX: '180deg'
    },
    {
      translateX: 0
    },
    {
      translateY: 11
    }
  ]
};
