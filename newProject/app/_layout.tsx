import { useFonts } from 'expo-font';
import { SplashScreen, useNavigation, usePathname } from 'expo-router';
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Appearance, TouchableHighlight, View } from 'react-native';
import { AppState, Keyboard, LogBox, Platform } from 'react-native';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Easing, opacity } from 'react-native-reanimated';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import { passportClient } from '@/src/api';
import { UpdateCreditTaskGot } from '@/src/api/message/credit';
import { Socket, WebsocketCloseCode } from '@/src/api/websocket';
import { ConfirmGlobal, showLoading } from '@/src/components';
import { GuideModalGlobal } from '@/src/components/guideModal';
import { UpgradeModal } from '@/src/components/modal/upgradeModal';
import { PreviewImageGlobal } from '@/src/components/previewImageModal';
import { MessageGlobal } from '@/src/components/v2/message';
import { log, wslog } from '@/src/logs/config';
import { useAppStore } from '@/src/store/app';
import { useBehaviorStore } from '@/src/store/behavior';
import { useBrandStore } from '@/src/store/brand';
import { useConfigStore } from '@/src/store/config';
import { useControlStore } from '@/src/store/control';
import { useCreditStore } from '@/src/store/credit';
import { useMessageStore } from '@/src/store/message';
import { useSearchStore } from '@/src/store/search';
import { useStorageStore } from '@/src/store/storage';
import { $Z_INDEXES } from '@/src/theme/variable';
import { catchErrorLog } from '@/src/utils/error-log';
import { isCrossDay } from '@/src/utils/transDate';
import {
  LoadingGlobal,
  SheetProvider,
  ToastGlobal,
  WebviewGlobal
} from '@Components/index';
import { LoginGlobal } from '@Components/login';
import { ModalGlobal } from '@Components/modal';
import { ShareModalGlobal } from '@Components/share';
import { SplashContent } from '@Components/splashContent';
import { showToast } from '@Components/toast';
import {
  reportExpo,
  reportPage,
  sendBizEvent,
  setGlobalParams,
  setPageName
} from '@Utils/report';
import ToastInner from './credit/toast';
import Detail from './detail/[id]';
import EmojiCreate from './emoji/create';
import EmojiPreview from './emoji/preview';
import EmojiRecreate from './emoji/recreate/[id]';
import IpDetailScreen from './ip/[brandId]';
import ParallelWord from './parallel-world/[id]';
import ParallelWorldCenter from './parallel-world/center';
import ParallelWordConsumer from './parallel-world/consumer';
import ParallelWordFeed from './parallel-world/feed';
import SearchPrefer from './search/prefer';
import SearchResult from './search/result';
import AboutScreen from './setting/about';
import Account from './setting/account';
import Topic from './topic/[type]/[id]';
import User from './user/[id]';
import { RewardTaskType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import { PortalProvider } from '@gorhom/portal';
import { useIsFocused, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  TransitionSpecs
} from '@react-navigation/stack';
import { extraData, getChannel } from '@step.ai/app-info-module';
import Getui from '@step.ai/getui-push-module';
import { logWarn } from '@step.ai/logging-module';
// import Getui from '@step.ai/getui-push-module';
import { useShallow } from 'zustand/react/shallow';
import AvatarEdit from './avatar-edit';
import Credit from './credit';
import EmptyPage from './empty-page';
import UpdatePage from './fallback';
import Feed from './feed';
import FollowFan from './follow-fan';
import MakePhoto from './make-photo';
import Message from './message';
import Name from './name';
import Publish from './publish';
import { RA_SearchEaseOption, RA_SearchIndexOption } from './router-anime';
import Search from './search';
import Setting from './setting';
import Webview from './webview';
import WishCard from './wishcard';

export { ErrorBoundary } from '@/src/components/error/ErrorBoundary';

if (__DEV__) {
  LogBox.ignoreLogs(['Failed prop type: Invalid prop `externalScrollView`']);
}

const Stack = createSharedElementStackNavigator();
SplashScreen.preventAutoHideAsync();
Appearance.setColorScheme('light');

async function reportPageGlobal(pathName: string) {
  setPageName(pathName);
  setTimeout(() => {
    // setGlobalParams(keys)
    sendBizEvent('predefine_pageview', {
      page_name: pathName,
      channel: getChannel(),
      channelExtraData: JSON.stringify(extraData)
    });
    reportExpo('auto'); // 自动上报的点
  });
}

function syncGetui() {
  return Getui.getAuthorizationStatus()
    .then((status: number) => {
      if (status === 2) {
        Getui.requestAuthorization();
      }
      reportExpo('status', { module: 'push', status });
    })
    .catch(e => {
      catchErrorLog('getui_getauth_fail', e);
      reportExpo('status', { module: 'push', status: -1 });
      return Promise.reject(e);
    });
}
function RootLayoutNav() {
  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );
  const appState = useRef(AppState.currentState);

  // const { init: taskInit } = useTaskStore.getState();
  const { init: configInit } = useConfigStore.getState();
  const { init: messageInit } = useMessageStore.getState();
  const [fontsLoaded, fontError] = useFonts({
    LipuFeed: require('@Assets/font/LipuFeed.ttf'),
    LipuIP: require('@Assets/font/LipuIP.ttf'),
    LipuWishCard: require('@Assets/font/LipuWishCard.ttf'),
    LipuWorld: require('@Assets/font/LipuWorld.ttf'),
    AlibabaPuHuiTiMedium: require('@Assets/font/AlibabaPuHuiTi-65.ttf'),
    AlibabaPuHuiTiBold: require('@Assets/font/AlibabaPuHuiTi-85.ttf'),
    AlibabaPuHuiTiHeavy: require('@Assets/font/AlibabaPuHuiTi-105.ttf'),
    SourceHanSerifBold: require('@Assets/font/SourceHanSerifCN-Bold.otf')
  });
  const [loading, setLoading] = useState(true);
  const searchParams = useGlobalSearchParams();

  // const fontLoadRef = useRef(false);
  // const timerRef = useRef<NodeJS.Timeout>();
  const { layoutReady, agreePolicy } = useAppStore(
    useShallow(state => ({
      layoutReady: state.layoutReady,
      agreePolicy: state.agreePolicy
    }))
  );
  const navigation = useNavigation();
  const pathName = usePathname();

  useEffect(() => {
    setGlobalParams(searchParams);
    reportPageGlobal(pathName);
    // sendBizEvent('app_active', {
    //   ...searchParams,
    //   page_name: pathName
    // });
  }, [pathName]);

  const store = useStorageStore();
  const __setStorage = store.__setStorage;

  const invokeTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!agreePolicy) {
      // 先触发一个网络请求
      try {
        fetch('https://mediafile.lipuhome.com/wt1.png');
      } catch (e) {}
    }

    syncGetui(); // 请求个推权限

    // app唤起时强制同步数据
    const handleChange = async (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setGlobalParams(searchParams);
        sendBizEvent('app_active', {
          ...searchParams,
          page_name: pathName
        });

        if (user) {
          initUserData();
        }
        syncGetui();
        useAppStore.getState().checkUpdate(); // 检查更新
      }

      if (nextAppState === 'inactive') {
        useBehaviorStore.getState().cache();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener('change', handleChange);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (agreePolicy) {
      setTimeout(() => {
        useAppStore.getState().setLayoutReady(true);
      });
    } else {
      Keyboard.dismiss();
    }
  }, [agreePolicy]);

  useEffect(() => {
    if (layoutReady) {
      createSocket();
      useBehaviorStore.getState().init();
      useMessageStore.getState().init();
    }
  }, [layoutReady]);

  useEffect(() => {
    // if (fontLoadRef.current) {
    //   return;
    // }
    if (fontError) console.log('font 加载失败！！');
    if (fontsLoaded) console.log('font 加载成功');
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      setLoading(false);
      // useAppStore.getState().setLayoutReady(true);
      // fontLoadRef.current = true;
    }
  }, [fontsLoaded, fontError]);

  const { localPoints, localRewardToast, triggerType } = useCreditStore(
    useShallow(state => ({
      localPoints: state.localPoints,
      localRewardToast: state.localRewardToast,
      triggerType: state.triggerType
    }))
  );

  useEffect(() => {
    // 积分获得
    if (localPoints && triggerType === RewardTaskType.SHARE) {
      showToast(
        <ToastInner
          localPoints={localPoints}
          localRewardToast={localRewardToast}
        ></ToastInner>,
        Math.pow(10, 10),
        true
      );
      useCreditStore.getState().updateCreditTriggerType(RewardTaskType.UNKNOWN);
      useCreditStore.getState().resetRewardToast();
    }
  }, [localPoints, triggerType]);

  // todo 有点不太自然 要改
  if (!layoutReady) {
    return (
      <PortalProvider>
        <SplashContent />
      </PortalProvider>
    );
  }

  if (loading) return;

  return (
    // <NavigationContainer>
    // <GestureHandlerRootView style={{ flex: 1 }}>
    <PortalProvider>
      {/* todo review下销毁状态 */}
      <ToastGlobal />
      <MessageGlobal />
      <LoginGlobal />
      <WebviewGlobal />
      <ModalGlobal />
      <LoadingGlobal />
      <ConfirmGlobal />
      <PreviewImageGlobal />
      <ShareModalGlobal />
      {/* <RouterChange /> */}
      <UpgradeModal />
      <GuideModalGlobal />
      <SheetProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
          initialRouteName="feed/index"
        >
          <Stack.Screen
            options={{
              animationEnabled: false // 解决首屏偶尔遮罩的问题?但本地未复现
            }}
            name="feed/index"
            component={Feed}
          />
          <Stack.Screen
            name="detail/[id]"
            // @ts-ignore
            getId={({ params }) => params?.id ?? ''}
            component={Detail}
            // todo 暂时去掉动效
            // sharedElements={(route, otherRoute, showing) => {
            //   const { cardId } = route.params;
            //   return [
            //     {
            //       id: `item.${cardId}.photo`,
            //       animation: 'move'
            //     }
            //   ];
            // }}
          />
          <Stack.Screen
            name="parallel-world/[id]"
            // @ts-ignore
            getId={({ params }) => params?.id ?? ''}
            component={ParallelWord}
            sharedElements={(route, otherRoute, showing) => {
              const { cardId } = route.params;
              return [
                {
                  id: `item.${cardId}.photo`,
                  animation: 'move'
                }
              ];
            }}
          />
          <Stack.Screen
            name="parallel-world/feed"
            component={ParallelWordFeed}
          />
          <Stack.Screen
            name="parallel-world/consumer"
            component={ParallelWordConsumer}
          />
          <Stack.Screen name="setting/index" component={Setting} />
          <Stack.Screen
            name="user/[id]"
            // @ts-ignore
            getId={({ params }) => params?.id ?? ''}
            component={User}
          />
          <Stack.Screen name="make-photo/index" component={MakePhoto} />
          <Stack.Screen name="message/index" component={Message} />
          <Stack.Screen name="name/index" component={Name} />
          <Stack.Screen name="empty-page/index" component={EmptyPage} />
          <Stack.Screen name="setting/account" component={Account} />
          <Stack.Screen name="setting/about" component={AboutScreen} />
          <Stack.Screen name="webview" component={Webview} />
          <Stack.Screen
            name="follow-fan/index"
            component={FollowFan}
            getId={res => {
              // @ts-ignore Navigator TS FIX Later
              return res.params?.uid || '';
            }}
          />
          <Stack.Screen
            name="ip/[brandId]"
            getId={res => {
              // @ts-ignore Navigator TS FIX Later
              return res.params?.brandId || '';
            }}
            component={IpDetailScreen}
          />
          <Stack.Screen
            name="search/index"
            component={Search}
            options={RA_SearchIndexOption}
          />
          <Stack.Screen
            name="search/result"
            component={SearchResult}
            options={RA_SearchEaseOption}
          />
          <Stack.Screen
            name="search/prefer"
            component={SearchPrefer}
            options={RA_SearchIndexOption}
          />
          <Stack.Screen name="avatar-edit/index" component={AvatarEdit} />
          {/* <Stack.Screen name="make-photo/index" component={MakePhoto} /> */}
          <Stack.Screen name="publish/index" component={Publish} />
          <Stack.Screen name="wishcard/index" component={WishCard} />
          {/* <Stack.Screen name="emoji/[id]" component={Emoji} /> */}
          <Stack.Screen name="emoji/recreate/[id]" component={EmojiRecreate} />
          <Stack.Screen name="emoji/create" component={EmojiCreate} />
          <Stack.Screen name="emoji/preview" component={EmojiPreview} />
          <Stack.Screen name="credit/index" component={Credit} />
          <Stack.Screen
            name="parallel-world/center"
            component={ParallelWorldCenter}
          />
          <Stack.Screen name="topic/[type]/[id]" component={Topic} />
          <Stack.Screen name="[...404]" component={UpdatePage} />
        </Stack.Navigator>
      </SheetProvider>
    </PortalProvider>
    // </GestureHandlerRootView>
    // </NavigationContainer>
  );

  function resetRoute() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'feed/index', params: { cardId: '1' } }]
      })
    );
  }

  function createSocket() {
    const socket = new Socket();
    // socket.clearConnection();
    // socket.create();

    let lastLoginStatus = 0;

    // 首次连接成功
    Socket.events.on(
      'connected',
      async ({ logined }) => {
        console.log('---------------首次连接成功-----------');
        useAppStore.getState().checkUpdate(); // 检查更新
        useConfigStore.getState().init(); // 初始化角色信息
        useBrandStore.getState().syncBrandInfos(); // 初始化ip信息
        useControlStore.getState().init(); // 提审开关配置

        // 登录获取积分
        useCreditStore.getState().init();

        // 搜索获得 & 重连 todo 统一走配置接口
        useSearchStore.getState().initTexts();
        useSearchStore.getState().initHotRanks();
        useSearchStore.getState().initSearchTags();

        UpdateCreditTaskGot(({ rewardToast, points, taskType }) => {
          if (points) {
            useCreditStore
              .getState()
              .updateCreditToast(rewardToast || '', points);

            if (taskType !== RewardTaskType.SHARE) {
              // 非分享直接 toast
              showToast(
                <ToastInner
                  localPoints={points}
                  localRewardToast={rewardToast}
                ></ToastInner>,
                3000,
                true
              );
              useCreditStore.getState().resetRewardToast();
              useCreditStore.getState().updateCreditTriggerType(taskType!);
            }
          }
        }, undefined);

        if (logined) {
          useAppStore.getState().syncUser();

          // 获取积分总量
          useCreditStore.getState().syncCredits();

          __setStorage({
            lastAppInvokeTime: Date.now()
          });

          invokeTimer.current = setInterval(() => {
            const isCross = !isCrossDay(store.lastAppInvokeTime, Date.now());
            const cHour = new Date(Date.now()).getHours();
            const cMinute = new Date(Date.now()).getMinutes();
            const cSecond = new Date(Date.now()).getSeconds();
            if (isCross && cHour === 0 && cMinute === 0 && cSecond === 30) {
              clearInterval(invokeTimer.current);
              invokeTimer.current = undefined;
              __setStorage({
                lastAppInvokeTime: Date.now()
              });
              useCreditStore.getState().checkAlreadyLoginCredit();
            }
          }, 30 * 1000);
        }

        syncGetui(); // 请求个推权限
      },
      true
    );

    // 每次重连后发的请求
    Socket.events.on('connected', ({ logined }) => {
      if (lastLoginStatus !== logined && logined) {
        initUserData(); // 更新消息数
      }
      if (!logined) {
        // 没登录
        useMessageStore.getState().reset();
      }
      lastLoginStatus = logined;
    });

    // 异常断开
    Socket.events.on('close', e => {
      if (e instanceof Uint8Array) {
        // 错误不可解
        showToast('网络失败，请退出重试~');
        resetRoute();
        return;
      }

      if (e.code === WebsocketCloseCode.CloseCodeKickOut) {
        showToast('当前用户已下线，请重新登录');
        resetRoute();
        return;
      }
      if (e.code === WebsocketCloseCode.CloseCodeUserForbidden) {
        showToast('当前用户已被封禁');
        resetRoute();
        return;
      }
    });
  }

  // 鉴权后要发的请求
  function initUserData() {
    useMessageStore.getState().updateUnread();
    useMessageStore.getState().getuiInitService();
    useAppStore.getState().syncUser();
    useControlStore.getState().init();
  }
}

export default function RootLayout() {
  return (
    <>
      <RootLayoutNav />
    </>
  );
}
