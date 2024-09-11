import * as Clipboard from 'expo-clipboard';
import { router, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { getCommonHeaders } from '@/src/api';
import { StreamLogout } from '@/src/api/auth';
import { Socket } from '@/src/api/websocket';
import { hideLoading, showLoading } from '@/src/components';
import { Button } from '@/src/components/button';
import { showConfirm } from '@/src/components/confirm';
import { DevSheet } from '@/src/components/dev/DevSheet';
import { useAppStore } from '@/src/store/app';
import { usePublishStore } from '@/src/store/publish';
import { useStorageStore } from '@/src/store/storage';
import { colorsUI } from '@/src/theme';
import { getVersionStr } from '@/src/utils/getVersion';
import { Screen } from '@Components/screen';
import { SettingGroup, SettingItem } from '@Components/setting';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { StyleSheet } from '@Utils/StyleSheet';
import { getChannel } from '@Utils/getChannel';
// import {
//   AnimationDir,
//   MaskImages
// } from '../parallel-world/_components/mask-images';
import { CommonActions } from '@react-navigation/native';
import {
  getSettingsPagePublicInfo,
  shouldEnableDevTools
} from '@step.ai/app-info-module';
// import { UserMode } from "@step.ai/proto-gen/proto/user/v1/user_pb";
import { useShallow } from 'zustand/react/shallow';

// import {
//   shouldEnableDevTools,
//   getSettingsPagePublicInfo,
// } from '@step.ai/app-info-module';
const images = [
  'https://media-test.tos-cn-shanghai.volces.com/aigc/IMAGE/20240804/cbfe9ee4e381b05f5c5eb29fdd76e493.png',
  'https://media-test.tos-cn-shanghai.volces.com/aigc/IMAGE/20240804/84b72bdf828e11208a2cd3ce38f0dd87.png',
  'https://media-dev.tos-cn-shanghai.volces.com/aigc/IMAGE/20240723/46981f67b30377a9415b6b0192134c07.png',
  'https://media-dev.tos-cn-shanghai.volces.com/aigc/IMAGE/20240723/84c567d20698c385c6097e764c30fc12.png',
  'https://media-dev.tos-cn-shanghai.volces.com/aigc/IMAGE/20240723/929a55f7cc9609c0a196a5e8394b2e95.png',
  'https://media-dev.tos-cn-shanghai.volces.com/aigc/IMAGE/20240723/929a55f7cc9609c0a196a5e8394b2e95.png'
];

export default function AboutScreen() {
  const { user, signOff } = useAppStore(
    useShallow(state => ({
      user: state.user,
      // isLogin: state.user?.mode === UserMode.SIGNIN,
      signOff: state.signOff
    }))
  );
  const navigation = useNavigation();
  // const userName = useMemo(() => {
  //   return isLogin ? user?.binding?.mobile?.number ?? "" : "未登录";
  // }, [isLogin, user]);
  const [showDev, setShowDev] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const showDevMenu = () => {
    // if (!shouldEnableDevTools()) return;
    setShowDev(true);
    useStorageStore.getState().__setStorage({ debugMode: true });
    showToast('debug模式已打开~');
  };
  const tripleInfoTap = Gesture.Tap()
    .numberOfTaps(3)
    .onEnd(() => {
      runOnJS(setShowInfo)(true);
    });
  const devMenuTap = Gesture.Tap()
    .numberOfTaps(8)
    .onEnd(() => {
      runOnJS(showDevMenu)();
    });
  const composed = Gesture.Exclusive(devMenuTap, tripleInfoTap);

  const versionStr = getVersionStr();

  const onPressAccount = () => {
    router.push('/setting/account');
  };
  const onPressAbout = async () => {
    router.push('/setting/about');
  };
  // const onPressLogout = () => {
  //   setSignOffConfirmVisible(true);
  // };
  const onPressShare = () => {
    showToast('分享待开发');
  };
  const onPressFeedback = () => {
    // showToast('反馈待给出飞书问卷');
    router.push({
      pathname: '/webview',
      params: {
        url: 'https://wvixbzgc0u7.feishu.cn/share/base/form/shrcnTrzx7G6nsaGEhP6eWtAKoc',
        title: '投诉与反馈'
      }
    });
  };

  return (
    <Screen
      screenStyle={{ backgroundColor: '#f4f4f4' }}
      headerStyle={{ justifyContent: 'flex-start' }}
    >
      <View
        style={{
          marginTop: 26,
          flex: 1,
          marginBottom: 34
        }}
      >
        <Text
          style={{
            color: StyleSheet.currentColors.title,
            fontSize: 30,
            fontWeight: '700',
            lineHeight: 35,
            marginLeft: 16
          }}
        >
          设置
        </Text>

        <SettingGroup style={{ marginTop: 30, backgroundColor: '#ffffff' }}>
          <SettingItem
            key="safe"
            title="账号与安全"
            rightContent={
              <Text
                style={{
                  marginRight: 12,
                  color: colorsUI.Text.default.subtle
                }}
              >
                {/* {userName} */}
              </Text>
            }
            leftIcon="security"
            onPress={onPressAccount}
          />
          <SettingItem
            key="complain"
            title="投诉与反馈"
            leftIcon="complain"
            onPress={onPressFeedback}
          />
          {/* <SettingItem
            title="分享"
            leftIcon="setting_share"
            onPress={onPressShare}
          /> */}

          <SettingItem
            key="about"
            title="关于小狸"
            leftIcon="about"
            onPress={onPressAbout}
          >
            <Text
              style={{
                color: 'rgba(0,0,0, 0.4)',
                fontWeight: '500',
                fontSize: 12
              }}
            >
              {versionStr}
            </Text>
          </SettingItem>
        </SettingGroup>
        <SettingGroup>
          <SettingItem
            key="signoff"
            title="退出登录"
            leftIcon="signoff"
            onPress={onPressLogout}
          />
        </SettingGroup>
      </View>
      {showInfo && (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            marginBottom: 20,
            justifyContent: 'center'
          }}
          onPress={async () => {
            await Clipboard.setStringAsync(
              getSettingsPagePublicInfo() +
                ` UID:${user?.uid} +  ${getChannel()}`
            );
            showToast('已复制信息至剪贴板');
            setShowInfo(false);
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              color: colorsUI.Text.default.subtle,
              fontSize: 12
            }}
          >
            {getSettingsPagePublicInfo()}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: colorsUI.Text.default.subtle,
              fontSize: 12
            }}
          >
            UID:{user?.uid}
          </Text>
        </TouchableOpacity>
      )}
      <GestureDetector gesture={composed}>
        <View
          style={{
            marginBottom: 20,
            alignItems: 'center'
          }}
        >
          <Text style={{ fontSize: 12, color: colorsUI.Text.default.subtle }}>
            {versionStr}
          </Text>
        </View>
      </GestureDetector>

      <DevSheet
        visible={showDev}
        onClose={() => {
          setShowDev(false);
        }}
      />
    </Screen>
  );

  function onPressLogout() {
    showConfirm({
      title: '退出登录',
      content: '退出登录后不会丢失任何数据，你仍可以登录此账号使用狸谱',
      confirmText: '退出登录',
      cancelText: '取消',
      onConfirm: async ({ close }) => {
        showLoading();
        // try {
        //   console.log(11111111111, StreamClient.logout);
        StreamLogout();
        // } catch (e) {
        //   console.log('error----', e);
        // }
        signOff()
          .then(() => {
            // setSignOffConfirmVisible(false);
            // router.replace('/feed/');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'feed/index' }]
              })
            );
            close();
            hideLoading();
            showToast('退出成功');
            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: '/feed/' }]
            // });
          })
          .catch(() => {
            showToast('退出登录失败');
            hideLoading();
          });
      }
    });
  }
}
