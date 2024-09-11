import { ReactNode, useEffect, useRef } from 'react';
import { passportClient } from '@/src/api';
import { Socket } from '@/src/api/websocket';
import { LOGIN_SCENE_REPORT } from '@/src/constants';
import { useAppStore } from '@/src/store/app';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportDiy } from '@/src/utils/report';
import * as logger from '@step.ai/logging-module';
import * as NumberAuthLogic from '@step.ai/number-auth';
import { NumberAuthConfig } from '@step.ai/number-auth/src/proto/number_auth_config_pb';
import { NumberAuthStore } from './store';
import { NumberAuthStyle, getBorderRadius, getBoundingRect } from './utils';

export interface NumberAuthProps {
  style?: NumberAuthStyle;
  config?: NumberAuthConfig;
  children?: ReactNode;
  fallback?: () => void; // 失败兜底事件
  onPrivacyChecked?: (v: boolean) => void; // 同意了隐私协议
  onLoginSuccess?: () => void; // 登录成功
  onLoginError?: () => void; // 登录失败
  onReady?: () => void;
  scene?: string;
}

const LOG_TAG = 'NumberAuth';

export function NumberAuth(props: NumberAuthProps) {
  const listenerRef = useRef();
  useEffect(() => {
    const { style, config: oriConfig } = props;
    logger.logInfo('NumberAuth init', LOG_TAG);
    if (style) {
      const alertCornerRadiusArray = getBorderRadius(style);
      const contentViewFrame = getBoundingRect(style);
      const newConfig = {
        alertCornerRadiusArray,
        contentViewFrame
      };
      NumberAuthStore.updateConfig(newConfig);
    }

    const startTime = Date.now();
    let logining = false;
    NumberAuthLogic.checkEnvAvailable()
      .then(res => {
        logger.logInfo(
          'check time' + (Date.now() - startTime) + 'logining' + logining,
          LOG_TAG
        );
        NumberAuthLogic.getLoginToken(5, NumberAuthStore.config)
          .then(token => {
            // 防止重复登录
            NumberAuthLogic.cancelLogin();
            // if (listenerRef.current) {
            //   NumberAuthLogic.removeResultChangedListener(listenerRef.current);
            // }
            if (logining) return;
            logining = true;
            logger.logDebug('NumberAuthLogic: ' + token, LOG_TAG);
            // 获取到token后立马关闭

            // useAppStore.getState().signIn({
            //   clientAuthToken: token
            // });
            passportClient
              .signIn({
                clientAuthToken: token
              })
              .then(async () => {
                NumberAuthLogic.cancelLogin();
                const socket = new Socket({ ignoreCreate: true });
                Socket.clearAuth();
                socket.reconnect();
                await useAppStore.getState().syncUser();
                if (props.onLoginSuccess) {
                  props.onLoginSuccess();
                }
                NumberAuthStore.resetConfig();
                logger.logInfo('signin success', LOG_TAG);
              })
              .catch(e => {
                console.log('signin error', e);
                // logger.logInfo('signin failure', LOG_TAG);
                logining = true;
                NumberAuthLogic.cancelLogin();
                if (props.fallback) {
                  props.fallback();
                }
                if (props.onLoginError) {
                  props.onLoginError();
                }
                logWarn(e, LOG_TAG);
              });
          })
          .catch((e: Error) => {
            NumberAuthLogic.cancelLogin();
            if (props.fallback) {
              props.fallback();
            }
            // alert(JSON.stringify(e));
            console.log('getLoginToken-----', e);
            logWarn('number-auth-error', e, LOG_TAG);
          });

        // @ts-ignore
        listenerRef.current = NumberAuthLogic.onResultChanged(
          (eventName: String, params: Map<String, any>) => {
            const event = eventName as string;
            logger.logInfo('NumberAuthLogic： ' + eventName, LOG_TAG);
            switch (event) {
              case 'GetOperatorInfoFailed':
              case 'NoSIMCard':
              case 'NoCellularNetwork':
              case 'UnknownOperator':
              case 'UnknownError':
              case 'GetTokenFailed':
              case 'GetMaskPhoneFailed':
              case 'InterfaceDemoted':
              case 'InterfaceLimited':
              case 'InterfaceTimeout':
              case 'DecodeAppInfoFailed':
              case 'PhoneBlack':
              case 'CarrierChanged':
              case 'EnvCheckFail':
                NumberAuthLogic.cancelLogin();
                if (props.fallback) {
                  props.fallback();
                  logWarn('[NumberAuth error] listener', event);
                }
                break;
              case 'LoginControllerClickCheckBoxBtn':
                if (props.onPrivacyChecked) {
                  // @ts-ignore
                  props.onPrivacyChecked(params['isChecked']);
                }
                break;
              case 'LoginControllerPresentSuccess':
                props.onReady && props.onReady();
                break;
              case 'LoginControllerClickLoginBtn':
                // report
                reportDiy('login', 'button-click', {
                  log_button: '3',
                  log_scene: LOGIN_SCENE_REPORT[props.scene || 'common']
                });
                break;
              default:
                if (NumberAuthStore.callbacks[event]) {
                  NumberAuthStore.callbacks[event]();
                }
            }

            // if (eventName == PHONE_BTN_DID_SELECTED_EVENT || eventName == DID_CLICKED_CLOSE_BTN) {
            //   NumberAuth.cancelLogin(false);
            // } else if (eventName == NumberAuth.NUMBER_AUTH_CODE.LOGIN_CONTROLLER_CLICK_CHECK_BOX_BTN) {
            //   console.log("checkbox is checked:", params["isChecked"]);
            // }
          }
        );
      })
      .catch(e => {
        logWarn('checkEnvAvailable error', e, LOG_TAG);
        props.fallback && props.fallback();
        NumberAuthLogic.cancelLogin();
        // alert(JSON.stringify(e));
      });

    return () => {
      if (listenerRef.current) {
        NumberAuthLogic.removeResultChangedListener(listenerRef.current);
      }
    };
    // console.log('callbacks====', NumberAuthStore.callbacks);
  }, []);

  return props.children || null;
}
