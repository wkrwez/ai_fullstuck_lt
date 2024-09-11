// 一键登录
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { Socket } from '@/src/api/websocket';
import {
  AGREEMENT_URL,
  LOGIN_SCENE_REPORT,
  LOGON_TIT_IMAGE_MAP,
  PRIVACY_URL
} from '@/src/constants';
import { useAppStore } from '@/src/store/app';
import { StyleSheet } from '@/src/utils';
import { reportClick, reportDiy } from '@/src/utils/report';
import {
  NumberAuth,
  NumberAuthCustomView,
  NumberAuthLogic,
  NumberAuthLoginButton,
  NumberAuthPhoneNumber,
  NumberAuthPrivacy,
  NumberAuthPrivacyAlert,
  NumberAuthText
} from '@Components/numberAuth';
import { showToast } from '@Components/toast';
import { showLoading } from '../loading';
import { useShallow } from 'zustand/react/shallow';

const LOGIN_BTN = require('@Assets/image/login/login_btnbg.png');
const REJECT_BTN = require('@Assets/image/login/reject_btn.png');
const LOGIN_TIT = require('@Assets/image/login/login_title_bg.png');
const ICON_CLOSE = require('@Assets/icon/icon-close.png');
const ICON_PHONE = require('@Assets/icon/icon-phone.png');
const ICON_UNCHECK = require('@Assets/icon/icon-uncheck.png');
const ICON_CHECKED = require('@Assets/icon/icon-checked.png');

interface AutoLoginProps {
  scene?: string;
  fallback?: () => void;
  onPhoneLogin: () => void;
  onSuccess: () => void;
  onClose: () => void;
  onPrivacyChecked: (v: boolean) => void;
  onReady: () => void;
}
export function AutoLogin(props: AutoLoginProps) {
  // useEffect(() => {
  //   showToast('请稍后~');
  // }, []);
  const { scene = 'common' } = props || {};
  const titleImg = LOGON_TIT_IMAGE_MAP[scene] || LOGIN_TIT;
  return (
    <NumberAuth
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        height: 379,
        left: 0,
        right: 0,
        bottom: 0
      }}
      {...props}
      onLoginError={onLoginError}
      onLoginSuccess={onLoginSuccess}
      onPrivacyChecked={v => {
        reportDiy('login', 'button-click', {
          log_button: '5',
          log_scene: LOGIN_SCENE_REPORT[scene]
        });
        props.onPrivacyChecked(v);
      }}
      onReady={props.onReady}
    >
      <>
        {/* View */}
        <NumberAuthCustomView
          backgroundImage={titleImg}
          style={{ top: 12, left: 96, width: 183, height: 29 }}
        ></NumberAuthCustomView>

        {/* Text */}
        {/* <NumberAuthText
          style={{
            top: 12,
            left: 96,
            width: 183,
            height: 29,
            fontSize: 12,
            color: '#ffffffff'
          }}
        >
          登录后
        </NumberAuthText> */}
        <NumberAuthCustomView
          onPress={() => {
            reportDiy('login', 'button-click', {
              log_button: '1',
              log_scene: LOGIN_SCENE_REPORT[scene]
            });
            props.onClose();
            NumberAuthLogic.cancelLogin();
          }}
          backgroundImage={ICON_CLOSE}
          style={{ top: 12, right: 12, width: 26, height: 26 }}
        />
        {/* 掩码手机号 */}
        <NumberAuthPhoneNumber
          style={{
            top: 92,
            fontSize: 30,
            color: 'rgba(0,0,0,0.87)',
            fontWeight: '900'
          }}
        />
        {/* 一键登录按钮 */}
        <NumberAuthLoginButton
          style={{
            top: 148,
            height: 50,
            left: 40,
            right: 40,
            color: '#ffffff',
            fontWeight: '500'
          }}
          backgroundImage={LOGIN_BTN}
        />
        {/* 其它按钮 */}
        <NumberAuthCustomView
          onPress={() => {
            props.onPhoneLogin();
            reportDiy('login', 'button-click', {
              log_button: '4',
              log_scene: LOGIN_SCENE_REPORT[scene]
            });
          }}
          backgroundImage={ICON_PHONE}
          style={{ top: 216, center: true, width: 50, height: 50 }}
        ></NumberAuthCustomView>
        {/* 隐私协议 */}
        <NumberAuthPrivacy
          style={{
            top: 314,
            color: 'rgba(0,0,0,0.3)',
            linkColor: 'rgba(0,0,0,0.54)',
            textAlign: 'center',
            fontSize: 10
          }}
          checkBoxImageUrls={[ICON_UNCHECK, ICON_CHECKED]}
          privacys={[
            { url: PRIVACY_URL, text: '用户协议' },
            { url: AGREEMENT_URL, text: '隐私协议' }
          ]}
        ></NumberAuthPrivacy>
        {/* 二次弹窗 */}
        {/* todo 弹窗内元素数值计算有问题，暂时先按标准布局写法<top left width height> */}
        <NumberAuthPrivacyAlert
          style={{
            borderRadius: 10,
            width: 245,
            height: 208,
            center: true,
            middle: true
          }}
          title="用户协议及隐私保护"
          titleStyle={{
            top: 20,
            left: 0,
            width: 245,
            height: 20,
            fontWeight: '500',
            // center: true,
            // width: 126,
            fontSize: 14,
            color: 'rgba(0,0,0,0.87)'
          }}
          contentStyle={{
            top: 52,
            left: 20,
            width: 206,
            height: 60,
            color: 'rgba(0,0,0,0.54)',
            fontSize: 13,
            linkColor: '#17639B'
          }}
          acceptButtonText="同意并登录"
          acceptButtonBackgroundImages={[LOGIN_BTN, LOGIN_BTN]}
          acceptButtonStyle={{
            width: 205,
            height: 36,
            color: '#ffffff',
            top: 128,
            left: 20,
            fontWeight: '500'
          }}
          closeButton={{
            backgroundImage: REJECT_BTN,
            style: {
              top: 176,
              left: 103,
              width: 40,
              height: 13
            }
          }}
        ></NumberAuthPrivacyAlert>
      </>
    </NumberAuth>
  );

  function onLoginError() {
    // props.onClose();
    setTimeout(() => {
      showToast('一键登录失败，请手动登录~');
    }, 1000);
  }

  function onLoginSuccess() {
    props.onSuccess();
  }
}
