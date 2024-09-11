import { useEffect, useRef, useState } from 'react';
import { InteractionManager } from 'react-native';
import { hideLoading, showLoading } from '@Components/loading';
import { LoginOptions, showLogin } from '@Components/login';
import { sleep } from '@Utils/sleep';
import { AuthState, Socket } from '../api/websocket';
import { LOGIN_SCENE_REPORT } from '../constants';
import { LoginState, useAppStore } from '../store/app';
import { useCreditStore } from '../store/credit';
import { reportDiy, reportExpo } from '../utils/report';

const MAX_RETRY = 20;
const RETRY_TIME = 500;
export function useAuthState() {
  const retryTime = useRef(0);

  const getUserAuthState = async (): Promise<boolean> => {
    const loginState = useAppStore.getState().loginState;
    if (loginState === LoginState.logined) {
      return true;
    }

    if (loginState === LoginState.logouted) {
      return false;
    }
    if (Socket.getAuthedState() || retryTime.current > MAX_RETRY) {
      // 已获取到权限或重试次数达到上限
      hideLoading();
      return Socket.getUserAuthState();
    }
    showLoading();
    await sleep(RETRY_TIME);
    retryTime.current += 1;
    return getUserAuthState();
  };

  const checkReportScene = (scene: string) => {
    scene &&
      reportDiy('login', 'all-expo', {
        log_scene: LOGIN_SCENE_REPORT[scene]
      });
  };

  const loginIntercept = async (cb: () => void, option?: LoginOptions) => {
    const scene = option?.scene || 'common';
    checkReportScene(scene!);
    const auth = await getUserAuthState();
    if (!auth) {
      showLogin(cb, option);
      return;
    }
    cb();
    // 登录更新积分
    useCreditStore.getState().syncCredits();
  };

  return { getUserAuthState, loginIntercept };
}
