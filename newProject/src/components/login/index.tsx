import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { getCommonHeaders } from '@/src/api';
import { Socket } from '@/src/api/websocket';
import {
  AGREEMENT_URL,
  CITY_CODE,
  CountryAbbr,
  LOGIN_SCENE,
  PHONE_REG,
  PRIVACY_URL
} from '@/src/constants';
import { useAppStore } from '@/src/store/app';
import { getChannel } from '@/src/store/message';
import { logWarn } from '@/src/utils/error-log';
import { reportDiy, reportExpo } from '@/src/utils/report';
import { Loading, hideLoading, showLoading } from '@Components/loading';
import { NumberAuth, NumberAuthLogic } from '@Components/numberAuth';
import { showToast } from '@Components/toast';
import { NumberAuthStore } from '../numberAuth/store';
import { useShallow } from 'zustand/react/shallow';
import { AutoLogin } from './AutoLogin';
import { PhoneValid } from './PhoneValid';
import { ANDROID_CI_TOKEN, ANDROID_DEMO_TOKEN, IOS_TOKEN } from './const';

export interface LoginOptions {
  scene: string;
  isExecuteCallback?: boolean;
}
// import { getChannel } from '@step.ai/app-info-module'; // 有问题

export const LoginGlobalSingleton = {
  showLogin: (callback?: () => void, options?: LoginOptions) => {},
  hideLogin: () => {}
};

enum LoginType {
  phone = 'phone',
  auto = 'auto'
}

interface LoginGlobalProps {}
export function LoginGlobal(props: LoginGlobalProps) {
  const errRef = useRef(false);
  const onSuccessCallbackRef = useRef<any>(null);
  const [numberAuthErr, setNumberAuthErr] = useState(false);
  const [currentLoginType, setCurrentLoginType] = useState<LoginType>();
  const [isVisible, setVisible] = useState(false);
  const [loginScene, setScene] = useState('common');
  const [city, setCity] = useState<CountryAbbr>('CN');
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const { user, syncUser, signOff, signOut } = useAppStore(
    useShallow(state => ({
      signOut: state.signOut,
      signOff: state.signOff,
      syncUser: state.syncUser,
      user: state.user
    }))
  );

  const [isHuawei, setIsHuawei] = useState(false);

  useEffect(() => {
    const reqChannel = async () => {
      const header = await getCommonHeaders();
      const getChannelString = header['oasis-channel'];
      // showToast(getChannelString + 'getChannelString:', 5000);
      const Huawei =
        getChannelString === 'huaiwei' || getChannelString === 'huawei';
      setIsHuawei(Huawei); // TODO: 暂时
    };

    if (isVisible) {
      reqChannel();
    }
  }, [user, isVisible]);

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      hideLoading();
    }
  }, [loading]);

  useEffect(() => {
    setCurrentLoginType(LoginType.auto);

    NumberAuthLogic.setAuthSDKInfo(
      Platform.OS === 'android'
        ? process.env.CI === 'true'
          ? ANDROID_CI_TOKEN
          : ANDROID_CI_TOKEN
        : // ANDROID_DEMO_TOKEN
          IOS_TOKEN
    )
      .then(() => {
        console.log('[2222233]');
        setLoading(false);
        NumberAuthLogic.accelerateLoginPage();
      })
      .catch(e => {
        console.log('[setAuthSDKInfo error]', e);
        // todo 上报
        setNumberAuthErr(true);
        errRef.current = true;
      });

    const registerLogin = () => {
      LoginGlobalSingleton.showLogin = (callback, options) => {
        // alert('showLogin');
        const { scene } = options || {};

        setScene(scene || LOGIN_SCENE.COMMON);
        setVisible(true);
        setCurrentLoginType(LoginType.auto);
        setNumberAuthErr(false);
        if (callback) {
          onSuccessCallbackRef.current = callback;
        }
      };
      LoginGlobalSingleton.hideLogin = () => {
        setVisible(false);
        onSuccessCallbackRef.current = null;
      };
    };

    registerLogin();
  }, []);

  useEffect(() => {
    isHuawei && setChecked(false);
  }, [currentLoginType, isHuawei]);

  const onPhoneLogin = useCallback(() => {
    NumberAuthLogic.cancelLogin();
    setCurrentLoginType(LoginType.phone);
  }, [isHuawei]);

  const onAutoLogin = useCallback(() => {
    NumberAuthLogic.cancelLogin();
    setCurrentLoginType(LoginType.auto);
  }, [isHuawei]);

  if (loading) return null;
  if (!isVisible) return null;
  if (numberAuthErr || currentLoginType === LoginType.phone) {
    return (
      <PhoneValid
        visible={isVisible}
        scene={loginScene}
        onSuccess={onLoginSuccess}
        hasBack={!numberAuthErr}
        onReturn={onAutoLogin}
        onClose={onClose}
        privacyChecked={checked}
        onPrivacyChecked={onPrivacyChecked}
      />
    );
  }

  return (
    <AutoLogin
      scene={loginScene}
      fallback={onFallback}
      onSuccess={onLoginSuccess}
      onPhoneLogin={onPhoneLogin}
      onPrivacyChecked={onPrivacyChecked}
      onClose={onClose}
      onReady={() => {
        hideLoading();
      }}
    />
  );

  function onClose() {
    setVisible(false);
    NumberAuthStore.resetConfig();
    onSuccessCallbackRef.current = null;
  }

  function onFallback() {
    setNumberAuthErr(true);
    setCurrentLoginType(LoginType.phone);
  }

  function onLoginSuccess() {
    reportDiy('login', 'login_result', {
      is_success: '1'
    });

    setVisible(false);
    setCurrentLoginType(LoginType.auto);
    showToast('登录成功~');
    if (typeof onSuccessCallbackRef.current === 'function') {
      onSuccessCallbackRef.current();
      onSuccessCallbackRef.current = null;
    }
  }

  function onPrivacyChecked(v?: boolean) {
    showToast(isHuawei);
    // if (isHuawei) {
    //   return;
    // }
    if (typeof v === 'undefined') {
      setChecked(checked => !checked);
      return;
    }
    setChecked(v);
  }
}

export const showLogin = (callback?: () => void, options?: LoginOptions) =>
  LoginGlobalSingleton.showLogin(callback, options);
export const hideLogin = () => LoginGlobalSingleton.hideLogin();
