import React, {
  JSX,
  LegacyRef,
  ReactNode,
  RefAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  PanResponder,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle
} from 'react-native';
import { NativeViewGestureHandlerProps } from 'react-native-gesture-handler';
// import { ScrollView } from 'react-native-gesture-handler';
import {
  DataProvider,
  RecyclerListView
} from 'recyclerlistview-masonrylayoutmanager';
import { feedAFClient } from '@/src/api';
import { Text } from '@/src/components';
import { EmptyPlaceHolder } from '@/src/components/Empty';
import CellCard, { ICellCardProps } from '@/src/gums/feed/cellcard';
import { useHistoryStore } from '@/src/store/histroy';
import { GameType, RichCardInfo } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportExpo, setPageName } from '@/src/utils/report';
import { useLayoutCanScrollStore, usePanGestureStore } from '../states';
import { EWaterFallType } from '../type';
// import {
//   CardType,
//   IPType
// } from '@step.ai/proto-gen/raccoon/showcase/showcase_pb';
import { FeedRichCardInfo } from '../type';
import { useRoute } from '@react-navigation/native';
import { Pagination } from '@step.ai/proto-gen/raccoon/common/utils_pb';
import { useShallow } from 'zustand/react/shallow';
import { LayoutUtil, getRatio } from './layout-utils';
import {
  ECellCardReportType,
  EWaterFallTabReportType,
  EWaterFallTabType
} from './type';

/**
 * file: recyclerview 实现
 */

type FetchType = 'append' | 'init' | 'refresh';
interface IWaterFallProps {
  feedType?: EWaterFallType;
  requestResult: (
    type: FetchType,
    pagination?: Pagination
  ) => Promise<{
    pagination?: Pagination;
    cards: RichCardInfo[] | FeedRichCardInfo[];
  }>;
  onScroll?: (ev: { offsetX: number; offsetY: number }) => void;
  defaultFetch?: boolean;
  tab?: EWaterFallTabType; // 以后区分推荐和关注 TODO:整合
  onFirstDataRendered?: (step: 1 | 2 | 3) => void; //1开始请求， 2请求完毕， 3 渲染完毕
  renderEmptyComponent?: (isIniting: boolean) => React.ReactNode;
  style?: ViewStyle;
  footerStyle?: ViewStyle;
  scrollContainerStyle?: ViewStyle;
  renderContentContainer?: (
    props?: object,
    children?: React.ReactNode
  ) => React.ReactNode;
  cellCardProps?: Omit<ICellCardProps, 'data' | 'index'>;
  scrollViewProps?: ScrollViewProps;
  disableRefreshControl?: boolean;
  fullEmpty?: boolean;
}

type ICustomScrollViewProps = ScrollViewProps & {
  fetchList: (type: FetchType) => void;
  isPullup: boolean;
  children: React.ReactNode;
  notBounce: boolean;
  disableRefreshControl: boolean;
};

// 水平阈值
const SIZE = 10; // 每次拉几条数据
export type WaterfallOperate = {
  replaceData: (
    modify: (cards: FeedRichCardInfo[]) => FeedRichCardInfo[]
  ) => void;
  fetchList: () => void;
  scrollTop: () => void;
};

/**
 * 瀑布流核心
 * @param param0
 * @returns
 */

const WaterFall = forwardRef<WaterfallOperate, IWaterFallProps>(
  (
    {
      onScroll = () => {},
      requestResult,
      onFirstDataRendered,
      tab,
      renderEmptyComponent,
      defaultFetch = false,
      renderContentContainer,
      style: $customStyle,
      scrollContainerStyle: $customScrollContainerStyle,
      footerStyle: $customFooterStyle,
      cellCardProps,
      feedType,
      disableRefreshControl = false,
      fullEmpty = false
    }: IWaterFallProps,
    ref
  ) => {
    // 原装数据
    const [sourceData, setSourceData] = useState<FeedRichCardInfo[]>([]);
    const [firstReqFinished, setReqFinished] = useState(false);
    // 是否 loading [页脚]
    const [loading, setLoading] = useState(false);
    const [isEnd, setEnd] = useState(false);
    // 同步 refresh control offset
    const scrollY = useRef(0);
    const loadingRef = useRef(false);

    const recyclerRef = useRef<ScrollView>(null);

    const { slideTop, updateSlideTop } = usePanGestureStore(
      useShallow(state => ({
        slideTop: state.slideTop,
        updateSlideTop: state.updateSlideTop
      }))
    );

    // 删除状态
    const { viewHistory, blacklist } = useHistoryStore(
      useShallow(state => ({
        viewHistory: state.viewHistory,
        blacklist: state.blacklist
      }))
    );
    const isEndRef = useRef(false);

    useEffect(() => {
      if (firstReqFinished) {
        onFirstDataRendered?.(3);
      }
    }, [firstReqFinished]);

    useEffect(() => {
      if (defaultFetch) {
        fetchList('init');
      }
    }, [defaultFetch]);

    // 是否下拉刷新
    const [isPullup, setIsPullup] = useState(false);
    /**
     * 封装器
     */
    const [dataProvider, setDataProvider] = useState(
      new DataProvider((r1: FeedRichCardInfo, r2: FeedRichCardInfo) => {
        return r1 !== r2;
      })
    );

    // // 翻页请求相关参数
    const paginRef = useRef<Pagination | undefined>();

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

    // useEffect(() => {
    //   if (!searchSticky) {
    //     setLastSticky(() => false);
    //   }
    // }, [searchSticky]);
    const updateData = (packData: FeedRichCardInfo[]) => {
      const source = dataProvider.cloneWithRows(packData);
      setSourceData(packData);
      setDataProvider(source);
    };

    /**
     * 拉取数据 TODO @zhenghaibo 需要添加兜底填充的参数 @刘鑫
     * @param p1
     * @param p2
     */
    const fetchList = async (type: FetchType = 'append') => {
      if ((type === 'append' && isEndRef.current) || loadingRef.current)
        return console.log('is loding or ending');

      const needLogFirstData = !firstReqFinished && onFirstDataRendered;
      setLoading(true);
      if (type === 'refresh') {
        setIsPullup(true);
      }
      loadingRef.current = true;
      console.log('下拉刷新', type);
      reportClick('refresh_button', {});
      try {
        if (needLogFirstData) onFirstDataRendered?.(1);
        const res = await requestResult(
          type,
          type !== 'append' ? undefined : paginRef.current
        );
        if (needLogFirstData) onFirstDataRendered?.(2);
        // console.log(paginRef.current, res);
        const { pagination } = res;
        console.log(pagination, 'paginationpagination');
        const cards = res.cards as FeedRichCardInfo[];
        // console.log(
        //   cards.map(card => card.card),
        //   'loading card'
        // );
        // 初始化一次
        const packData = type !== 'append' ? cards : sourceData.concat(cards);
        updateData(packData);

        console.log(pagination, cards.length, 'ddddddd');
        const noCursor = !pagination?.nextCursor;
        setEnd(noCursor);
        isEndRef.current = noCursor;
        if (!noCursor) {
          paginRef.current = new Pagination({
            cursor: pagination?.nextCursor || '',
            size: SIZE
          });
        }
      } catch (e) {
        console.log('[error]', '请求列表失败', e);
        logWarn('fetch waterfall error [fetchType]:' + type, e);
      } finally {
        setLoading(false);
        setIsPullup(false);
        loadingRef.current = false;
        if (needLogFirstData) setReqFinished(true);
      }
    };
    /**
     * 布局陈列
     */
    const layoutProvider = useMemo(() => {
      const allData = dataProvider.getAllData();
      return LayoutUtil.getLayoutProvider(
        feedType || EWaterFallType.TWO_COLUMNS,
        allData
      );
    }, [dataProvider, feedType]);

    useImperativeHandle(
      ref,
      () => ({
        replaceData: modify => {
          const newData = modify(dataProvider.getAllData() || []);
          const newProvider = dataProvider.cloneWithRows(newData);
          setSourceData(newData);
          setDataProvider(newProvider);
        },
        scrollTop: () => {
          recyclerRef.current?.scrollTo(0);
        },
        fetchList: () => {
          console.log('==lin init');

          fetchList('init');
        }
      }),
      [setDataProvider, dataProvider, setSourceData, fetchList]
    );
    /**
     * 单元素陈列
     */
    const rowRenderer = useCallback(
      (type: string | number, data: FeedRichCardInfo, index: number) => {
        return feedType === EWaterFallType.FULLSCREEN_TWO_COLUMNS ? (
          <View
            style={[
              { width: '100%', height: '100%' },
              index % 2 === 0
                ? {
                    paddingLeft: 6
                  }
                : {
                    paddingRight: 6
                  }
            ]}
          >
            <CellCard
              key={data.card?.id}
              data={data}
              index={index}
              {...cellCardProps}
            ></CellCard>
          </View>
        ) : (
          <CellCard
            key={data.card?.id}
            data={data}
            index={index}
            emitHolderIndex={(index: React.SetStateAction<number>) => {
              setActiveHolder(index);
            }}
            {...cellCardProps}
          ></CellCard>
        );
      },
      [feedType]
    );

    useEffect(() => {
      if (defaultFetch) {
        fetchList('init');
      }
    }, [defaultFetch]);

    /**
     * 页脚元素
     * @returns
     */
    const renderFooter = () => {
      if (loading) {
        return (
          <ActivityIndicator
            size="small"
            style={[$pageLoading, $customFooterStyle]}
            color="rgba(217, 217, 217, 1)"
          />
        );
      }
      if (isEnd) {
        return (
          <View
            style={[
              {
                alignItems: 'center',
                marginTop: 12
              },
              $customFooterStyle
            ]}
          >
            <Text style={{ color: 'rgba(0,0,0,0.4)' }}>小狸是有底线的~</Text>
          </View>
        );
      }
      return <View style={[{ height: 12 }, $customFooterStyle]}></View>;
    };

    const renderDefaultEmpty = () => (
      <View
        style={{
          flex: 1
        }}
      >
        <EmptyPlaceHolder>
          <Text color="rgba(0,0,0,0.4)">小狸两手空空哦~</Text>
        </EmptyPlaceHolder>
      </View>
    );

    // 横向动画
    // 上滑阈值
    // const maxHold = 120;

    // const canBeTopFlag = usePanGestureStore(state => state.canBeTopFlag);

    useEffect(() => {
      if (!slideTop) recyclerRef.current?.scrollTo(0);
    }, [slideTop]);

    /** 运营位置配置曝光 */
    const [reachedHolder, setReachedHolder] = useState(false);
    const [reachedBegin, setReachedBegin] = useState(0);
    const [indicesOffset, setIndicesOffset] = useState(0);
    const [shouldHalfReport, setShouldHalfReport] = useState(false);
    const [holderIndex, setHolderIndex] = useState(-1);

    useEffect(() => {
      // 运营位存在
      const cardData = sourceData.map(i => i.card);
      if (sourceData.length > 0 && sourceData.length < 15) {
        const index = sourceData
          .slice(0, 10)
          .findIndex(
            sd => sd?.card?.resourceInfo?.resourceList?.length || 0 > 0
          );

        if (index > -1) {
          setHolderIndex(index);
          console.log(
            cardData[index]?.resourceInfo?.resourceList,
            'cardData==='
          );
        }
      }
    }, [sourceData]);

    const [activeHolder, setActiveHolder] = useState(0);
    const [isFirstNoti, setIsFirstNoti] = useState(true);

    useEffect(() => {
      // 只有首页上报
      if (shouldHalfReport) {
        // 埋点一直上报
        reportExpo('resource_expo', {
          resourceid: sourceData[holderIndex]?.card?.id,
          picid:
            sourceData[holderIndex]?.card?.resourceInfo?.resourceList[
              activeHolder
            ]?.image?.url,
          pic_order: activeHolder + ''
        });
      }
    }, [shouldHalfReport, holderIndex, activeHolder, tab]);

    useEffect(() => {
      // 疲劳度单次上报
      if (shouldHalfReport && isFirstNoti) {
        try {
          feedAFClient.uploadHomepageOperation({
            homepageOperationId: sourceData[holderIndex]?.card?.id
          });
          setIsFirstNoti(false);
        } catch (error) {
          logWarn('[feed af report error]', error);
        }
      } else if (!shouldHalfReport) {
        setIsFirstNoti(true);
      }
    }, [shouldHalfReport, holderIndex, activeHolder, tab, isFirstNoti]);

    useEffect(() => {
      if (tab === EWaterFallTabType.RECOMMEND) {
        if (holderIndex >= 0 && holderIndex < 4) {
          // 首屏反正是必展示 4 个，如果用户停留过久，则疲劳度很快打满，如果不停留，回到最顶部时不区分是否过半高度
          if (reachedHolder) {
            setShouldHalfReport(true);
          } else {
            setShouldHalfReport(false);
          }
        } else if (sourceData[holderIndex]?.card) {
          const ratio = getRatio(
            sourceData[holderIndex].card!,
            LayoutUtil.getWindowWidth(),
            holderIndex
          );
          const halfHeight = (LayoutUtil.getWindowWidth() * ratio) / 2;
          // 上方 156 的偏移 [区分上下移动] // TODO: 首页才有，其他 waterfall 单独判断
          const signal = indicesOffset - reachedBegin < 0 ? 0 : 156;
          if (
            Math.abs(indicesOffset + signal - reachedBegin) >= halfHeight &&
            reachedHolder
          ) {
            // 过半
            setShouldHalfReport(true);
          } else {
            setShouldHalfReport(false);
          }
        }
      }
    }, [
      reachedHolder,
      reachedBegin,
      indicesOffset,
      sourceData,
      holderIndex,
      tab,
      activeHolder
    ]);

    const holderReport = useCallback(
      (all: number[], now: any, notNow: any) => {
        // 运营位
        if (all.includes(holderIndex)) {
          setReachedHolder(true);
          !reachedBegin && setReachedBegin(scrollY.current);
        } else {
          setReachedHolder(false);
          setReachedBegin(0);
        }
      },
      [reachedBegin, holderIndex]
    );

    const [lastIndicies, setLastIndicies] = useState<number[]>([]);
    const [indiciesMap, setIndiciesMap] = useState({});

    const commonReport = useCallback(
      (
        all: number[], // 所有
        now: number[], // 进场
        notNow: number[] // 出场
      ) => {
        if (!lastIndicies.length) {
          // 首次上报
          all.forEach(n => {
            reportExpo('content_expo', {
              contentid: sourceData?.[n]?.card?.id,
              card_order: n,
              staytime: 'first',
              traceid: sourceData?.[n]?.recExtraData
                ? JSON.parse(
                    sourceData?.[n]?.recExtraData || JSON.stringify({})
                  )
                : undefined,
              type: ECellCardReportType[
                sourceData?.[n]?.card?.gameType || GameType.UNKNOWN
              ],
              tab: EWaterFallTabReportType[tab!]
            });
          });
        }

        now.forEach((n: number) => {
          if (!lastIndicies.includes(n)) {
            // 统计进场时间
            setIndiciesMap(last => {
              return {
                ...last,
                [n + '']: {
                  startTime: Date.now()
                }
              };
            });
            setLastIndicies(last => {
              return [...last, n];
            });
          }
        });

        notNow.forEach((n: number) => {
          if (lastIndicies.includes(n)) {
            // 统计出场时间
            setIndiciesMap((map: Record<string, { [key: string]: number }>) => {
              const gap = Date.now() - map[n + ''].startTime;
              // 以停留时长为唯一性检验 【此时上报不重复】
              reportExpo('content_expo', {
                contentid: sourceData[n]?.card?.id,
                card_order: n,
                staytime: gap,
                traceid: sourceData?.[n]?.recExtraData
                  ? JSON.parse(
                      sourceData?.[n]?.recExtraData || JSON.stringify({})
                    )
                  : undefined,
                type: sourceData?.[n]?.card?.gameType,
                tab: EWaterFallTabReportType[tab!]
              });
              // 此时可以弹出键位 [保持小窗口]
              setLastIndicies(last => {
                let findIndex = last.indexOf(n);
                const res = last
                  .slice(0, findIndex)
                  .concat(
                    findIndex + 1 >= last.length
                      ? []
                      : last.slice(findIndex + 1)
                  );
                return res;
              });
              const cloneMap = JSON.parse(JSON.stringify(map));
              delete cloneMap[n];

              return cloneMap;
            });
          }
        });
      },
      [indiciesMap, lastIndicies, sourceData, tab]
    );

    /**
     * 坐标改变
     * 做一些曝光上报
     * @param all
     * @param now
     * @param notNow
     */
    const indiciesChanged = (
      all: number[], // 所有
      now: number[], // 进场
      notNow: number[] // 出场
    ) => {
      holderReport(all, now, notNow);
      commonReport(all, now, notNow);
    };

    return (
      // <GestureDetector gesture={pan}>
      <View style={[$container, $customStyle, { flex: fullEmpty ? 0 : 1 }]}>
        {sourceData.length > 0 ? (
          <RecyclerListView
            style={{ flex: 1 }}
            // renderAheadOffset={200}
            dataProvider={dataProvider}
            layoutProvider={layoutProvider}
            renderContentContainer={renderContentContainer}
            rowRenderer={rowRenderer}
            renderFooter={renderFooter}
            // 忽略这个 ts type
            // @ts-ignore
            externalScrollView={CustomScrollView}
            // onEndReachedThreshold={1}
            // onEndReached={handleListEnd}
            scrollViewProps={{
              ref: recyclerRef,
              fetchList,
              isPullup,
              notBounce: slideTop,
              style: $customScrollContainerStyle,
              disableRefreshControl
            }}
            onVisibleIndicesChanged={indiciesChanged}
            onScroll={(_rawEvent, offsetX, offsetY) => {
              const { nativeEvent } = _rawEvent;
              const total =
                nativeEvent.contentOffset.y +
                (nativeEvent.layoutMeasurement?.height || 0);
              if (
                total + 320 > +(nativeEvent.contentSize?.height || 0) &&
                offsetY > scrollY.current
              ) {
                fetchList('append');
              }
              scrollY.current = offsetY;
              setIndicesOffset(offsetY);

              onScroll({
                offsetX,
                offsetY
              });
            }}
            // applyWindowCorrection={getPixel}
          />
        ) : (
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              paddingBottom: fullEmpty ? 0 : 160
            }}
            showsVerticalScrollIndicator={false}
            bounces={disableRefreshControl ? false : true}
            refreshControl={
              disableRefreshControl ? (
                <></>
              ) : (
                <RefreshControl
                  refreshing={isPullup}
                  onRefresh={() => {
                    fetchList('refresh');
                  }}
                />
              )
            }
          >
            {renderEmptyComponent
              ? renderEmptyComponent(!firstReqFinished)
              : renderDefaultEmpty()}
          </ScrollView>
        )}
      </View>
      // </GestureDetector>
    );
  }
);

const CustomScrollView = forwardRef(
  (
    {
      children,
      notBounce,
      isPullup,
      fetchList,
      style,
      disableRefreshControl = false,
      ...props
    }: ICustomScrollViewProps,
    ref: LegacyRef<ScrollView>
  ) => {
    return (
      <ScrollView
        ref={ref}
        contentContainerStyle={[
          {
            paddingBottom: 24
          },
          style
        ]}
        showsVerticalScrollIndicator={false}
        bounces={!notBounce}
        {...props}
        refreshControl={
          disableRefreshControl ? (
            <></>
          ) : (
            <RefreshControl
              refreshing={isPullup}
              onRefresh={() => {
                if (notBounce) return; //避免鬼畜更新
                fetchList('refresh');
              }}
            />
          )
        }
      >
        {children}
      </ScrollView>
    );
  }
);

const $container: ViewStyle = {
  paddingHorizontal: 6,
  alignItems: 'stretch',
  justifyContent: 'space-between'
};

const $pageLoading: ViewStyle = {
  margin: 10
};

export default WaterFall;
