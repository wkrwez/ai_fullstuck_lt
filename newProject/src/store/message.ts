/** 站内消息 */
import { router } from 'expo-router';
import { Platform } from 'react-native';
import { create } from 'zustand';
import {
  QueryInboxMsg,
  QueryInboxMsgByCursor,
  QueryInboxUnread,
  ReadInboxMsg,
  UpdateMessageNum
} from '@/src/api/message';
import { pushInitService } from '@/src/api/push';
import { getCommonHeaders } from '@/src/api/services';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { CacheEvent } from '@Utils/cacheEvent';
import { logWarn } from '@Utils/error-log';
import { Pagination } from '../types';
import { reportClick, reportExpo } from '../utils/report';
import { Empty, MethodKind } from '@bufbuild/protobuf';
// import { UserProfile } from '@step.ai/proto-gen/raccoon/common/profile_pb'
// import { UserSocialStat } from '@step.ai/proto-gen/raccoon/common/stat_pb'
// import { useAppStore } from './app';
import type { PartialMessage } from '@bufbuild/protobuf';
import Getui from '@step.ai/getui-push-module';
import {
  QueryInboxMsgByCursorReq,
  QueryInboxMsgByCursorRes,
  QueryInboxMsgRes
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';
import { useStorageStore } from './storage';

const ce = new CacheEvent();
type States = {
  count: number; // 未读消息数
  msgSet: Set<string>;
};

const channelMap = {
  unknow: 0,
  ios: 1,
  huawei: 2,
  honor: 3,
  xiaomi: 4,
  oppo: 5,
  vivo: 6
};

export const getChannel = (string: string) => {
  if (/HONOR/i.test(string)) {
    return 'honor';
  }
  if (/Huawei/i.test(string)) {
    return 'huawei';
  }

  if (/Xiaomi/i.test(string)) {
    return 'xiaomi';
  }

  if (/OPPO/i.test(string)) {
    return 'oppo';
  }
  if (/vivo/i.test(string)) {
    return 'vivo';
  }
};

export type PlatformStr = ReturnType<typeof getChannel>;

export const getPlatformStr = (): PlatformStr => {
  return getChannel(useStorageStore.getState().device);
};

const getClientId = async (): Promise<string> => {
  // todo 因为测试包和正式包不一样 还是得更新一下
  // const cacheCid = useStorageStore.getState().cid;
  // if (cacheCid) {
  //   return Promise.resolve(cacheCid);
  // }

  return new Promise((resolve, reject) => {
    Getui.clientId((cid: string) => {
      if (!cid) {
        logWarn('cid 为空', cid);
        reject(
          new ErrorRes({
            code: 1,
            reason: 'cid为空'
          })
        );
        return;
      }
      useStorageStore.getState().__setStorage({ cid });
      resolve(cid);
    });
  });
};

const pushInit = (cid: string) => {
  return pushInitService({
    cid,
    platform: Platform.OS === 'ios' ? 4 : 3,
    channel:
      Platform.OS === 'ios'
        ? channelMap.ios
        : // @ts-ignore
          channelMap[getPlatformStr()] || channelMap.unknow
  }).catch((e: ErrorRes) => {
    console.log(e);
    logWarn('pushInitService', JSON.stringify(e));
  });
};

type Actions = {
  updateUnread: () => void;
  init: () => void;
  query: (payload: {
    pagination: { size: number; cursor: string };
  }) => Promise<QueryInboxMsgByCursorRes>;
  read: (msgId: string) => Promise<Empty>;
  getuiInit: () => void;
  getuiInitService: () => void;
  reset: () => void;
};

export const useMessageStore = create<States & Actions>()((set, get) => ({
  count: 0,
  msgSet: new Set(),
  reset() {
    set({ count: 0 });
  },
  updateUnread() {
    QueryInboxUnread().then(res => {
      console.log(res.count, 'res.count');
      set({
        count: res.count || 0
      });
      if (!res.count) {
        Getui.resetBadge();
      } else {
        Getui.setBadge(res.count);
      }
    });
  },
  init() {
    console.log('messsage init');
    get().getuiInit();
    UpdateMessageNum(({ msgIds }) => {
      get().updateUnread();
      // // 消息数实时更新
      // const { msgSet, count } = get();
      // if (!msgIds) return;
      // msgIds.forEach(msgId => {
      //   if (msgSet.has(msgId)) {
      //     return;
      //   }
      //   set({
      //     count: count + 1
      //   });
      // });
    });
  },
  getuiInit() {
    // todo 重复调用
    // if (ce.get('getui')) return;
    // ce.set('getui', 1);
    console.log('getuiInit');

    // Getui.initPush();
    Getui.onEvent('GetuiSdkGrantAuthorization', (event: any) => {
      console.log('GetuiEvent: auth', event);
      // alert('GetuiEvent: auth');
      reportExpo('auth', { module: 'push', auth: event });
    });
    Getui.onEvent('GeTuiSdkDidRegisterClient', (event: any) => {
      pushInit(event);
      console.log('GetuiEvent: 可以拿此CID去个推后台测试推送：', event);
      reportExpo('register', { module: 'push', cid: event });
    });
    Getui.onEvent('GeTuiSdkDidReceiveNotification', (event: any) => {
      if (!event.payload) return;
      try {
        const { path } = JSON.parse(event.payload);
        router.push(path);
        reportClick('receive', { module: 'push', ...event.payload });
        console.log('GetuiEvent: message', event);
      } catch (e) {}
    });
  },
  async getuiInitService() {
    // const header = await getCommonHeaders();
    getClientId().then(cid => {
      return pushInit(cid);
    });
  },
  query(payload) {
    console.log(payload, '请求参数');
    return QueryInboxMsgByCursor(payload).then(
      (res: QueryInboxMsgByCursorRes) => {
        console.log('QueryInboxMsg', res);
        return res;
      }
    );
  },
  read(msgid) {
    return ReadInboxMsg(msgid).then(res => {
      console.log('ReadInboxMsg', res);
      get().updateUnread();
      set({
        count: 0
      });
      Getui.resetBadge();
      return res;
    });
  }
}));
