import { useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import { NumberAuthConfig } from '@step.ai/number-auth/src/proto/number_auth_config_pb';
import { NumberAuthStore } from './store';
import {
  Color,
  NumberAuthAlignment,
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getAlign,
  getBoundingRect,
  getHex,
  getTextStyle,
  resolveImageURL
} from './utils';

interface PrivacyItem {
  text: string;
  url: string;
}
interface NumberAuthPrivacyProps {
  style?: NumberAuthViewStyle &
    NumberAuthTextStyle & {
      textAlign?: NumberAuthAlignment;
      linkColor?: Color;
    };

  checkBoxImageUrls?: ImageSourcePropType[];
  privacys?: PrivacyItem[];
  privacyConfig?: {
    privacyPreText?: string;
    privacySufText?: string;
    privacyConectTexts?: string[];
    privacyOperatorPreText?: string;
    privacyOperatorSufText?: string;
  };
}

type privacyName = 'privacyOne' | 'privacyTwo' | 'privacyThree';

export function NumberAuthPrivacy(props: NumberAuthPrivacyProps) {
  useEffect(() => {
    if (props.style) {
      const privacyFrame = getBoundingRect(props.style);
      if (!props.style.left && !props.style.right) {
        NumberAuthStore.updateConfig({
          privacyOffsetY: props.style.top || 0
        });
      } else {
        NumberAuthStore.updateConfig({
          privacyFrame
        });
      }
      const { textColor, textFontSize } = getTextStyle(props.style);
      const linkColor = getHex(props.style.linkColor);
      NumberAuthStore.updateConfig({
        privacyFontSize: textFontSize,
        privacyColors: [textColor, linkColor || textColor]
      });
      if (props.style.textAlign) {
        NumberAuthStore.updateConfig({
          privacyAlignment: getAlign(props.style.textAlign)
        });
      }
    }

    if (props.privacys) {
      const keys: privacyName[] = ['privacyOne', 'privacyTwo', 'privacyThree'];
      const config: {
        [key in privacyName]?: string[];
      } = {};
      props.privacys.forEach((item, index) => {
        config[keys[index]] = [item.text, item.url];
      });

      // todo type
      if (config.privacyOne) {
        NumberAuthStore.updateConfig({
          privacyOne: config.privacyOne
        });
      }
      if (config.privacyTwo) {
        NumberAuthStore.updateConfig({
          privacyTwo: config.privacyTwo
        });
      }
      if (config.privacyThree) {
        NumberAuthStore.updateConfig({
          privacyThree: config.privacyThree
        });
      }
    }

    if (props.privacyConfig) {
      // @ts-ignore todo
      NumberAuthStore.updateConfig(props.privacyConfig);
    }

    if (props.checkBoxImageUrls) {
      NumberAuthStore.updateConfig({
        checkBoxImageUrls: props.checkBoxImageUrls.map(i => resolveImageURL(i))
      });
    }
  }, []);
  return null;
}
