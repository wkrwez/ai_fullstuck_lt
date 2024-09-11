import { useMemoizedFn } from 'ahooks';
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams
} from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  AppState,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets
} from 'react-native-safe-area-context';
import { feedAFClient, feedClient } from '@/src/api';
import { Button, Image, Text } from '@/src/components';
import { showToast } from '@/src/components';
import { EmptyPlaceHolder } from '@/src/components/Empty';
import { RequestScene } from '@/src/components/infiniteList/typing';
import { showLogin } from '@/src/components/login';
import { PublishEntry } from '@/src/components/publishEntry';
import Notification from '@/src/components/v2/notification';
import useNotification from '@/src/components/v2/notification/hook';
import { WaterFall2 } from '@/src/components/waterfall/WaterFall2';
import { WaterFallCardData } from '@/src/components/waterfall/type';
import {
  FetchMethodPayloadType,
  useRequestFeed
} from '@/src/components/waterfall/useRequsetFeed';
import { useWaterfallGesture } from '@/src/components/waterfall/useWaterfallGesture';
import { TAB_FOOTER_ICON } from '@/src/constants';
import { usePersistFn, useSafeBottomArea, useScreenSize } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { useBrandStore } from '@/src/store/brand';
import { SwitchName, useControlStore } from '@/src/store/control';
import { EnotiType } from '@/src/store/storage';
import {
  $Z_INDEXES,
  $flex,
  $flexCenter,
  $flexRow,
  $relative
} from '@/src/theme/variable';
import { getGlobalParams, reportClick, reportExpo } from '@/src/utils/report';
import { Raccoon } from '@Components/raccoon';
import { logWarn } from '@Utils/error-log';
import ToastInner from '../credit/toast';
import { EWaterFallTabReportType, EWaterFallTabType } from './waterfall/type';
import { useIsFocused, useRoute } from '@react-navigation/native';
import * as APMModule from '@step.ai/apm-module';
import { useShallow } from 'zustand/react/shallow';
// import { IPType } from '@step.ai/proto-gen/raccoon/showcase/showcase_pb';
import Banner from './banner';
import Marquee from './marquee';
import SearchArea from './searcharea';
import { RecSceneName } from './type';

const BgIcon = require('@Assets/image/feed/bg.png');

// 传递给 marquee 的 index
const items = [
  {
    key: 'RECOMMEND',
    title: '发现'
  },
  {
    key: 'FOLLOW',
    title: '关注'
  }
];

const GAP = 8;
export default function Feed() {
  // 获取内边距
  const { appendId } = useLocalSearchParams();
  const searchParams = useGlobalSearchParams();
  const insets = useSafeAreaInsets();
  const layoutReady = useAppStore(state => state.layoutReady);
  const isFocused = useIsFocused();
  const user = useAppStore(state => state.user);
  const prevUserState = useRef(user);

  const route = useRoute();
  const appState = useRef(AppState.currentState);
  const updateTimeRef = useRef(0);
  // 推荐hitbackup的逻辑
  const hitBackUp = useRef(false);

  // 资源位显示index
  const [activeHolder, setActiveHolder] = useState(0);

  useEffect(() => {
    if (route.params) {
      if ((route.params as any)?.notificationVisible) {
        // 发布强通知
        setInitLock(false);
      }
    }
  }, [route]);

  // Fix 用户登录后应该刷新Feed 流
  useEffect(() => {
    // 从null变为user，触发一次滚动刷新
    if (user && prevUserState.current === null) {
      try {
        wf1.current?.scrollTo(0);
        wf2.current?.scrollTo(0);

        fetchRecommendList(RequestScene.INIT);
        fetchFollowingList(RequestScene.INIT);
      } catch (e) {
        logWarn('fetchList', e, 'RN.waterfall');
      }
    }
    prevUserState.current = user;
  }, [user]);

  useEffect(() => {
    if (!isFocused) return;
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (Date.now() - updateTimeRef.current > 300 * 1000) {
          showToast('小狸已为您推荐至最新粮仓~');
          wf1.current?.scrollTo(0);
          fetchRecommendList(RequestScene.INIT);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isFocused]);

  const windowWidth = useScreenSize('screen').width;
  const ipCardSize = (windowWidth - GAP * 5) / 4;

  useEffect(() => {
    if (appendId && wf1.current) {
      unshiftRecommendData(String(appendId), {
        onSuccess: () => {
          setTimeout(() => {
            wf1.current?.scrollTo(0);
          }, 100);
        }
      });
    }
  }, [appendId]);

  const [isSlideToTop, setIsSlideToTop] = useState(true);

  // marquee card [相关动画参数]
  const miniScale = useSharedValue(0);
  const animatedIndictor = useSharedValue(0);

  const pagerRef = useRef<PagerView>(null);
  // 选中 tab
  const [curTabIdx, setTab] = useState(0);

  const [firstReqFinished, setReqFinished] = useState(false);
  const onReachThreshold = useMemoizedFn((bounces: boolean, cb: () => void) => {
    miniScale.value = withTiming(bounces ? 0 : 1, { duration: 250 }, () => {
      runOnJS(cb)();
    });
    setIsSlideToTop(bounces);
  });

  const {
    onScroll: onScroll1,
    ref: wf1,
    scrollViewProps: wfScrollProps1
  } = useWaterfallGesture({
    onReachThreshold,
    active: curTabIdx === 0
  });
  const {
    onScroll: onScroll2,
    ref: wf2,
    scrollViewProps: wfScrollProps2
  } = useWaterfallGesture({
    onReachThreshold,
    active: curTabIdx === 1
  });

  const fetchRecommendMethod = useMemoizedFn(async function fetchRecommend(
    payload: FetchMethodPayloadType
  ) {
    // APMModule.beginLaunchT2();
    updateTimeRef.current = Date.now();

    const res = await feedClient.allCards({
      useHitBack: payload.scene === 'append' ? hitBackUp.current : false,
      recSceneName: RecSceneName.HOME_TAB,
      reserved: {
        prefer_ip:
          // @ts-ignore
          searchParams['invoke_ip'] || getGlobalParams()?.invoke_ip || ''
      },
      pagination: payload.pagination
    });
    hitBackUp.current = res.hitBackUp;
    return res;
  });

  const fetchfollowingMethod = useMemoizedFn(
    async (payload: FetchMethodPayloadType) => {
      if (user) {
        let res = await feedClient.followCards({
          pagination: payload.pagination
        });
        return res;
      }
      throw new Error('user_not_login');
    }
  );

  const {
    sourceData: recommendData,
    loading: recommendDataLoading,
    error: recommendError,
    hasMore: recommendHasMore,
    fetchList: fetchRecommendList,
    unshiftData: unshiftRecommendData
  } = useRequestFeed({
    fetchMethod: fetchRecommendMethod,
    onFirstDataRendered,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const {
    sourceData: followingData,
    loading: followingDataLoading,
    error: followingError,
    hasMore: followingHasMore,
    fetchList: fetchFollowingList
  } = useRequestFeed({
    fetchMethod: fetchfollowingMethod,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const $safePaddingBottom = useSafeBottomArea();

  useEffect(() => {
    useBrandStore.getState().syncBrandInfos();
  }, [isFocused]);

  useEffect(() => {
    if (firstReqFinished) {
      onFirstDataRendered(4);
    }
  }, [firstReqFinished]);

  const { brandInfos } = useBrandStore(
    useShallow(state => ({
      brandInfos: state.brandInfos,
      brandShow: state.brandShow
    }))
  );

  const brandShow = useControlStore(
    state => !state.checkIsOpen(SwitchName.DISABLE_IP_ICON)
  );

  const isNotBrandEmpty = useMemo(
    () => brandInfos.length && brandShow,
    [brandInfos, brandShow]
  );

  // 这里minScale.value的意思？0-1的数值？ TODO
  const $containerAnimateStyle = useAnimatedStyle(
    () => ({
      marginTop: isNotBrandEmpty
        ? (1 - miniScale.value) * (120 - 84 + ipCardSize) + 6
        : miniScale.value
    }),
    [isNotBrandEmpty]
  );

  /** 事关 marquee 的动画演变 */
  const scaleRatio = 30 / ipCardSize;
  const $marqueeAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 - (1 - scaleRatio) * miniScale.value
      },
      {
        translateY: 60 - 156 * miniScale.value
        // translateY: 60 - 156 * miniScale.value
      }
    ]
  }));

  const $bannerAnimateStyle = useAnimatedStyle(() => ({
    opacity: 1 - miniScale.value,
    transform: [
      {
        translateY: -120 * miniScale.value
      }
    ]
  }));

  /** app 进入 */
  const { notificationVisible, setNotificationVisible } = useNotification({
    expire: 3,
    signal: EnotiType.notiReachDatedByApp
  });

  const isExpand = useLocalSearchParams()?.expand;

  const onCloseNotification = usePersistFn(() => {
    setNotificationVisible(false);
  });

  /** 发布作品 */
  const {
    notificationVisible: notificationPublishVisible,
    setNotificationVisible: setNotificationPublishVisible,
    setInitLock
  } = useNotification({
    expire: 7,
    signal: EnotiType.notiReachDatedByPublish,
    lock: true
  });

  const onClosePublishNotification = () => {
    setInitLock(true);
    setNotificationPublishVisible(false);
  };

  const { hideSearchIcon } = useControlStore(
    useShallow(state => ({
      hideSearchIcon: state.checkIsOpen(SwitchName.DISABLE_SEARCH_ENREY)
    }))
  );

  return (
    // <GestureDetector gesture={pan} >
    <View style={[$flex, $relative]}>
      {/* <Toast text={'图片保存成功'}></Toast> */}
      <Image source={BgIcon} contentFit={'cover'} style={$bg}></Image>
      <SafeAreaView style={[$flex, $relative]} edges={['top']}>
        <View style={[$flex]}>
          <View style={[$search]}>
            <SearchArea></SearchArea>
            {isNotBrandEmpty ? (
              <Animated.View
                style={[
                  { height: 98, top: -30, zIndex: isSlideToTop ? -1 : 1 },
                  $marqueeAnimateStyle
                ]}
              >
                <View>
                  {layoutReady && (
                    <Marquee
                      onPress={miniScale => {
                        // disable back top
                      }}
                      size={ipCardSize}
                      autoPlay
                      duration={4000}
                      miniScale={!isSlideToTop}
                    />
                  )}
                </View>
              </Animated.View>
            ) : null}
          </View>
          <View style={[$flex, { zIndex: $Z_INDEXES.z10 }]}>
            <Animated.View style={[$flex, $containerAnimateStyle]}>
              <TabHeader
                // 更细致的
                animatedTabIndex={animatedIndictor}
                tabs={items}
                curTabIndex={curTabIdx}
                onPressTab={idx => {
                  pagerRef.current?.setPage(idx);
                }}
              />
              <PagerView
                onPageScroll={({ nativeEvent }) => {
                  if (nativeEvent.offset > 0) {
                    animatedIndictor.value = nativeEvent.offset;
                  }
                }}
                style={{ flex: 1 }}
                initialPage={0}
                ref={pagerRef}
                onPageSelected={e => {
                  setTab(e.nativeEvent.position);
                }}
              >
                <View key="1">
                  <WaterFall2
                    onScroll={onScroll1}
                    data={recommendData}
                    loading={recommendDataLoading}
                    error={recommendError}
                    hasMore={recommendHasMore}
                    onRequest={fetchRecommendList}
                    footerStyle={{ paddingBottom: $safePaddingBottom }}
                    scrollViewProps={wfScrollProps1}
                    isActive={curTabIdx === 0}
                    extendedState={{
                      reportParams: {
                        tab: EWaterFallTabReportType[
                          EWaterFallTabType.RECOMMEND
                        ]
                      },
                      emitHolderIndex: (
                        index: React.SetStateAction<number>
                      ) => {
                        setActiveHolder(index);
                      }
                    }}
                    onCardExposure={onResourceExposure}
                    customListProps={{
                      renderAheadOffset: 600
                    }}
                  ></WaterFall2>
                </View>
                <View key="2">
                  {user ? (
                    <WaterFall2
                      onScroll={onScroll2}
                      data={followingData}
                      loading={followingDataLoading}
                      error={followingError}
                      hasMore={followingHasMore}
                      onRequest={fetchFollowingList}
                      footerStyle={{ paddingBottom: $safePaddingBottom }}
                      scrollViewProps={wfScrollProps2}
                      customEmptyProps={{
                        children: '快去关注别人！小狸没有东西看啦~'
                      }}
                      isActive={curTabIdx === 1}
                      extendedState={{
                        reportParams: {
                          tab: EWaterFallTabReportType[EWaterFallTabType.FOLLOW]
                        }
                      }}
                      customListProps={{
                        renderAheadOffset: 600
                      }}
                    ></WaterFall2>
                  ) : (
                    <EmptyPlaceHolder
                      buttonText="立即登录"
                      button={true}
                      type="needlogin"
                      onButtonPress={showLogin}
                      style={{ height: 400, paddingBottom: $safePaddingBottom }}
                    >
                      登录账号，查看你关注的精彩内容
                    </EmptyPlaceHolder>
                  )}
                </View>
              </PagerView>
            </Animated.View>
          </View>
        </View>

        {hideSearchIcon ? (
          <View
            style={[$bannerWrapper, { top: insets.top - 16 }]}
            pointerEvents="none"
          >
            <Animated.View style={$bannerAnimateStyle}>
              <Banner />
            </Animated.View>
          </View>
        ) : (
          <></>
        )}

        <Raccoon
          style={[$raccoon, { top: insets.top - 4, left: -7 }]}
        ></Raccoon>
        <PublishEntry expandFlag={isExpand} />
      </SafeAreaView>
      <Notification
        visible={notificationVisible}
        onClose={onCloseNotification}
        slogan={'开启 App 通知，不错过精彩更新'}
        signal={EnotiType.notiReachDatedByApp}
      />
      <Notification
        visible={notificationPublishVisible}
        onClose={onClosePublishNotification}
        slogan={'开启 App 通知，才能及时收到其他人的评论噢'}
        signal={EnotiType.notiReachDatedByPublish}
      />
    </View>
    // </GestureDetector>
  );

  function onFirstDataRendered(step: number) {
    // 1开始请求 2请求成功 3请求结束 4渲染结束
    try {
      if (step === 1) {
        console.log(new Date().getTime(), 'APM LOG', step);
        return APMModule.beginLaunchT2();
      }
      if (step === 2) {
        console.log(new Date().getTime(), 'APM LOG', step);
        APMModule.endLaunchT2();
        APMModule.beginLaunchT3();
        return;
      }
      if (step === 3) {
        setReqFinished(true);
      }
      if (step === 4) {
        console.log(new Date().getTime(), 'APM LOG', step);
        APMModule.endLaunchT3();
      }
    } catch (e) {
      console.warn('LOG APM ERROR', e);
    }
  }

  function onResourceExposure(item: WaterFallCardData) {
    if (item?.card?.resourceInfo) {
      reportExpo('resource_expo', {
        resourceid: item.card?.id,
        picid: item.card?.resourceInfo?.resourceList[activeHolder]?.image?.url,
        pic_order: activeHolder + ''
      });

      try {
        feedAFClient.uploadHomepageOperation({
          homepageOperationId: item?.card?.id
        });
      } catch (error) {
        logWarn('uploadHomepageOperationError', error);
      }
    }
  }
}

type Tab = {
  title: string;
};

type TabHeaderProps = {
  curTabIndex: number;
  tabs: Tab[];
  animatedTabIndex?: SharedValue<number>;
  onPressTab: (tabIndex: number) => void;
};
const TabHeader = ({
  tabs,
  onPressTab,
  curTabIndex = 0,
  animatedTabIndex
}: TabHeaderProps) => {
  const $indicatorAnimateStyle = useAnimatedStyle(() => {
    let scaleX = 1;
    if (animatedTabIndex) {
      const overlap = animatedTabIndex.value % 1;
      const gap = overlap > 0.5 ? 1 - overlap : overlap;
      scaleX = gap + 1;
    }
    return {
      transform: [
        {
          translateX:
            (animatedTabIndex ? animatedTabIndex.value : curTabIndex) * 60 + 12
        },
        { scaleX }
      ]
    };
  });
  return (
    <View style={[$tabBar]}>
      <View
        style={{
          flexDirection: 'row'
        }}
      >
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={tab.title}
            hitSlop={12}
            onPress={() => {
              onPressTab(idx);
            }}
            style={$tab}
          >
            <Text
              numberOfLines={1}
              style={[
                $tabText,
                curTabIndex === idx ? $activeTabText : $inactiveTabText
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View style={[$indicator, $indicatorAnimateStyle]}>
          <Image
            transition={0}
            source={TAB_FOOTER_ICON}
            style={{ flex: 1 }}
          ></Image>
        </Animated.View>
      </View>
    </View>
  );
};

const $tabBar: ViewStyle = {
  ...$flexRow,
  ...$flexCenter,
  paddingHorizontal: 8,
  flexGrow: 0,
  height: 50
};

const $tab: ViewStyle = {
  ...$flexRow,
  ...$flexCenter,
  width: 40,
  marginLeft: 12,
  marginRight: 8
};

const $tabText: TextStyle = {
  fontSize: 16,
  textAlign: 'center'
};

const $activeTabText: TextStyle = {
  color: '#222',
  fontWeight: '600',
  textAlign: 'center'
};

const $inactiveTabText: TextStyle = {
  color: '#00000066',
  fontWeight: '500',
  textAlign: 'center'
};

const $indicator: TextStyle = {
  position: 'absolute',
  bottom: -24,
  left: -4,
  height: 33,
  width: 46,
  zIndex: $Z_INDEXES.zm1
};

const $bg: ImageStyle = {
  width: '100%',
  height: 271,
  position: 'absolute',
  top: 0,
  left: 0
};

const $search: ViewStyle = {
  zIndex: $Z_INDEXES.z100,
  height: 32,
  alignItems: 'center'
};

const $raccoon: ViewStyle = {
  position: 'absolute',
  width: 48,
  height: 62,
  left: 0,
  zIndex: 99
};

const $bannerWrapper: ViewStyle = {
  height: 60,
  left: 4,
  position: 'absolute'
};
