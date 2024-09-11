import { router } from 'expo-router';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { appInfoClient } from '@/src/api/appinfo';
import { closeAccount, getProfile, updateProfile } from '@/src/api/profile';
// import { User, UserMode } from '@step.ai/proto-gen/proto/user/v1/user_pb';
// import {
//   userClient,
//   passportCleanUp,
//   passportClient,
//   appInfoClient,
// } from '../api/services';
import { passportClient } from '@/src/api/services';
import { Socket } from '@/src/api/websocket';
import { lipuAPIEnv } from '../api/env';
import { ErrorRes } from '../api/websocket/stream_connect';
import { CheckUpdateRes } from '@/proto-registry/src/web/raccoon/appinfo/appinfo_pb';
import { Empty, PartialMessage } from '@bufbuild/protobuf';
import { APIEnvType } from '@step.ai/connect-api-common';
import Getui from '@step.ai/getui-push-module';
import {
  SignInRequest,
  SignOffResponse,
  SignOutResponse
} from '@step.ai/proto-gen/proto/api/passport/v1/service_pb';
import {
  GetUserInfoRes,
  UpdateUserInfoReq,
  UserProfile
} from '@step.ai/proto-gen/raccoon/uinfo/uinfo_pb';
import { agreedUponToS, setAgreedUponToS } from '@step.ai/tos-module';
import { useConfigStore } from './config';
import { useEmojiStore } from './emoji';
import { useMessageStore } from './message';
import { useTaskStore } from './tasks';

// import { CheckUpdateResponse } from '@step.ai/proto-gen/raccoon/proto/app/v1/app_info_pb';

// 用户
type User = UserProfile;
type States = {
  loginState: LoginState;
  user: User | null;
  env: APIEnvType;
  updateInfo: CheckUpdateRes | null;
  agreePolicy: boolean;
  layoutReady: boolean;
};

export enum LoginState {
  unknow = 'unknow',
  logined = 'login',
  logouted = 'logout'
}

type Actions = {
  setLayoutReady: (ready: boolean) => void;
  setUser: (user: User | null) => void;
  syncUser: () => Promise<undefined>;
  setEnv: (env: APIEnvType) => void;
  cleanUp: () => void;
  signIn: (payload: SignInRequest) => Promise<void>;
  signOff: () => Promise<SignOffResponse>;
  signOut: () => Promise<SignOutResponse>;
  updateUser: (
    payload: ConstructorParameters<typeof UpdateUserInfoReq>[0]
  ) => Promise<Empty>;
  setAgreePolicy: (agreePolicy: boolean) => void;
  checkUpdate: () => Promise<CheckUpdateRes>;
  setUpdateInfo: (updateInfo: CheckUpdateRes) => void;
  logout: () => void;
};

const resetAppState = () => {
  return {
    // isAgree: false,
    loginState: LoginState.unknow,
    user: null,
    updateInfo: null
  };
};

export const useAppStore = create<States & Actions>((set, get) => {
  const gotoLogin = () => {
    get().cleanUp();
    // router.replace('/login/login');
  };
  return {
    ...resetAppState(),
    layoutReady: false,
    agreePolicy: agreedUponToS(),
    setLayoutReady: layoutReady => {
      set({ layoutReady });
    },
    env: lipuAPIEnv.currentEnvType(),
    switchAgree() {
      // 同意协议
      const agreePolicy = get().agreePolicy;
      set({
        agreePolicy: !agreePolicy
      });
    },
    cleanUp() {
      // set({
      //   ...resetAppState(),
      // });
    },
    logout() {
      const socket = new Socket({ ignoreCreate: true });
      Socket.clearAuth();
      socket.reconnect();
      get().setUser(null);
      set({
        loginState: LoginState.logouted
      });
      useEmojiStore.getState().reset();
      Getui.resetBadge();
    },
    setUser(user) {
      set({ user });
    },
    setEnv(env) {
      lipuAPIEnv.changeEnv(env);
      set({ env });
    },
    setUpdateInfo(updateInfo: CheckUpdateRes) {
      set({ updateInfo });
    },
    setAgreePolicy(agreePolicy) {
      set({ agreePolicy });
      setAgreedUponToS(agreePolicy);
    },
    async checkUpdate() {
      return appInfoClient.checkUpdate({}).then(updateInfo => {
        console.log('updateInfo-------', updateInfo);
        get().setUpdateInfo(updateInfo);
        return updateInfo;
      });
    },
    signIn(payload: PartialMessage<SignInRequest>) {
      return passportClient.signIn(payload).then(async () => {
        const socket = new Socket({ ignoreCreate: true });
        Socket.clearAuth();
        socket.reconnect();
        set({
          loginState: LoginState.logined
        });
        await get().syncUser();
      });
    },
    async syncUser() {
      console.log('syncUser------', get().user);
      return getProfile()
        .then((res: GetUserInfoRes) => {
          console.log('syncUser success----', res);
          if (res.user) {
            console.log('user----', res.user);
            get().setUser(res.user);
            set({
              loginState: LoginState.logined
            });
          }
        })
        .catch(() => {});
    },
    async signOff() {
      return passportClient.signOff({}).then(res => {
        get().logout();
        return res;
      });
    },
    async signOut() {
      return passportClient.signOut({}).then(res => {
        Getui.resetBadge();
        // 账号注销
        return closeAccount().then(() => {
          get().logout();
          return res;
        });
      });
    },
    async updateUser(
      payload: ConstructorParameters<typeof UpdateUserInfoReq>[0]
    ) {
      const { user, setUser } = get();

      return updateProfile(new UpdateUserInfoReq(payload)).then(async res => {
        await setUser(new UserProfile(res?.user || user || undefined));
        return res;
      });
    }
  };
});
