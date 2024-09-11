import { useMemoizedFn } from 'ahooks';
import { useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import CellCard from '@/src/gums/feed/cellcard';
import { CommonColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { GameType } from '@/src/types';
import { reportExpo } from '@/src/utils/report';
import { InfiniteList } from '../infiniteList';
import { RequestScene } from '../infiniteList/typing';
import { SkeletonColumn, SkeletonRow, SkeletonSpan } from '../skeletion';
import { useIsFocused } from '@react-navigation/native';
import { LayoutUtil } from './layout-utils';
import { EWaterFallType, IWaterFallProps, WaterFallCardData } from './type';

export const ECellCardReportType = {
  [GameType.DRAWING]: 'nietu',
  [GameType.WORLD]: 'universe',
  [GameType.UNKNOWN]: 'unknown',
  [GameType.TALK]: 'talk',
  [GameType.STRATEGY]: 'strategy',
  [GameType.FIGHT]: 'fight'
};

export function WaterFall2(props: IWaterFallProps) {
  const {
    data,
    getLayoutProvider = defaultGetLayoutProvider,
    renderItem = defaultRenderItem,
    customListProps,
    reportParams,
    isActive = true,
    ...rest
  } = props;

  const inviewHistory = useRef<Record<string, number>>({});
  const inviewHistoryCache = useRef<string[]>([]);

  const isFocused = useIsFocused();

  const handleReport = useMemoizedFn(
    (
      all: number[] | string[], // 所有当前可见的 item index
      now: number[] | string[], // 进场 item index
      notNow: number[] | string[], // 出场 item index
      prevSourceData?: WaterFallCardData[]
    ) => {
      const calcReportParams = (
        index: number | string,
        data?: WaterFallCardData[]
      ) => {
        const indexNum = Number(index);
        return {
          contentid: data?.[indexNum]?.card?.id,
          contenttitle: data?.[indexNum]?.card?.title,

          card_order: indexNum,
          // staytime: 'first',
          traceid: data?.[indexNum]?.recExtraData
            ? JSON.parse(data?.[indexNum]?.recExtraData || JSON.stringify({}))
            : undefined,
          type: ECellCardReportType[
            data?.[indexNum]?.card?.gameType || GameType.UNKNOWN
          ],
          ...reportParams
        };
      };

      // 上报离开埋点
      for (let itemIndex of notNow) {
        const enterTime = inviewHistory.current[String(itemIndex)];
        reportExpo(
          'content_leave',
          {
            ...calcReportParams(itemIndex, prevSourceData || data),
            staytime: enterTime ? Date.now() - enterTime : 'unknown'
          },
          'leave'
        );
        const cur = data?.[Number(itemIndex)];
        if (cur) {
          props.onCardLeave?.(cur);
        }
        delete inviewHistory.current[String(itemIndex)];
      }

      // 上报曝光埋点
      for (let itemIndex of now) {
        reportExpo('content_expo', calcReportParams(itemIndex, data));
        inviewHistory.current[String(itemIndex)] = Date.now();
        const cur = data?.[Number(itemIndex)];

        if (cur) {
          props.onCardExposure?.(cur);
        }
      }
    }
  );

  // 刷新更新=》曝光/离开
  const onRequestWrapper = async (scene: RequestScene) => {
    const prevData = data;
    await props.onRequest?.(scene);

    if (scene === RequestScene.REFRESHING) {
      const remaining = Object.keys(inviewHistory.current);
      handleReport(remaining, remaining, remaining, prevData);
    }
  };

  // 滚动=》曝光/离开
  const onVisibleIndicesChanged = (
    all: number[], // 所有当前可见的 item index
    now: number[], // 进场 item index
    notNow: number[] // 出场 item index
  ) => {
    if (isActive && isFocused) {
      handleReport(all, now, notNow);
    } else {
      // 避免初始化时为不可见状态
      inviewHistoryCache.current = now.map(n => String(n));
    }
  };

  // 组件可见性变化=》曝光/离开
  useEffect(() => {
    if (isActive && isFocused) {
      if (inviewHistoryCache.current.length) {
        // 避免页面 back 到当前页面时 pageName 还未设置好
        setTimeout(() => {
          handleReport(
            inviewHistoryCache.current,
            inviewHistoryCache.current,
            []
          );
          inviewHistoryCache.current = [];
        });
      }
    } else {
      const remaining = Object.keys(inviewHistory.current);
      inviewHistoryCache.current = remaining;
      handleReport([], [], remaining);
    }
  }, [isActive, isFocused]);

  // 组件销毁
  useEffect(() => {
    return () => {
      const remaining = Object.keys(inviewHistory.current);
      inviewHistoryCache.current = remaining;
      handleReport([], [], remaining);
    };
  }, []);

  return (
    <InfiniteList<WaterFallCardData>
      renderLoading={renderSkeleton}
      {...rest}
      data={data}
      customListProps={{
        onVisibleIndicesChanged,
        ...customListProps
      }}
      getLayoutProvider={getLayoutProvider}
      renderItem={renderItem}
      onRequest={onRequestWrapper}
    ></InfiniteList>
  );

  function renderSkeleton() {
    return (
      <SkeletonColumn style={{ paddingHorizontal: 8 }} gap={4} repeat={2}>
        <SkeletonRow gap={4} repeat={2}>
          <SkeletonSpan
            height={300}
            style={{
              flex: 1,
              backgroundColor: CommonColor.white,
              overflow: 'hidden'
            }}
            radius={10}
          >
            <SkeletonColumn style={{}} gap={10}>
              <SkeletonSpan
                theme={Theme.LIGHT}
                height={238}
                width={'100%'}
                radius={0}
              />
              <View style={{ paddingHorizontal: 10 }}>
                <SkeletonSpan
                  theme={Theme.LIGHT}
                  height={18}
                  width={'80%'}
                  radius={3}
                />
              </View>
              <View style={{ paddingHorizontal: 10 }}>
                <SkeletonSpan
                  theme={Theme.LIGHT}
                  height={14}
                  width={'60%'}
                  radius={3}
                />
              </View>
            </SkeletonColumn>
          </SkeletonSpan>
        </SkeletonRow>
      </SkeletonColumn>
    );
  }

  function defaultRenderItem(
    type: string | number,
    data: WaterFallCardData,
    index: number,
    extendedState?: object,
    layoutInfo?: { x: number; y: number }
  ) {
    const isLeft = layoutInfo?.x === 0;

    return (
      <View
        style={[
          { width: '100%', height: '100%' },
          isLeft
            ? {
                paddingLeft: 8
              }
            : {
                paddingRight: 8
              }
        ]}
      >
        <CellCard
          key={data.card?.id}
          data={data}
          index={index}
          {...extendedState}
        ></CellCard>
      </View>
    );
  }
}

function defaultGetLayoutProvider(listData?: WaterFallCardData[]) {
  return LayoutUtil.getLayoutProvider(
    EWaterFallType.FULLSCREEN_TWO_COLUMNS,
    listData || []
  );
}
