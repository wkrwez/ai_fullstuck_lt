import { ReactNode, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import * as NumberAuthLogic from '@step.ai/number-auth';
import {
  NumberAuthConfig,
  NumberAuthConfig_AttributedText
} from '@step.ai/number-auth/src/proto/number_auth_config_pb';
import { NumberAuthStore } from './store';
import {
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getBoundingRect,
  getTextStyle,
  resolveImageURL
} from './utils';

interface NumberAuthLoginButtonProps {
  style?: NumberAuthViewStyle & NumberAuthTextStyle;
  backgroundImage?: ImageSourcePropType;
  loadingBackgroundmage?: ImageSourcePropType;
  disabledBackgroundmage?: ImageSourcePropType;
  children?: string;
}
export function NumberAuthLoginButton(props: NumberAuthLoginButtonProps) {
  useEffect(() => {
    const loginBtnText = new NumberAuthConfig_AttributedText();
    const { textColor, textFontSize, textWeight } = getTextStyle(
      props.style || {}
    );
    loginBtnText.text = props.children || '本机号码一键登录';
    loginBtnText.textColor = textColor;
    loginBtnText.textFontSize = textFontSize;
    loginBtnText.textWeight = textWeight;
    NumberAuthStore.updateConfig({
      loginBtnText
    });
    if (props.style) {
      NumberAuthStore.updateConfig({
        loginBtnFrame: getBoundingRect(props.style)
      });
    }

    if (props.backgroundImage) {
      const bgImg = resolveImageURL(props.backgroundImage);
      const loginBtnBgImgUrls = [bgImg, bgImg, bgImg];
      if (props.loadingBackgroundmage) {
        loginBtnBgImgUrls[1] = resolveImageURL(props.loadingBackgroundmage);
      }
      if (props.disabledBackgroundmage) {
        loginBtnBgImgUrls[1] = resolveImageURL(props.disabledBackgroundmage);
      }

      NumberAuthStore.updateConfig({ loginBtnBgImgUrls });
    }
  }, []);
  return null;
}
