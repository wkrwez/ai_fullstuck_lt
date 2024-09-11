import { useCallback, useEffect, useMemo, useState } from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { SPALASH_ZINDEX } from '@/src/constants';
import { AGREEMENT_URL, PRIVACY_URL } from '@/src/constants';
import { useAppStore } from '@/src/store/app';
import { colors } from '@/src/theme';
import { dp2px } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Image } from '@Components/image';
import { Screen } from '@Components/screen';
import { Text } from '@Components/text';
import { Webview } from '@Components/webview';
import { StyleSheet } from '@Utils/StyleSheet';
import { FullScreen } from '../fullscreen';
import { Modal } from '../modal';

const SLOGAN = require('@Assets/splash/slogan.png');
const LOGO = require('@Assets/splash/logo.png');

export interface SplashContentProps {
  // onConfirm: () => void;
}

type LINK = {
  url: string;
  title: string;
};

const $textStyle: TextStyle = {
  fontSize: dp2px(13),
  color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54),
  lineHeight: dp2px(20),
  fontWeight: '400'
};

export function SplashContent(props: SplashContentProps) {
  const [isVisible, setVisible] = useState(false);

  const [step, setStep] = useState(1);
  const [link, setLink] = useState<LINK | null>(null);

  const agreeLink = useMemo(
    () => (
      <Text
        preset="link"
        style={{ color: '#17639B' }}
        onPress={() => {
          setLink({
            url: AGREEMENT_URL,
            title: '用户协议'
          });
        }}
      >
        《用户协议》
      </Text>
    ),
    []
  );

  const policyLink = useMemo(
    () => (
      <Text
        preset="link"
        style={{ color: '#17639B' }}
        onPress={() => {
          setLink({
            url: PRIVACY_URL,
            title: '隐私政策'
          });
        }}
      >
        《隐私政策》
      </Text>
    ),
    []
  );

  const operationLink = useMemo(
    () => (
      <Text
        preset="link"
        style={{ color: '#17639B' }}
        onPress={() => {
          setLink({
            url: PRIVACY_URL,
            title: '运营商服务协议'
          });
        }}
      >
        《运营商服务协议》
      </Text>
    ),
    []
  );

  const renderPolicy = useCallback(() => {
    if (step === 1) {
      return (
        <Modal
          isVisible={step === 1 ? true : false}
          title="用户协议及隐私条款"
          confirmText="同意并继续"
          cancelText="不同意"
          onCancel={() => {
            setStep(2);
          }}
          content={
            <>
              <View>
                <Text style={$textStyle}>欢迎您来到狸谱！</Text>
              </View>
              <View>
                <Text style={$textStyle} numberOfLines={10}>
                  请充分阅读{agreeLink}和{policyLink}
                </Text>
              </View>
              <View>
                <Text style={$textStyle} numberOfLines={10}>
                  点击“同意并继续”按钮代表您已经同意当前协议及下列约定；为了给您提供预览服务和账号安全，我们会申请系统收集您的设备信息；
                </Text>
              </View>
              <View>
                <Text style={$textStyle}>
                  为了给您提供缓存服务，我们会申请系统访问权限
                </Text>
              </View>
            </>
          }
          onConfirm={() => {
            // setVisible(false);
            useAppStore.getState().setAgreePolicy(true);
          }}
        ></Modal>
      );
    } else {
      return (
        <Modal
          isVisible={step === 2 ? true : false}
          title="温馨提示"
          confirmText="同意并继续"
          cancelText="暂不使用"
          content={
            <>
              <Text style={$textStyle}>
                你需要同意{agreeLink}与{policyLink}
              </Text>
              <Text style={$textStyle}>
                {`后才能使用狸谱。如果你不同意，很遗憾我们无法为您提供服务。`}
              </Text>
            </>
          }
          onConfirm={() => {
            // setVisible(false);
            useAppStore.getState().setAgreePolicy(true);
          }}
          onCancel={() => {
            RNExitApp.exitApp();
          }}
        ></Modal>
      );
    }
  }, [step, setStep]);

  return (
    <>
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            paddingTop: 124,
            paddingBottom: 42,
            ...StyleSheet.columnStyle,
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: SPALASH_ZINDEX,
            backgroundColor: StyleSheet.currentColors.white
          }
        ]}
      >
        <Image
          source={SLOGAN}
          style={{ width: 261, height: 22, resizeMode: 'contain' }}
        />
        <Image source={LOGO} style={{ width: 97, height: 38 }} />
        {link ? (
          <FullScreen style={{ position: 'absolute' }}>
            <Screen
              title={link.title}
              backButton={false}
              headerLeft={() => (
                <TouchableOpacity
                  onPress={() => {
                    setLink(null);
                  }}
                >
                  <Icon icon="back" size={24} />
                </TouchableOpacity>
              )}
            >
              <Webview url={link.url} />
            </Screen>
          </FullScreen>
        ) : (
          renderPolicy()
        )}
      </View>
    </>
  );
}
