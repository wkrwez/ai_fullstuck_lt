import { useDebounceFn } from 'ahooks';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { FollowClient } from '@/src/api/follow';
import Notification from '@/src/components/v2/notification';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { InteractionType, useHistoryStore } from '@/src/store/histroy';
import { EnotiType } from '@/src/store/storage';
import { Theme } from '@/src/theme/colors/type';
import { logWarn } from '@/src/utils/error-log';
import { showConfirm } from '../confirm';
import { showToast } from '../toast';
import useNotification from '../v2/notification/hook';
import { useShallow } from 'zustand/react/shallow';
import { styles } from './style';
import { FollowBtnTheme } from './type';
import { FollowDisplayConfig, calcFollowStatus } from './utils';

interface IFollowProps {
  followed: boolean;
  beingFollowed: boolean;
  uid?: string;
  style?: StyleProp<ViewStyle>;
  onFollow?: Function;
  onUnfollow?: Function;
  theme?: FollowBtnTheme;
}

const buttomThemeMap = {
  [FollowBtnTheme.SOLID]: Theme.LIGHT,
  [FollowBtnTheme.REGULAR]: Theme.LIGHT,
  [FollowBtnTheme.SOLID_COLOR_MODE]: Theme.LIGHT,
  [FollowBtnTheme.SOLID_DARK_MODE]: Theme.DARK
};

export const Follow = (props: IFollowProps) => {
  const { loginIntercept } = useAuthState();
  const { user } = useAppStore();
  const {
    uid,
    followed,
    beingFollowed,
    style: externalStyle,
    theme = FollowBtnTheme.SOLID
  } = props;

  const { currentCache, updateInteractionHistory } = useHistoryStore(
    useShallow(state => {
      return {
        currentCache: uid ? state.userInteraction[uid] : null,
        updateInteractionHistory: state.update
      };
    })
  );

  // 因为前端要做关注的假状态，点击之后立即点亮，所有需要一个内部状态
  const [internalFollowed, setInternalFollowed] = useState(!!props.followed);
  const placeholderScale = useRef(new Animated.Value(1)).current;
  const placeholderOpacity = useRef(new Animated.Value(1)).current;

  const followStatus = calcFollowStatus(internalFollowed, beingFollowed);
  const followStatusConfig = FollowDisplayConfig[followStatus];
  const configStyle = followStatusConfig[theme];

  const confirmPromise = async () =>
    new Promise<void>(f => {
      showConfirm({
        theme: buttomThemeMap[theme],
        title: '不再关注Ta?',
        confirmText: '不再关注',
        cancelText: '再想想',
        onConfirm: ({ close }) => {
          f();
          close();
        }
        // onClose: () => {
        //   close();
        //   // throw new Error('用户取消');
        // }
      });
    });

  // 当外部的followed状态变更的时候，直接同步一次内部状态，
  useEffect(() => {
    setInternalFollowed(followed);
  }, [followed]);

  useEffect(() => {
    if (currentCache) {
      setInternalFollowed(Boolean(currentCache.following));
    }
  }, [currentCache]);

  const { run: onPress } = useDebounceFn(
    async () => {
      Haptics.selectionAsync();

      loginIntercept(
        async () => {
          const prev = internalFollowed;
          const target = !internalFollowed;

          if (!uid) {
            return;
          }

          if (!target) {
            await confirmPromise();
          } else {
            // + 强通知逻辑
            setInitLock(false);
          }

          try {
            setInternalFollowed(target);
            const params = {
              follow: target,
              targetUid: uid
            };
            console.log(`关注用户request：`, params);
            const res = await FollowClient.followUser(params);
            console.log(`关注用户response：`, res);

            showToast(target ? '你已关注该用户' : '取消关注成功');
            updateInteractionHistory(InteractionType.USER, uid, {
              following: target
            });
            if (target) {
              props.onFollow && props.onFollow(props);
            } else {
              props.onUnfollow && props.onUnfollow(props);
            }
          } catch (error) {
            setInternalFollowed(prev);
            showToast('操作失败，请重试');
            logWarn('followUser', error);
          }
        },
        { scene: LOGIN_SCENE.FOLLOW }
      );
    },
    {
      wait: 300
    }
  );

  const onPressIn = () => {
    Animated.timing(placeholderScale, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true
    }).start();
    Animated.timing(placeholderOpacity, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(placeholderScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
    Animated.timing(placeholderOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const { notificationVisible, setNotificationVisible, setInitLock } =
    useNotification({
      expire: 7,
      signal: EnotiType.notiReachDatedByFollow,
      lock: true
    });

  const onCloseNotification = () => {
    setInitLock(true);
    setNotificationVisible(false);
  };

  // 如果关注的人是我自己，就不展示关注按钮
  const isMySelf = user?.uid === uid;
  if (isMySelf) {
    return null;
  }

  return (
    <View style={externalStyle}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <Animated.View
          style={[
            styles.followBtn,
            configStyle.button,
            // buttonStyle,
            {
              transform: [{ scale: placeholderScale }],
              opacity: placeholderOpacity
            }
          ]}
        >
          <Text style={[configStyle.text]}>{followStatusConfig.text}</Text>
        </Animated.View>
      </Pressable>
      <Notification
        visible={notificationVisible}
        onClose={onCloseNotification}
        slogan={'开启 App 通知，才能及时收到 Ta 的作品更新噢'}
        signal={EnotiType.notiReachDatedByFollow}
      />
    </View>
  );
};
