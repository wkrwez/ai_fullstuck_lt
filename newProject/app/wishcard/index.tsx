import { LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { getCommonHeaders } from '@/src/api';
import { PressView, Webview, showToast } from '@/src/components';
import { registerNotification } from '@/src/components/v2/notification/register';
import { checkNotificationSuccess } from '@/src/components/v2/notification/util';
import { LOGIN_SCENE, SITE_URL } from '@/src/constants';
// import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import TBridge, { injectMethods } from '@/src/telegram';
import { CommonColor } from '@/src/theme/colors/common';
import { savePicture } from '@/src/utils/savePicture';
import { Screen } from '@Components/screen';
import { logWarn } from '@step.ai/logging-module';

export default function WishCard() {
  // const SITE_URL = 'http://10.141.14.59:3000'; // for test
  const WISHCARD_URL = SITE_URL + '/wishcard';
  console.log(WISHCARD_URL, 'WISHCARD_URL===');

  const webviewRef = useRef(null);

  const bridge = new TBridge(webviewRef);

  /**
   * 发送 to web
   */
  const sendMessageToWeb = async () => {
    const commonHeaders = await getCommonHeaders();
    console.log(commonHeaders['Oasis-Token'], 'token===');
    bridge.sendMessageToWeb({
      type: 'INIT',
      payload: {
        userToken: commonHeaders['Oasis-Token'],
        hasNoti: await checkNotificationSuccess(),
        hasLogin: await getUserAuthState()
      }
    });
  };

  const { getUserAuthState, loginIntercept } = useAuthState();
  const { user } = useAppStore();

  async function wishCardCallback() {
    console.log('login callback ===');
    const commonHeaders = await getCommonHeaders();
    bridge.sendMessageToWeb({
      type: 'REFRESH_TOKEN',
      payload: {
        userToken: commonHeaders['Oasis-Token'],
        hasLogin: await getUserAuthState()
      }
    });
  }

  useEffect(() => {
    if (user?.uid) {
      // 登录 callback
      wishCardCallback();
    }
  }, [user]);

  useEffect(() => {
    bridge.setOnMessageFromWeb((msg: any) => {
      console.log('Received message from web:', msg);
      if (msg.type === 'ACTION_LOGIN') {
        // 执行登录
        loginIntercept(() => {}, { scene: LOGIN_SCENE.MAKE_WISH });
      }
      if (msg.type === 'ACTION_OPENNOTI') {
        // 执行跳转通知
        registerNotification(async () => {
          bridge.sendMessageToWeb({
            type: 'UPDATE',
            payload: {
              hasNoti: await checkNotificationSuccess()
            }
          });
        });
      }
    });
  }, []);

  /** 加载完成发送初始信息 */
  const loadEnd = () => {
    sendMessageToWeb();
  };

  const [commonArgs, setCommonArgs] = useState({});

  useEffect(() => {
    const getArgs = async () => {
      setCommonArgs({
        userToken: (await getCommonHeaders())['Oasis-Token'],
        hasNoti: await checkNotificationSuccess(),
        hasLogin: await getUserAuthState()
      });
    };
    getArgs();
  }, []);

  return (
    <>
      <Screen
        preset="auto"
        safeAreaEdges={['top']}
        screenStyle={{
          backgroundColor: CommonColor.white
        }}
        contentContainerStyle={{
          flex: 1
        }}
        style={{
          ...Platform.select({
            ios: {
              marginBottom: 6
            },
            android: {
              marginTop: 6
            }
          })
        }}
        title="许愿卡"
      >
        <Webview
          ref={webviewRef}
          url={WISHCARD_URL}
          onMessage={event => {
            bridge.receiveMessageFromWeb(event);

            // for android
            bridge.setOnMessageFromWeb((msg: any) => {
              console.log('Received message from web:', msg);
              if (msg.type === 'ACTION_LOGIN') {
                // 执行登录
                loginIntercept(() => {}, { scene: LOGIN_SCENE.MAKE_WISH });
              }
              if (msg.type === 'ACTION_SAVE_PIC') {
                // 执行保存
                savePicture(msg.url)
                  .then(res => {
                    showToast('保存成功');
                  })
                  .catch(e => {
                    logWarn('[save image err]', e);
                    showToast('保存失败');
                  });
              }
              if (msg.type === 'ACTION_SAVE_PIC') {
                // 执行保存
                savePicture(msg.url)
                  .then(res => {
                    showToast('保存成功');
                  })
                  .catch(e => {
                    logWarn('[save image err]', e);
                    showToast('保存失败');
                  });
              }
              if (msg.type === 'ACTION_OPENNOTI') {
                // 执行跳转通知
                registerNotification(async () => {
                  bridge.sendMessageToWeb({
                    type: 'UPDATE',
                    payload: {
                      hasNoti: await checkNotificationSuccess()
                    }
                  });
                });
              }
            });
          }}
          injectedJavaScript={injectMethods}
          injectedJavaScriptObject={{
            type: 'INIT',
            payload: commonArgs
          }}
          onLoadEnd={loadEnd}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        ></Webview>
      </Screen>
    </>
  );
}
