import { useCallback, useMemo, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { AGREEMENT_URL, PRIVACY_URL } from '@/src/constants';
import { spacing } from '@/src/theme';
import { Button } from '../button';
import { Text } from '../text';
import { WebviewModal } from '../webview';
import { SheetModal } from './SheetModal';

export interface PrivacyPolicyProps {
  onConfirm: () => void;
}

type LINK = {
  url: string;
  title: string;
};

export const PolicyModal = (props: PrivacyPolicyProps) => {
  const { onConfirm } = props;
  const [step, setStep] = useState(1);
  const [link, setLink] = useState<LINK | null>(null);

  const agreeLink = useMemo(
    () => (
      <Text
        preset="link"
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

  const renderPolicy = useCallback(() => {
    if (step === 1) {
      return (
        <>
          <View>
            <Text style={{ marginBottom: spacing.sm }}>
              感谢您信任并使用狸谱。 本提示将通过{agreeLink}与{policyLink}
              帮助你了解我们如何收集、处理个人信息。
            </Text>
            <Text>
              1.
              我们可能会申请系统设备权限收集设备信息、日志信息,用于推送和安全风控，并申请存储权限，用于下载及缓存相关文件。
              App 提供基本服务。
            </Text>
            <Text>
              2.
              麦克风、相册(上传、存储)等权限均不会默认或强制开启收集信息。你有权拒绝开启，拒绝授权不会影响
              App 提供基本服务。
            </Text>
          </View>

          <View style={$privacyContainerStyle}>
            <Button style={$privacyLeftBtnStyle} onPress={() => setStep(2)}>
              不同意
            </Button>
            <Button
              preset="primary"
              style={$privacyRightBtnStyle}
              textStyle={{
                fontWeight: 'bold'
              }}
              onPress={onConfirm}
            >
              同意
            </Button>
          </View>
        </>
      );
    } else {
      return (
        <>
          <Text>
            你需要同意{agreeLink}与{policyLink}后才能使用狸谱。
            如果你不同意，很遗憾我们无法为您提供服务。
          </Text>
          <View style={$privacyContainerStyle}>
            <Button
              style={$privacyLeftBtnStyle}
              onPress={() => {
                // DANGEROUS Code
                RNExitApp.exitApp();
              }}
            >
              暂不使用
            </Button>
            <Button
              preset="primary"
              style={$privacyRightBtnStyle}
              textStyle={{
                fontWeight: 'bold'
              }}
              onPress={onConfirm}
            >
              同意并继续
            </Button>
          </View>
        </>
      );
    }
  }, [onConfirm, step, setStep]);

  return !link ? (
    <SheetModal
      isVisible
      titleStyle={{
        fontSize: 20
      }}
      closeBtn={<></>}
      onClose={() => {}}
      maskOpacity={0.5}
      title={step === 1 ? '用户协议与隐私政策提示' : '温馨提示'}
    >
      {renderPolicy()}
    </SheetModal>
  ) : (
    <WebviewModal
      onClose={() => setLink(null)}
      isVisible
      url={link.url}
      title={link.title}
    />
  );
};

const $privacyContainerStyle: ViewStyle = {
  flexDirection: 'row',
  marginTop: spacing.lg,
  marginBottom: spacing.sm
};

const $privacyLeftBtnStyle: ViewStyle = {
  flex: 1,
  marginRight: spacing.sm
};
const $privacyRightBtnStyle: ViewStyle = {
  flex: 1,
  marginLeft: spacing.sm
};
