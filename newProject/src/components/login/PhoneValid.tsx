import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { FadeIn } from 'react-native-reanimated';
import { passportClient } from '@/src/api';
import { webviewPreview } from '@/src/components/webview';
import {
  AGREEMENT_URL,
  CITY_CODE,
  CountryAbbr,
  LOGIN_SCENE_REPORT,
  LOGIN_SHEET_ZINDEX,
  LOGON_TIT_IMAGE_MAP,
  PHONE_REG,
  PRIVACY_URL
} from '@/src/constants';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useTimeout } from '@/src/hooks/useTimeout';
import { useAppStore } from '@/src/store/app';
import { currentColors } from '@/src/theme';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportDiy, reportExpo } from '@/src/utils/report';
import { Image, ImageStyle } from '@Components/image';
import { showModal } from '@Components/modal';
import { PrimaryButton } from '@Components/primaryButton';
import { SheetModal } from '@Components/sheet';
import { Text } from '@Components/text';
import { showToast } from '@Components/toast';
import { StyleSheet } from '@Utils/StyleSheet';
import { dp2px } from '@Utils/dp2px';
import { Checkbox } from '../checkbox';
import { Icon } from '../icons';
import { hideLoading } from '../loading';
import { Code, ConnectError } from '@connectrpc/connect';
import { SignInRequest } from '@step.ai/proto-gen/proto/api/passport/v1/service_pb';
import { useShallow } from 'zustand/react/shallow';

/** 手机号验证*/
const TITLE_BG = require('@Assets/image/login/title_bg.png');
const LOGIN_TIT = require('@Assets/image/login/login_title_bg.png');
const MAX_TIME = 60;

const st = StyleSheet.create({
  $wrap: {
    backgroundColor: StyleSheet.currentColors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  $header: {
    position: 'relative',
    paddingTop: 12,
    ...StyleSheet.rowStyle
  },
  $iconBack: {
    position: 'absolute',
    top: 7.5,
    left: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  $titleBg: {
    position: 'relative',
    width: '100%',
    height: 29,
    resizeMode: 'contain'
  },
  $titleBorder: {
    position: 'relative',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: StyleSheet.typography.fonts.feed,
    color: StyleSheet.currentColors.white,
    transform: [{ scale: 1.02 }]
  },
  $linkText: {
    fontSize: 12,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54),
    fontWeight: '500'
  },
  $linkText2: {
    fontSize: 13,
    color: '#17639B'
  },
  $title: {
    top: 5,
    position: 'absolute',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: StyleSheet.typography.fonts.feed,
    color: StyleSheet.currentColors.titleGray
  },
  $inputBg: {
    ...StyleSheet.rowStyle,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    ...StyleSheet.circleStyle,
    width: 300,
    height: 44,
    backgroundColor: '#F8F8F8'
  },
  $phoneInputWrap: {
    marginTop: 34
  },
  $validCodeWrap: {
    marginTop: 12
  },
  $submitBtn: {
    ...StyleSheet.circleStyle,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 300,
    height: 44,
    marginTop: 19
  },
  $submitBtnText: {
    textAlign: 'center',
    fontWeight: '600',
    color: StyleSheet.currentColors.white
  },
  $phonePrefix: {
    fontSize: 14,
    color: StyleSheet.currentColors.black,
    fontFamily: StyleSheet.typography.fonts.feed,
    fontWeight: '600',
    lineHeight: 44
  },
  $line: {
    marginLeft: 10,
    marginRight: 0,
    width: 1,
    height: 12,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.1)
  },
  $phoneInput: {
    flex: 1,
    fontSize: 14,
    color: StyleSheet.currentColors.black
  },
  $placeholderTextPhone: {
    position: 'absolute',
    left: 63,
    top: 11,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.3)'
  },
  $placeholderTextVerifi: {
    position: 'absolute',
    left: 21,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.3)'
  },
  $sendValid: {
    color: '#FF4469',
    fontWeight: '500'
  },
  $sendValidDis: {
    opacity: 0.3
  },
  $footer: {
    ...StyleSheet.rowStyle,
    justifyContent: 'center',
    marginTop: 30
    // backgroundColor: 'red'
  },
  $footerText: {
    marginLeft: 6,
    marginBottom: 0.1,
    fontSize: 12,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.3)
  }
});

interface PhoneValidProps {
  visible: boolean;
  hasBack: boolean;
  privacyChecked: boolean;
  scene?: string;
  onSuccess: () => void;
  onReturn: () => void;
  onClose: () => void;
  onPrivacyChecked: (v?: boolean) => void;
}
export function PhoneValid(props: PhoneValidProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['bottom']);
  const [placeholdertext, setPlaceholdertext] = useState({
    placeholder1: '请输入手机号码',
    placeholder2: '请输入6位数验证码'
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [realPhone, setRealPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [valid, setValid] = useState(false);
  const { time, setTime } = useTimeout(MAX_TIME);
  const validIputRef = useRef<TextInput>(null);
  const { signIn } = useAppStore(
    useShallow(state => ({
      // isAgree: state.isAgree,
      // switchAgree: state.switchAgree,
      signIn: state.signIn
    }))
  );
  const originalNUM = useRef(0);
  const agreeRef = useRef(false);
  const validRef = useRef(false);
  const [city, setCity] = useState<CountryAbbr>('CN');
  const validPhone = useMemo(() => {
    return phoneCheck({ code: city, phone: realPhone });
  }, [realPhone]);

  useEffect(() => {
    agreeRef.current = props.privacyChecked;
  }, [props.privacyChecked]);

  useEffect(() => {
    validRef.current = valid;
  }, [valid]);

  useEffect(() => {
    hideLoading();
  }, []);

  const updatePlaceholder1 = (newPlaceholder1: string) => {
    setPlaceholdertext(prevState => ({
      ...prevState,
      placeholder1: newPlaceholder1
    }));
  };

  const updatePlaceholder2 = (newPlaceholder2: string) => {
    setPlaceholdertext(prevState => ({
      ...prevState,
      placeholder2: newPlaceholder2
    }));
  };

  const { scene = 'common' } = props || {};

  useEffect(() => {
    if (props.visible) {
      reportDiy('login', 'phone-expo', {
        log_scene: LOGIN_SCENE_REPORT[scene]
      });
    }
  }, [props.visible, scene]);

  const titleBg = LOGON_TIT_IMAGE_MAP[scene] || LOGIN_TIT;
  return (
    <SheetModal
      zIndex={LOGIN_SHEET_ZINDEX}
      remainHeight={0}
      maskShown={true}
      isVisible={props.visible}
      maskOpacity={0.4}
      maskClosable={true}
      closeBtn={true}
      dragable={false}
      titleBarStyle={{ display: 'none' }}
      onClose={() => {
        props.onClose();
        // webviewHide();
      }}
    >
      <View style={[st.$wrap]}>
        <View style={st.$header}>
          <Image
            pointerEvents="none"
            source={titleBg}
            style={st.$titleBg as ImageStyle}
          />
          {props.hasBack && (
            <TouchableOpacity
              style={st.$iconBack}
              onPress={() => {
                reportDiy('login', 'phone-click', {
                  log_phone_button: '1',
                  log_scene: LOGIN_SCENE_REPORT[scene]
                });
                props.onReturn && props.onReturn();
              }}
            >
              <Icon icon="back" size={24} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[st.$inputBg, st.$phoneInputWrap]}>
          <Text style={st.$phonePrefix}>+86</Text>
          <View style={st.$line}></View>
          {placeholdertext.placeholder1 && (
            <Text style={st.$placeholderTextPhone}>
              {placeholdertext.placeholder1}
            </Text>
          )}
          <TextInput
            value={phoneNumber}
            allowFontScaling={false}
            keyboardType="phone-pad"
            style={[
              st.$phoneInput,
              {
                paddingLeft: 10,
                fontWeight: '500',
                position: 'relative'
              },
              phoneNumber.length
                ? { fontFamily: StyleSheet.typography.fonts.feed }
                : { fontFamily: 'pingfang' }
            ]}
            onFocus={() => {
              reportDiy('login', 'phone-click', {
                log_phone_button: '2',
                log_scene: LOGIN_SCENE_REPORT[scene]
              });
              updatePlaceholder1('');
            }}
            onBlur={() => handlePlaceholderPhone()}
            onChangeText={text => {
              const formattedText = formatPhoneNumber(text);
              setPhoneNumber(formattedText);
              setRealPhone(formattedText.replace(/\s+/g, ''));
              // if (/^(\d+|)$/.test(text)) {
              //   // setPhoneNumber(text);
              // }
            }}
          />
        </View>
        {valid && (
          <View style={[st.$inputBg, st.$validCodeWrap]}>
            {placeholdertext.placeholder2 && (
              <Text style={st.$placeholderTextVerifi}>
                {placeholdertext.placeholder2}
              </Text>
            )}
            <TextInput
              value={verifyCode}
              allowFontScaling={false}
              inputMode="numeric"
              contextMenuHidden
              maxLength={6}
              autoCorrect={false}
              keyboardType="number-pad"
              onFocus={() => updatePlaceholder2('')}
              onBlur={() => handlePlaceholderText()}
              onChangeText={handleTextChange}
              ref={validIputRef}
              style={[
                st.$phoneInput,
                {
                  paddingLeft: 10,
                  fontWeight: '500',
                  position: 'relative'
                },

                verifyCode.length
                  ? { fontFamily: StyleSheet.typography.fonts.feed }
                  : { fontFamily: 'pingfang' }
              ]}
            />
            <TouchableOpacity
              onPress={() => {
                if (time) return;
                startVerfy();
              }}
            >
              <Text style={[st.$sendValid, time ? st.$sendValidDis : null]}>
                重新发送{time === 0 ? '' : `(${time}s)`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <PrimaryButton
          style={st.$submitBtn}
          width={315}
          height={46}
          textStyle={st.$submitBtnText}
          disableStyle="light"
          disabled={!validPhone}
          onPress={onSubmit}
        >
          登录并验证
        </PrimaryButton>
        <View style={st.$footer}>
          <Pressable
            onPress={() => {
              reportDiy('login', 'phone-click', {
                log_phone_button: '5',
                log_scene: LOGIN_SCENE_REPORT[scene]
              });
              props.onPrivacyChecked();
            }}
          >
            <Checkbox
              icon="checked"
              size={12}
              checked={props.privacyChecked}
              style={{
                backgroundColor: 'white',
                borderColor: currentColors.white1,
                borderWidth: 1.5,
                width: 12,
                height: 12
              }}
            />
          </Pressable>
          <Text style={st.$footerText}>
            已阅读并同意
            <Text
              style={st.$linkText}
              onPress={() =>
                webviewPreview({
                  url: AGREEMENT_URL,
                  title: '用户协议',
                  zIndex: LOGIN_SHEET_ZINDEX + 1
                })
              }
            >
              《用户协议》
            </Text>
            <Text
              style={st.$linkText}
              onPress={() =>
                webviewPreview({
                  url: PRIVACY_URL,
                  title: '隐私协议',
                  zIndex: LOGIN_SHEET_ZINDEX + 1
                })
              }
            >
              《隐私协议》
            </Text>
          </Text>
        </View>
      </View>
    </SheetModal>
  );

  function formatPhoneNumber(phoneNumber: string): string {
    phoneNumber = phoneNumber.replace(/\s+/g, '');
    let formattedNumber = '';

    for (let i = 0; i < phoneNumber.length; i++) {
      formattedNumber += phoneNumber[i];

      if (
        (i === 2 || (i > 2 && (i - 2) % 4 === 0)) &&
        i !== phoneNumber.length - 1
      ) {
        formattedNumber += ' ';
      }
    }

    return formattedNumber;
  }

  function onSubmit() {
    if (!validPhone) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!agreeRef.current) {
      showModal({
        title: '用户协议及隐私保护',
        content: (
          <Text
            style={{
              fontSize: 13,
              color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54)
            }}
          >
            已阅读并同意{' '}
            <Text
              style={st.$linkText2}
              onPress={() =>
                webviewPreview({
                  url: AGREEMENT_URL,
                  title: '用户协议'
                })
              }
            >
              《用户协议》
            </Text>
            <Text
              style={st.$linkText2}
              onPress={() =>
                webviewPreview({
                  url: PRIVACY_URL,
                  title: '隐私协议'
                })
              }
            >
              《隐私协议》
            </Text>
            以及 运营商服务协议，运营商将对你提供的手机号进行验证
          </Text>
        ),
        confirmText: '同意并登录',
        cancelText: '不同意',
        onConfirm: ({ close }) => {
          // switchAgree();
          props.onPrivacyChecked();
          close();
          startVerfy();
        },
        zIndex: LOGIN_SHEET_ZINDEX + 1
      });
      return;
    }
    if (!validRef.current) {
      startVerfy();
      return;
    }
    onLogin();
  }

  function sendVerifyCode() {
    passportClient.sendVerifyCode({
      mobileCc: CITY_CODE[city],
      mobileNum: realPhone
    });
  }

  function startVerfy() {
    reportDiy('login', 'phone-click', {
      log_phone_button: '3',
      log_scene: LOGIN_SCENE_REPORT[scene]
    });
    setValid(true);
    sendVerifyCode();
    setTime(MAX_TIME);
    setTimeout(() => {
      validIputRef.current?.focus();
    }, 10);
  }

  function handleTextChange(verifyCode: string) {
    if (!/^(\d+|)$/.test(verifyCode)) return;
    setVerifyCode(verifyCode);
  }

  function onLogin() {
    if (!phoneCheck({ code: city, phone: realPhone })) {
      showToast('请输入正确的手机号');
      return;
    }
    if (!codeCheck(verifyCode)) {
      showToast('请输入正确的验证码');
      return;
    }
    console.log(
      '验证码',
      verifyCode,
      '手机号',
      realPhone,
      'mobileCc',
      CITY_CODE[city]
    );
    reportDiy('login', 'phone-click', {
      log_phone_button: '4',
      log_scene: LOGIN_SCENE_REPORT[scene]
    });
    signIn(
      new SignInRequest({
        authCode: verifyCode,
        mobileNum: realPhone,
        mobileCc: CITY_CODE[city]
      })
    )
      .then(() => {
        props.onSuccess();
      })
      .catch(e => {
        reportDiy('login', 'login_result', {
          is_success: '2'
        });
        console.log('login error', e);
        logWarn('loginerror', e, 'RN.manual', false, { mobileNum: realPhone });
        if (e instanceof ConnectError) {
          if (e.code === Code.InvalidArgument) {
            showToast('验证码过期或错误，请重新输入');
            if (originalNUM.current === 3) {
              originalNUM.current = 0;
              showToast('请重新获取验证码');
              setTime(0);
            }
            originalState();
            return;
          }
        }
        showToast('验证码验证失败，请重新输入');
      });
  }

  function originalState() {
    originalNUM.current++;
  }

  function handlePlaceholderPhone() {
    if (placeholdertext.placeholder1.length === 0 && phoneNumber.length === 0) {
      updatePlaceholder1('请输入手机号码');
    } else {
      return '';
    }
  }

  function handlePlaceholderText() {
    if (placeholdertext.placeholder2.length === 0 && verifyCode.length === 0) {
      updatePlaceholder2('请输入6位数验证码');
    } else {
      return '';
    }
  }
}
type ValidPhoneType = { code: CountryAbbr; phone: string };

const phoneCheck = (params: ValidPhoneType) => {
  const { phone, code } = params;
  const reg = PHONE_REG[code];
  return reg.test(phone);
};

const codeCheck = (code: string) => {
  return /^\d{6}$/.test(code);
};
