import { useMemoizedFn } from 'ahooks';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { feedClient } from '@/src/api';
import { searchClient } from '@/src/api/search';
import { hideLoading, showLoading, showToast } from '@/src/components';
import { EmptyWrapper } from '@/src/components/Empty';
import { RequestScene } from '@/src/components/infiniteList/typing';
import { WaterFall2 } from '@/src/components/waterfall/WaterFall2';
import {
  FetchMethodPayloadType,
  useRequestFeed
} from '@/src/components/waterfall/useRequsetFeed';
import { usePersistFn, useSafeBottomArea, useScreenSize } from '@/src/hooks';
import { $SEARCH_COLORS, $flex, $flexCenter } from '@/src/theme/variable';
import { GameType, ListResponse } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { reportExpo } from '@/src/utils/report';
import { RecSceneName, SearchFeatureName } from '../feed/type';
import {
  ECellCardReportType,
  EWaterFallTabReportType,
  EWaterFallTabType
} from '../feed/waterfall/type';

interface ISearchWaterFallProps {
  isCurrentTab: boolean;
  feature: GameType;
  keywords: string;
}

export default function SearchWaterFall({
  isCurrentTab,
  feature,
  keywords
}: ISearchWaterFallProps) {
  const scrollStickyTop = useSharedValue(0);
  const emptyOpacity = useSharedValue(1);

  const [isSticky, setIsSticky] = useState(false);

  const { appendId, ...searchParams } = useLocalSearchParams();

  useEffect(() => {
    if (isSticky) {
      scrollStickyTop.value = withTiming(-214, {
        duration: 300
      });
      emptyOpacity.value = withTiming(0, {
        duration: 300
      });
    } else {
      scrollStickyTop.value = withTiming(0, {
        duration: 300
      });
      emptyOpacity.value = withTiming(1, {
        duration: 300
      });
    }
  }, [isSticky]);

  const $emptyOpacityStyle = useAnimatedStyle(() => ({
    opacity: emptyOpacity.value
  }));

  const $safePaddingBottom = useSafeBottomArea();

  const onSearchScrollWaterfall = usePersistFn(
    ({ offsetY }: { offsetY: number }) => {
      if (offsetY > 30) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  );

  const $scrollStickyTopStyle = useAnimatedStyle(() => ({
    marginTop: scrollStickyTop.value
  }));

  const [firstDataStatus, setFirstDataStatus] = useState(true);

  const fetchSearchFeedMethod = async (
    payload: FetchMethodPayloadType
  ): Promise<ListResponse> => {
    if (payload.scene === RequestScene.INIT) {
      showLoading();
    }

    const isAll = feature + '' === GameType.UNKNOWN + '';
    const reqParams = {
      searchSceneName: RecSceneName.SEARCH,
      features: isAll
        ? undefined
        : {
            [SearchFeatureName.GAME_TYPE + '']: feature + ''
          },
      pagination: payload.pagination,
      keyword: keywords
    };

    try {
      const res = await searchClient.search(reqParams);
      const packRes = {
        cards: res?.result?.map((r: any) => {
          return r.item.value;
        }),
        pagination: res?.pagination
      };

      if (payload.scene === RequestScene.INIT) {
        reportExpo('result', {
          status: res?.result?.length > 0 ? '1' : '0',
          type: ECellCardReportType[feature],
          words: keywords
        });
        hideLoading();
        setFirstDataStatus(res?.result?.length > 0);
      }

      return new Promise((resolve, reject) => {
        try {
          resolve(packRes as ListResponse);
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      logWarn('[search error]', error);
      hideLoading();
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  };

  const {
    sourceData: searchData,
    loading: searchDataLoading,
    error: searchError,
    hasMore: searchHasMore,
    fetchList: fetchSearchList
  } = useRequestFeed({
    defaultFetch: false,
    fetchMethod: fetchSearchFeedMethod,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  useEffect(() => {
    if (keywords) {
      fetchSearchList(RequestScene.INIT);
    }
  }, [keywords, isCurrentTab]);

  useEffect(() => {
    fetchRecommendList(RequestScene.INIT);
  }, []);

  const fetchRecommendMethod = async (payload: FetchMethodPayloadType) => {
    const res = await feedClient.allCards({
      useHitBack: false,
      recSceneName: RecSceneName.SEARCH_RECOMMEND,
      reserved: searchParams as { [key in string]: string },
      pagination: payload.pagination
    });
    return res;
  };

  const {
    sourceData: recommendData,
    loading: recommendDataLoading,
    error: recommendError,
    hasMore: recommendHasMore,
    fetchList: fetchRecommendList,
    unshiftData: unshiftRecommendData
  } = useRequestFeed({
    fetchMethod: fetchRecommendMethod,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const onWaterfallScroll = (offset: any) => {};

  return (
    <View style={[$flex]}>
      <WaterFall2
        data={searchData}
        loading={searchDataLoading}
        renderLoading={() => {
          return <View></View>;
        }}
        onScroll={onWaterfallScroll}
        error={searchError}
        hasMore={searchHasMore}
        onRequest={fetchSearchList}
        footerStyle={{ paddingBottom: $safePaddingBottom }}
        enablePullRefresh={false}
        scrollViewProps={{
          bounces: firstDataStatus,
          style: {
            backgroundColor: $SEARCH_COLORS.searchBg,
            paddingTop: 8,
            ...(!firstDataStatus && { maxHeight: 214, pointerEvents: 'none' })
          }
        }}
        renderEmpty={() => {
          return (
            <Animated.View style={[{ height: 172 }, $emptyOpacityStyle]}>
              <EmptyWrapper
                isEmpty={true}
                emptyText={'暂无搜索结果，为您推荐热门内容'}
              >
                <View></View>
              </EmptyWrapper>
            </Animated.View>
          );
        }}
        renderFooter={() => {
          return (
            <>
              {firstDataStatus && !searchDataLoading ? (
                <View
                  style={[
                    {
                      alignItems: 'center',
                      marginTop: 12,
                      paddingBottom: $safePaddingBottom
                    }
                  ]}
                >
                  <Text style={{ color: $SEARCH_COLORS.black_40 }}>
                    无更多结果啦~
                  </Text>
                </View>
              ) : (
                <></>
              )}
            </>
          );
        }}
        isActive={isCurrentTab}
        reportParams={{
          from: 'search_scene',
          words: keywords
        }}
      ></WaterFall2>
      {!firstDataStatus && (
        <Animated.View
          key={'SEARCH_RECOMMEND'}
          style={[
            {
              flex: 1
            },
            $scrollStickyTopStyle
          ]}
        >
          <WaterFall2
            onScroll={onSearchScrollWaterfall}
            data={recommendData}
            loading={recommendDataLoading}
            error={recommendError}
            hasMore={recommendHasMore}
            onRequest={fetchRecommendList}
            footerStyle={{ paddingBottom: $safePaddingBottom }}
            enablePullRefresh={false}
            isActive={isCurrentTab}
            scrollViewProps={{
              style: {
                backgroundColor: $SEARCH_COLORS.searchBg
              }
            }}
            extendedState={{
              reportParams: {
                tab: EWaterFallTabReportType[EWaterFallTabType.RECOMMEND]
              }
            }}
            reportParams={{
              from: 'search_scene',
              recommend: '1'
            }}
            renderFooter={() => {
              return (
                <>
                  {firstDataStatus && !recommendDataLoading ? (
                    <View
                      style={[
                        {
                          alignItems: 'center',
                          marginTop: 12,
                          paddingBottom: $safePaddingBottom
                        }
                      ]}
                    >
                      <Text style={{ color: $SEARCH_COLORS.black_40 }}>
                        无更多结果啦~
                      </Text>
                    </View>
                  ) : (
                    <></>
                  )}
                </>
              );
            }}
          ></WaterFall2>
        </Animated.View>
      )}
    </View>
  );
}
