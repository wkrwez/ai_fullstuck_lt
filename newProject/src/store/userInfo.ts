import { router } from 'expo-router';
import { create } from 'zustand';
import { GetUserCommonInfo } from '../api/query';
import { showToast } from '../components';
import { UserProfile, UserSocialStat } from '../types';
import { catchErrorLog, logWarn } from '../utils/error-log';

// 最多只允许缓存 50条UserInfo在内存中,用最简单的数据结构，但牺牲速度
const MAX_SIZE = 50;
// 控制同uid的获取结果限制
const loadingStates: Record<string, NodeJS.Timeout> = {};
const MIN_FETCH_DURATION = 2000;

//
export type UserInfo = {
  uid: string;
  profile: UserProfile;
  stat: UserSocialStat;
};

type States = {
  __users: UserInfo[]; // 不要直接依赖 __users!!，用getUserInfo获取
};

type Actions = {
  // 同步UserInfo
  syncUserInfo: (uid: string) => void;
  // 获取本地的
  getUserInfo: (uid: string) => UserInfo | undefined;
  // update stat
  updateStat: (uid: string, stat: Partial<UserSocialStat>) => void;
};

export const useUserInfoStore = create<States & Actions>()((set, get) => {
  // 将uid 推到最前面
  function add(user: UserInfo) {
    const newUsers = [...get().__users];
    const index = newUsers.findIndex(u => u.uid === user.uid);
    if (index !== -1) {
      newUsers.splice(index, 1);
    }
    newUsers.push(user);
    if (newUsers.length > MAX_SIZE) {
      newUsers.shift();
    }
    set({
      __users: newUsers
    });
  }

  return {
    __users: [],
    getUserInfo: uid => {
      return get().__users.find(u => u.uid === uid);
    },
    // 做法是落地页的同步和入口的sync不再冲突 1秒内只允许请求一次
    syncUserInfo: uid => {
      // 2秒控频
      if (loadingStates[uid]) return;
      loadingStates[uid] = setTimeout(() => {
        delete loadingStates[uid];
      }, MIN_FETCH_DURATION);

      GetUserCommonInfo({ uid })
        .then(({ stat, profile }) => {
          console.log('获取用户信息成功GetUserCommonInfo', stat, profile);
          if (stat && profile) {
            add({ uid, stat, profile });
          }
          if (!stat && !profile) {
            router.replace({
              pathname: '/empty-page/',
              params: {
                type: 'user'
              }
            });
          }
        })
        .catch(_e => {
          console.log('获取用户信息失败GetUserCommonInfo');
          logWarn('获取用户信息失败', _e);
          // TODO：应该要抛出错误吗？
          showToast('获取信息失败');
          catchErrorLog('userSocialInfo_error', _e, {
            params: { uid, syncUserInfo: 1 }
          });
        })
        .finally(() => {
          //清理定时器
          const timer = loadingStates[uid];
          if (timer) {
            clearInterval(timer);
            delete loadingStates[uid];
          }
        });
    },
    updateStat: (uid: string, stat: Partial<UserSocialStat>) => {
      const users = [...get().__users];
      const index = users.findIndex(u => u.uid === uid);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          stat: {
            ...users[index].stat,
            ...stat
          } as UserSocialStat
        };
      }
      set({
        __users: users
      });
    }
  };
});
