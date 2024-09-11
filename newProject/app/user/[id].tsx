// 个人中心
import { useMemoizedFn } from 'ahooks';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import LottieView, { AnimatedLottieViewProps } from 'lottie-react-native';
import {
  Component,
  LegacyRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ImageStyle,
  Pressable,
  TextStyle,
  TouchableOpacity,
  View
} from 'react-native';
import PagerView from 'react-native-pager-view';
import Animated, {
  AnimateProps,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { feedClient } from '@/src/api';
import {
  FullScreen,
  Icon,
  Tabs,
  Text,
  showImageConfirm,
  showToast
} from '@/src/components';
import { CREDIT_LIMIT } from '@/src/components/credit-cas';
import { Follow } from '@/src/components/follow';
import { FollowBtnTheme } from '@/src/components/follow/type';
import { RequestScene } from '@/src/components/infiniteList/typing';
import { WaterFall2 } from '@/src/components/waterfall/WaterFall2';
import {
  FetchMethodPayloadType,
  useRequestFeed
} from '@/src/components/waterfall/useRequsetFeed';
import { useWaterfallGesture } from '@/src/components/waterfall/useWaterfallGesture';
import { useScreenSize } from '@/src/hooks';
import {
  useSafeAreaInsetsStyle,
  useSafeBottomArea
} from '@/src/hooks/useSafeAreaInsetsStyle';
import { useAppStore } from '@/src/store/app';
import { useBrandStore } from '@/src/store/brand';
import { SwitchName, useControlStore } from '@/src/store/control';
import { useCreditStore } from '@/src/store/credit';
import { useDetailStore } from '@/src/store/detail';
import { useUserInfoStore } from '@/src/store/userInfo';
import { typography } from '@/src/theme';
import { $Z_INDEXES } from '@/src/theme/variable';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { stirngRemoveEnter } from '@/src/utils/replace';
import { reportClick, reportDiy, reportExpo } from '@/src/utils/report';
// import { pickAndUpload } from '@/src/utils/imagePicker';
import { Image } from '@Components/image';
import { FeedbackSheet } from '@Components/user/feedback';
import { StyleSheet } from '@Utils/StyleSheet';
import { dp2px } from '@Utils/dp2px';
import { useShallow } from 'zustand/react/shallow';

const HEAD_BG = require('@Assets/user/head_bg.png');
const HEAD_LOGO = require('@Assets/user/head_logo.png');
const MOCK_IMG = require('@Assets/mock/img1.jpg');
const LIKE_COVER = require('@Assets/user/userLike.png');
const SAME_COVER = require('@Assets/user/userProduct.png');

const STICY_TIME = 500;

const RED_LIGHT = require('@Assets/lottie/redlight.json');
const GREEN_LIGHT = require('@Assets/lottie/greenlight.json');

const TRANSLATE_DISTANCE = 215;

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export default function UserScreen() {
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const [currentTab, setCurrentTab] = useState('works');
  const id = useLocalSearchParams().id as string;
  const pagerRef = useRef<PagerView>(null);
  const { width } = useScreenSize();
  const [nickWidth, setNickWidth] = useState(0);
  const [tabPositionY, setTabPositionY] = useState(0);

  const navigation = useNavigation();

  const lightRef = useRef<LottieView>(null);

  // console.log(1234, navigation.getId());
  const { user } = useAppStore(
    useShallow(state => ({
      user: state.user
    }))
  );
  const { profile, stat, syncUserInfo, updateStat } = useUserInfoStore(
    useShallow(state => {
      const userInfo = state.getUserInfo(id);
      return {
        profile: userInfo?.profile,
        stat: userInfo?.stat,
        syncUserInfo: state.syncUserInfo,
        updateStat: state.updateStat
      };
    })
  );

  const stickyStatus = useRef(false);
  const isSlideToTop = useRef(true);

  console.log(profile?.uid, user?.uid, 'uid');
  const isMine = profile?.uid === user?.uid;

  const currentUser = useMemo(() => {
    if (isMine) {
      return user;
    }
    return profile;
  }, [isMine, user, profile]);

  const {
    sourceData: userFeed,
    loading: userFeedLoading,
    error: userFeedError,
    hasMore: userFeedHasMore,
    fetchList: fetchUserFeedList
  } = useRequestFeed({
    defaultFetch: false,
    fetchMethod: fetchUserFeedkMethod,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const {
    sourceData: likeFeed,
    loading: likeFeedLoading,
    error: likeFeedError,
    hasMore: likeFeedHasMore,
    fetchList: fetchLikeFeedList
  } = useRequestFeed({
    defaultFetch: false,
    fetchMethod: fetchLikeFeedkMethod,
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const $safePaddingBottom = useSafeBottomArea();

  const currentUserName = stirngRemoveEnter(currentUser?.name);
  // todo 做uid判定，防止数据串了
  const nickWidthRef = useRef(0);
  const headScaleValue = useSharedValue(1);
  const headTransX = useSharedValue(0);
  const headTransY = useSharedValue(0);
  const numberScaleValue = useSharedValue(1);
  const transValue = useSharedValue(0);
  const nameTransX = useSharedValue(0);
  const nameTransY = useSharedValue(0);
  const nameScale = useSharedValue(1);
  const nickNamefontSize = useSharedValue(18);
  const nickNameLineHeight = useSharedValue(24);
  const $headerAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: headTransX.value
      },
      {
        translateY: headTransY.value
      },
      {
        scale: headScaleValue.value
      }
    ]
  }));
  const $nickNameFontStyle = useAnimatedStyle(
    () =>
      ({
        fontSize: nickNamefontSize.value,
        lineHeight: nickNameLineHeight.value,
        fontFamily: isSlideToTop.current
          ? typography.fonts.baba.heavy
          : typography.fonts.baba.medium
      }) as TextStyle
  );
  const $numberAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: numberScaleValue.value
      }
    ]
  }));
  const $transAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: transValue.value
      }
    ]
  }));
  const $nickNameAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: nameTransX.value
      },
      {
        translateY: nameTransY.value
      },
      {
        scale: nameScale.value
      }
    ],
    textAlign: nameTransX.value > 0 ? 'left' : 'center'
  }));

  const onReachThreshold = useMemoizedFn((bounce: boolean, cb: () => void) => {
    if (bounce) {
      headScaleValue.value = withTiming(1, { duration: STICY_TIME });
      numberScaleValue.value = withTiming(1, { duration: STICY_TIME });
      transValue.value = withTiming(0, { duration: STICY_TIME });
      headTransX.value = withTiming(0, { duration: STICY_TIME });
      headTransY.value = withTiming(0, { duration: STICY_TIME });
      nameTransX.value = withTiming(0, { duration: STICY_TIME });
      nameTransY.value = withTiming(0, { duration: STICY_TIME });
      nameScale.value = withTiming(1, { duration: STICY_TIME });
      nickNamefontSize.value = withTiming(18, { duration: STICY_TIME });
      nickNameLineHeight.value = withTiming(
        24,
        { duration: STICY_TIME },
        () => {
          runOnJS(cb)();
        }
      );
      stickyStatus.current = false;
      isSlideToTop.current = true;
    } else {
      headScaleValue.value = withTiming(0.36, { duration: STICY_TIME });
      numberScaleValue.value = withTiming(0, { duration: STICY_TIME });
      transValue.value = withTiming(-1 * TRANSLATE_DISTANCE, {
        duration: STICY_TIME
      });
      headTransX.value = withTiming(-width / 2 + 63, {
        duration: STICY_TIME
      });
      headTransY.value = withTiming(-dp2px(78), { duration: STICY_TIME });
      nameScale.value = withTiming(1 / 0.36, { duration: STICY_TIME });
      nameTransX.value = withTiming((nickWidth / 2 + 32) / 0.36, {
        duration: STICY_TIME
      });
      nameTransY.value = withTiming(-78, { duration: STICY_TIME });
      nickNamefontSize.value = withTiming(14, { duration: STICY_TIME });
      nickNameLineHeight.value = withTiming(
        22,
        { duration: STICY_TIME },
        () => {
          runOnJS(cb)();
        }
      );
      stickyStatus.current = true;
      isSlideToTop.current = false;
    }
  });

  const { onScroll: onScroll1, scrollViewProps: wfScrollProps1 } =
    useWaterfallGesture({
      onReachThreshold,
      active: currentTab === 'works'
    });
  const { onScroll: onScroll2, scrollViewProps: wfScrollProps2 } =
    useWaterfallGesture({
      onReachThreshold,
      active: currentTab === 'likes'
    });

  const [isFeedbackShow, setIsFeedbackShow] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    const unsubscribe = navigation.addListener('focus', () => {
      syncUserInfo(id); //同步信息
    });
    return unsubscribe; // 在组件卸载时取消订阅
  }, [navigation, id]);

  // 不能在组件卸载时清空，数据会丢
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     if (!isMine) {
  //       setTimeout(() => {
  //         // todo 要在动画执行完后reset，不要setTimeOut
  //         useProfileStore.getState().reset();
  //       }, 0);
  //     }
  //   });

  //   return unsubscribe; // 在组件卸载时取消订阅
  // }, [navigation]);

  // function onUpdate() {
  //   useAppStore
  //     .getState()
  //     .updateUser(new UserProfile({ name: nameRef.current }))
  //     .then(() => {
  //       showToast('更新成功~');
  //       router.back();
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       showToast('更新失败！');
  //     });
  // }

  const handleEditAvatar = () => {
    reportClick('button', {
      user_button: 2,
      identity_status: isMine ? '0' : '1'
    });
    if (isMine) {
      router.push('/avatar-edit/');
    } else {
      if (
        useControlStore.getState().checkIsOpen(SwitchName.ENABLE_USER_REPORT)
      ) {
        setIsFeedbackShow(true);
      }
    }
  };

  const { width: screenWidth, height: screenHeight } = useScreenSize('window');

  const onPressFollowAndFans = (defaultTab: string) => {
    reportClick('button', {
      user_button: defaultTab === 'follow' ? 4 : 5,
      identity_status: isMine ? '0' : '1'
    });
    router.push({
      pathname: '/follow-fan/',
      params: {
        defaultTab,
        uid: id || ''
      }
    });
  };

  useEffect(() => {
    fetchUserFeedList(RequestScene.INIT);
    fetchLikeFeedList(RequestScene.INIT);
  }, [id]);

  const toCreate = () => {
    router.push({
      pathname: '/make-photo/'
    });
  };

  const [touchOffsetX, setTouchOffsetX] = useState(screenWidth);
  const [isBack, setIsBack] = useState(false);

  useEffect(() => {
    isBack && router.back();
  }, [isBack]);

  const pageScroll = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      if (e.nativeEvent.position < 0 && touchOffsetX < 100) {
        setIsBack(true);
      }
    },
    [touchOffsetX]
  );

  const renderPageView = () => {
    return currentUser?.uid ? (
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, backgroundColor: '#F5F5F5' }}
        onPageSelected={e => {
          // setTab(e.nativeEvent.position);
          setCurrentTab(e.nativeEvent.position === 0 ? 'works' : 'likes');
        }}
        overdrag
        onTouchStart={e => {
          setTouchOffsetX(e.nativeEvent.pageX);
        }}
        onPageScroll={pageScroll}
      >
        <View
          style={{
            flex: 1,
            marginTop: 8,
            position: 'relative'
          }}
        >
          <WaterFall2
            key="works"
            data={userFeed}
            loading={userFeedLoading}
            error={userFeedError}
            hasMore={userFeedHasMore}
            onRequest={fetchUserFeedList}
            onScroll={onScroll1}
            customEmptyProps={{
              children: '小狸在等你的作品！'
            }}
            isActive={currentTab === 'works'}
            scrollViewProps={{
              ...wfScrollProps1,
              contentStyle: tabPositionY
                ? {
                    minHeight:
                      screenHeight -
                      tabPositionY -
                      dp2px(68) +
                      TRANSLATE_DISTANCE +
                      10
                  }
                : undefined
            }}
            footerStyle={{ paddingBottom: $safePaddingBottom }}
            customListProps={{
              canChangeSize: true
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 8
          }}
        >
          <WaterFall2
            key="likes"
            data={likeFeed}
            loading={likeFeedLoading}
            error={likeFeedError}
            hasMore={likeFeedHasMore}
            onRequest={fetchLikeFeedList}
            onScroll={onScroll2}
            customEmptyProps={{
              children: '快去赞点作品来！'
            }}
            isActive={currentTab === 'likes'}
            scrollViewProps={{
              ...wfScrollProps2,
              contentStyle: tabPositionY
                ? {
                    minHeight:
                      screenHeight -
                      tabPositionY -
                      dp2px(68) +
                      TRANSLATE_DISTANCE +
                      10
                  }
                : undefined
            }}
            footerStyle={{ paddingBottom: $safePaddingBottom }}
            customListProps={{
              canChangeSize: true
            }}
          />
        </View>
      </PagerView>
    ) : null;
  };

  useEffect(() => {
    setTimeout(() => {
      reportExpo('all', {
        identity_status: isMine ? '0' : '1'
      });
    });
  }, []);

  useEffect(() => {
    lightRef.current?.play();
    const timer = setInterval(() => {
      lightRef.current?.play();
    }, 10 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const [creditOpacity, setCreditOpacity] = useState(0);

  useEffect(() => {
    const getCredits = async () => {
      await useCreditStore.getState().syncCredits();
      setCreditOpacity(1);
    };
    getCredits();
  }, []);

  const { totalCredits } = useCreditStore(
    useShallow(state => ({
      totalCredits: state.totalCredits
    }))
  );

  const isMinus = totalCredits < CREDIT_LIMIT ? true : false;
  const lottieSource = isMinus ? RED_LIGHT : GREEN_LIGHT;

  return (
    <FullScreen style={{ backgroundColor: StyleSheet.currentColors.white }}>
      <View style={st.$head}>
        <Image source={HEAD_BG} style={{ width: '100%', height: '100%' }} />
        <Image source={HEAD_LOGO} style={st.$headLogo as ImageStyle}></Image>
      </View>
      <View
        style={[
          { marginTop: $containerInsets.paddingTop, zIndex: $Z_INDEXES.z100 },
          st.$headOpers
        ]}
      >
        <TouchableOpacity
          onPressIn={() => {
            reportClick('button', {
              user_button: 1,
              identity_status: isMine ? '0' : '1'
            });
            router.back();
          }}
        >
          <Icon icon="back" size={24}></Icon>
        </TouchableOpacity>
        {isMine ? (
          <View
            style={{
              flexDirection: 'row',
              position: 'relative'
            }}
          >
            <TouchableOpacity
              onPressIn={() => {
                reportDiy('credit', 'entrance_button-click');
                router.push('/credit/');
              }}
              style={{
                marginEnd: 16,
                opacity: creditOpacity
              }}
            >
              <Icon
                icon={isMinus ? 'credit_minus' : 'credit_plus'}
                size={24}
                style={{ opacity: 0 }}
              ></Icon>
              <View style={st.$creditLottie}>
                <AnimatedLottieView
                  source={lottieSource}
                  ref={
                    lightRef as LegacyRef<
                      Component<AnimateProps<AnimatedLottieViewProps>>
                    >
                  }
                  loop={false}
                ></AnimatedLottieView>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                reportClick('button', {
                  user_button: 0,
                  identity_status: isMine ? '0' : '1'
                });
                router.push('/setting/');
              }}
            >
              <Icon icon="setting"></Icon>
            </TouchableOpacity>
          </View>
        ) : (
          <Follow
            followed={!!stat?.followed}
            beingFollowed={!!stat?.beingFollowed}
            uid={profile?.uid}
            theme={FollowBtnTheme.SOLID_COLOR_MODE}
            onUnfollow={() => onUpdatefollow(false)}
            onFollow={() => onUpdatefollow(true)}
          />
        )}
      </View>
      <Animated.View
        style={[st.$userInfo, $headerAnimateStyle]}
        pointerEvents="box-none"
      >
        <View style={st.$avatar}>
          <View style={st.$avatarInner}></View>
          <TouchableOpacity onPress={handleEditAvatar} activeOpacity={0.6}>
            <Image
              source={
                formatTosUrl(currentUser?.avatar || '', { size: 'size4' }) || ''
              }
              style={{ width: '100%', height: '100%', borderRadius: 52 }}
            />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            {
              marginTop: 14
            },
            $nickNameAnimateStyle
          ]}
        >
          <Animated.Text
            style={[st.$nickname, $nickNameFontStyle]}
            ellipsizeMode="tail"
            numberOfLines={1}
            allowFontScaling={false}
            onLayout={e => {
              const { width } = e.nativeEvent.layout;
              setNickWidth(width);
            }}
          >
            {((currentUserName?.length || 0) > 13
              ? currentUserName.slice(0, 13) + '...'
              : currentUserName) || ''}
          </Animated.Text>
          <TouchableOpacity
            style={{ position: 'absolute', right: -20, bottom: dp2px(5) }}
            onPress={() => {
              reportClick('button', {
                user_button: 3,
                identity_status: isMine ? '0' : '1'
              });
              router.push('/name/');
            }}
          >
            {isMine && isSlideToTop.current ? (
              <Icon icon="edit" size={dp2px(12)}></Icon>
            ) : null}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={[st.$numsWrap, $numberAnimateStyle]}
        pointerEvents="box-none"
      >
        <Pressable onPress={() => onPressFollowAndFans('follow')}>
          <View style={st.$numItem}>
            <Text style={st.$num}>
              {stat?.followings.toLocaleString() || 0}
            </Text>
            <Text style={st.$label}>关注</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => onPressFollowAndFans('fans')}>
          <View style={st.$numItem}>
            <Text style={st.$num}>{stat?.fans.toLocaleString() || 0}</Text>
            <Text style={st.$label}>粉丝</Text>
          </View>
        </Pressable>
        <Pressable style={st.$numItem} onPress={showLikeModal}>
          <Text style={st.$num}>{stat?.beingLikeds.toLocaleString() || 0}</Text>
          <Text style={st.$label}>获赞</Text>
        </Pressable>
        <Pressable style={st.$numItem} onPress={showSameModal}>
          <Text style={st.$num}>
            {stat?.beingCopieds.toLocaleString() || 0}
          </Text>
          <Text style={st.$label}>声望</Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        onLayout={e => {
          const { y } = e.nativeEvent.layout;
          setTabPositionY(y);
        }}
        style={[
          {
            flex: 1,
            marginBottom: -1 * TRANSLATE_DISTANCE
          },
          $transAnimateStyle
        ]}
      >
        <>
          <Tabs
            style={[
              tabStyles.$tabStyle,
              {
                borderWidth: !isSlideToTop.current ? 0 : 0.5,
                borderTopLeftRadius: !isSlideToTop.current ? 15 : 0,
                borderTopRightRadius: !isSlideToTop.current ? 15 : 0
              }
            ]}
            itemStyle={tabStyles.$tabItemStyle}
            itemTextStyle={tabStyles.$tabItemTextStyle}
            activeTextStyle={tabStyles.$tabActiveStyle}
            onChange={type => {
              console.log('tab change------', type);
              // setCurrentTab(type);
              // @ts-ignore
              // setCurrentTab(e.nativeEvent.position === 0 ? 'works' : 'likes');

              reportClick('button', {
                user_button: type === 'likes' ? 9 : 8,
                identity_status: isMine ? '0' : '1'
              });
              pagerRef.current?.setPage(type === 'likes' ? 1 : 0);
            }}
            activeNode={
              <View style={tabStyles.$tabActiveBorder}>
                <View
                  style={{
                    backgroundColor: StyleSheet.currentColors.brand1,
                    width: 24,
                    height: 2,
                    borderRadius: 500
                  }}
                ></View>
              </View>
            }
            current={currentTab}
            items={[
              {
                key: 'works',
                label: '作品'
              },
              {
                key: 'likes',
                label: '赞过'
              }
            ]}
          ></Tabs>
          {renderPageView()}

          {currentUser?.uid && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                flex: 1
              }}
            >
              <FeedbackSheet
                isVisible={isFeedbackShow}
                userId={currentUser?.uid!}
                onClose={() => {
                  setIsFeedbackShow(false);
                }}
              />
            </View>
          )}
        </>
      </Animated.View>
    </FullScreen>
  );

  async function fetchLikeFeedkMethod(payload: FetchMethodPayloadType) {
    return feedClient.userLikesCards({
      uid: id,
      pagination: payload.pagination
    });
  }

  async function fetchUserFeedkMethod(payload: FetchMethodPayloadType) {
    return feedClient.userCreatedCards({
      uid: id,
      pagination: payload.pagination
    });
  }

  function showLikeModal() {
    reportClick('button', {
      user_button: 6,
      identity_status: isMine ? '0' : '1'
    });
    showImageConfirm({
      image: LIKE_COVER,
      title: currentUser?.name || '',
      content: `共获得${stat?.beingLikeds}个赞`,
      cancelText: '知道了'
    });
  }

  function showSameModal() {
    reportClick('button', {
      user_button: 7,
      identity_status: isMine ? '0' : '1'
    });
    showImageConfirm({
      image: SAME_COVER,
      title: currentUser?.name || '',
      content: `被拍同款x创建平行世界次数：${stat?.beingCopieds}`,
      cancelText: '知道了'
    });
  }

  function onUpdatefollow(followed: boolean) {
    reportClick('follow_button', { userId: id, followed });
    updateStat(id, {
      followed
    });
  }
}

const st = StyleSheet.create({
  $head: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 355
  },
  $headLogo: {
    position: 'absolute',
    right: 0,
    top: 150,
    width: 190,
    height: 220
  },
  $headOpers: {
    ...StyleSheet.rowStyle,
    justifyContent: 'space-between',
    minHeight: 58,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: 'center',
    position: 'relative'
  },
  $userInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    zIndex: $Z_INDEXES.z100
  },
  $avatar: {
    width: 100,
    height: 100,
    position: 'relative'
  },
  $avatarInner: {
    width: 104,
    height: 104,
    top: -2,
    left: -2,
    position: 'absolute',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 2,
    borderRadius: 52,
    zIndex: $Z_INDEXES.z0
  },
  $nickname: {
    color: '#000',
    position: 'relative',
    fontFamily: typography.fonts.baba.heavy
  },
  $numsWrap: {
    ...StyleSheet.rowStyle,
    marginTop: dp2px(22),
    justifyContent: 'center',
    gap: 56
  },
  $num: {
    color: '#222222',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: typography.fonts.baba.heavy
  },
  $label: {
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.3),
    fontSize: 13,
    fontWeight: '500'
  },
  $creditLottie: {
    width: 70,
    height: 70,
    position: 'absolute',
    pointerEvents: 'none',
    right: 0,
    bottom: 0,
    zIndex: $Z_INDEXES.zm1,
    transform: [
      {
        translateX: dp2px(24)
      },
      {
        translateY: dp2px(23)
      }
    ]
  }
});

const tabStyles = StyleSheet.create({
  $tabStyle: {
    ...StyleSheet.rowStyle,
    marginTop: dp2px(24),
    borderColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.08),
    height: 44,
    backgroundColor: 'white'
  },
  $tabItemStyle: {
    flex: 1
  },
  $tabItemTextStyle: {
    textAlign: 'center',
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 44
  },
  $tabActiveStyle: {
    color: '#222222'
  },
  $tabActiveBorder: {
    ...StyleSheet.rowStyle,
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: -13,
    justifyContent: 'center'
  }
});
