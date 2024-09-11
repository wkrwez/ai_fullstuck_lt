import { router, useNavigation } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View
} from 'react-native';
import Animated from 'react-native-reanimated';
import { FollowClient } from '@/src/api/follow';
import { Avatar } from '@/src/components/avatar';
import { Follow } from '@/src/components/follow';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { useUserInfoStore } from '@/src/store/userInfo';
import { dp2px } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { EmptyPlaceHolder } from '@Components/Empty';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { FriendInfo } from '@/proto-registry/src/web/raccoon/follow/follow_pb';
import { PartialMessage } from '@bufbuild/protobuf';

//先在这里测试，需要选择图片资源
const emptyAttent = require('@Assets/empty/attentList.png');
const emptyFan = require('@Assets/empty/userLike.png');

const PAGE_SIZE = 20;
export const FollowList = ({
  count,
  current,
  uid,
  isMine
}: {
  count: number;
  current: string;
  uid: string;
  isMine: boolean;
}) => {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const [total, setTotal] = useState(count);

  const [error, setError] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const nextPageToken = useRef<string | undefined>(undefined);
  const [list, setList] = useState<Array<FriendInfo>>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setTotal(count);
  }, [count]);

  const loadFollowings = async (isInit?: boolean) => {
    // 正在加载中
    if (isPulling) {
      return;
    }
    // 没有数据了
    if (nextPageToken.current === '') {
      return;
    }

    setIsPulling(true);
    try {
      const res = await FollowClient.queryFollowings({
        uid,
        size: PAGE_SIZE,
        nextPageToken: nextPageToken.current
      });
      console.log('请求关注列表response: ', res, uid, 'uid');

      nextPageToken.current = res.nextPageToken;
      if (isInit) {
        setList(res.followings);
      } else {
        setList([...list, ...res.followings]);
      }
    } catch (e) {
      console.log('请求关注列表错误: ', e);
      setError(e);
    } finally {
      setIsPulling(false);
    }
  };

  useEffect(() => {
    // loadFollowings(true);
  }, []);

  useEffect(() => {
    console.log(list);
  }, [list]);

  useEffect(() => {
    if (current === 'follow') {
      // setList([]);
      setError(null);
      setIsPulling(false);
      nextPageToken.current = undefined;
      loadFollowings(true);
    }
  }, [current, uid]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      nextPageToken.current = undefined;
      loadFollowings(true);
    });

    return unsubscribe; // 在组件卸载时取消订阅
  }, []);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const offsetY = contentOffset.y;
    const contentHeight = contentSize.height;
    const scrollHeight = layoutMeasurement.height;

    if (scrollHeight + offsetY > contentHeight - 200) {
      loadFollowings();
    }
  };

  // 没有数据并且还在加载，走一个大的loading
  if (!list.length && isPulling) {
    return BIG_LOADING;
  }

  // 请求出错了
  // TODO: 改成统一的狸狸出错
  if (error) {
    return LIST_ERROR;
  }

  if (list.length === 0) {
    return (
      <EmptyPlaceHolder style={{ marginTop: dp2px(-80) }} type="attentList">
        <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.4)' }}>
          让小狸看下你打算第一个关注谁！
        </Text>
      </EmptyPlaceHolder>
    );
  }

  const onUpdatefollow = (user: FriendInfo, isFollowed: boolean) => {
    const { uid } = user;
    reportClick('follow_button', {
      user_follow_button: isFollowed,
      identity_status: isMine ? '0' : '1'
    });
    const newList = [...list];
    const targetIndex = newList.findIndex(x => x.uid === uid);
    if (targetIndex !== -1) {
      newList[targetIndex] = {
        ...newList[targetIndex],
        isFollowed
        // @ts-ignore
        // cancelFollowed: true
      } as FriendInfo;
    }
    setList(newList);
  };

  // @ts-ignore
  // 去掉取消的个数
  const displayTotal = total - list.filter(x => x.cancelFollowed).length;

  return (
    <ScrollView
      onScroll={onScroll}
      style={followSt.container}
      contentContainerStyle={{
        height: 'auto',
        paddingBottom: Number($containerInsets.paddingBottom ?? 0)
      }}
      scrollEventThrottle={100}
      showsVerticalScrollIndicator={false}
    >
      <Text style={followSt.total}>关注 ({displayTotal})</Text>
      <View>
        {list.map((user: FriendInfo) => {
          // 关注列表，初始必然关注
          // 是否被关注取决于isFriend字段
          // 取消关注后会设置一个cancelFollowed字段，并消失
          console.log(`user data`, user);
          return (
            <UserItem
              onUnfollow={() => onUpdatefollow(user, false)}
              onFollow={() => onUpdatefollow(user, true)}
              followed={user.isFollowed}
              beingFollowed={user.isFan}
              key={user.uid}
              isMine={isMine}
              type={'follow'}
              {...user}
            />
          );
        })}
      </View>
      {isPulling ? SMALL_LOADING : null}
    </ScrollView>
  );
};

export const FansList = ({
  count,
  current,
  uid,
  isMine
}: {
  count: number;
  current: string;
  uid: string;
  isMine: boolean;
}) => {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const [total, setTotal] = useState(count);

  const [error, setError] = useState(null);
  const [isPulling, setIsPulling] = useState(false);
  const nextPageToken = useRef<string | undefined>(undefined);
  const [list, setList] = useState<Array<FriendInfo>>([]);
  const navigation = useNavigation();

  useEffect(() => {
    setTotal(count);
  }, [count]);

  const loadFans = async (isInit?: boolean) => {
    // 正在加载中
    if (isPulling) {
      return;
    }
    // 没有数据了
    if (nextPageToken.current === '') {
      return;
    }

    setIsPulling(true);
    try {
      const res = await FollowClient.queryFans({
        uid,
        size: PAGE_SIZE,
        nextPageToken: nextPageToken.current
      });
      console.log('请求粉丝列表response: ', res);

      nextPageToken.current = res.nextPageToken;
      if (isInit) {
        setList(res.fans);
      } else {
        setList([...list, ...res.fans]);
      }
    } catch (e) {
      console.log('请求粉丝列表错误: ', e);
      setError(e);
    } finally {
      setIsPulling(false);
    }
  };

  const onUpdatefollow = (user: FriendInfo, isFollowed: boolean) => {
    const { uid } = user;
    reportClick('fans_button', {
      user_follow_button: isFollowed,
      identity_status: isMine ? '0' : '1'
    });
    const newList = [...list];
    const targetIndex = newList.findIndex(x => x.uid === uid);
    if (targetIndex !== -1) {
      newList[targetIndex] = {
        ...newList[targetIndex],
        isFollowed
        // @ts-ignore
        // cancelFollowed: true
      } as FriendInfo;
    }
    setList(newList);
  };

  useEffect(() => {
    if (current === 'fans') {
      // setList([]);
      setError(null);
      setIsPulling(false);
      nextPageToken.current = undefined;
      loadFans(true);
    }
  }, [current]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      nextPageToken.current = undefined;
      loadFans(true);
    });

    return unsubscribe; // 在组件卸载时取消订阅
  }, []);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const offsetY = contentOffset.y;
    const contentHeight = contentSize.height;
    const scrollHeight = layoutMeasurement.height;

    if (scrollHeight + offsetY > contentHeight - 200) {
      loadFans();
    }
  };

  // 没有数据并且还在加载，走一个大的loading
  if (!list.length && isPulling) {
    return BIG_LOADING;
  }

  // 请求出错了
  // TODO: 改成统一的狸狸出错
  if (error) {
    return LIST_ERROR;
  }

  if (list.length === 0) {
    return (
      <EmptyPlaceHolder type="userLike" style={{ marginTop: dp2px(-80) }}>
        <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.4)' }}>
          快去搞点粉丝来！
        </Text>
      </EmptyPlaceHolder>
    );
  }

  return (
    <ScrollView
      onScroll={onScroll}
      style={followSt.container}
      contentContainerStyle={{
        height: 'auto',
        paddingBottom: Number($containerInsets.paddingBottom ?? 0)
      }}
      scrollEventThrottle={100}
    >
      <Text style={followSt.total}>粉丝 ({total})</Text>
      <View>
        {list.map((user: FriendInfo) => {
          // 粉丝列表，必然被关注
          // 是否回关取决于isFriend字段
          // 取消回关不消失
          return (
            <UserItem
              onUnfollow={() => onUpdatefollow(user, false)}
              onFollow={() => onUpdatefollow(user, true)}
              followed={user.isFollowed}
              beingFollowed={user.isFan}
              key={user.uid}
              isMine={isMine}
              type={'fans'}
              {...user}
            />
          );
        })}
      </View>
      {isPulling ? SMALL_LOADING : null}
    </ScrollView>
  );
};

const followSt = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flex: 1
  },
  total: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 20
  },
  loadingContainer: {
    width: '100%',
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export const UserItem = (
  props: PartialMessage<FriendInfo> & {
    followed: boolean;
    beingFollowed: boolean;
    onUnfollow?: Function;
    onFollow?: Function;
    cancelFollowed?: boolean;
    isMine: boolean;
    type: string;
  }
) => {
  const {
    uid,
    avatar,
    name,
    onFollow,
    onUnfollow,
    followed,
    beingFollowed,
    cancelFollowed,
    isMine,
    type
  } = props;

  // const heightValue = useSharedValue(54);
  // const opacityValue = useSharedValue(1);
  // const marginValue = useSharedValue(16);
  // const animatedStyles = useAnimatedStyle(() => ({
  //   height: heightValue.value,
  //   opacity: opacityValue.value,
  //   marginBottom: marginValue.value,
  // }));

  // useEffect(() => {
  //   if (cancelFollowed) {
  //     heightValue.value = withTiming(0, { duration: 500 });
  //     opacityValue.value = withTiming(0, { duration: 500 });
  //     marginValue.value = withTiming(0, { duration: 500 });
  //   }
  // }, [cancelFollowed]);

  const jumpToUser = useCallback(() => {
    // const { request } = useProfileStore.getState();
    reportClick(`${type}_button'`, {
      user_follow_button: 2,
      identity_status: isMine ? '0' : '1'
    });
    useUserInfoStore.getState().syncUserInfo(uid || '');
    router.push({
      pathname: `/user/${(uid || '').toString()}`,
      params: {
        id: String(uid)
      }
    });
  }, [isMine, type, uid]);

  return (
    <Animated.View style={[userSt.container]}>
      <View style={userSt.left}>
        <Avatar profile={props} size={54} source={avatar} />
        <Pressable onPress={jumpToUser}>
          <Text style={userSt.name} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
        </Pressable>
      </View>
      <View style={userSt.right}>
        <Follow
          uid={uid}
          followed={followed}
          beingFollowed={beingFollowed}
          onUnfollow={onUnfollow}
          onFollow={onFollow}
        />
      </View>
    </Animated.View>
  );
};

const userSt = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    height: 54
  },
  left: {
    width: 200,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  name: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: '600',
    marginLeft: 12,
    width: 200
  },
  right: {
    // width: 80,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

const BIG_LOADING = (
  <View style={followSt.loadingContainer}>
    <ActivityIndicator size="small" color="rgba(217, 217, 217, 1)" />
  </View>
);

const SMALL_LOADING = (
  <View>
    <ActivityIndicator size="small" color="rgba(217, 217, 217, 1)" />
  </View>
);

const LIST_ERROR = <Text>出错了</Text>;
