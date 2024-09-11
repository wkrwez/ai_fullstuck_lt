import { useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import { NumberAuthStore } from './store';
import {
  Color,
  NumberAuthAlignment,
  NumberAuthStyle,
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getAlign,
  getBorderRadius,
  getBoundingRect,
  getHex,
  getTextStyle,
  resolveImageURL
} from './utils';

type NumberAuthPrivacyAlertStyle = NumberAuthStyle &
  NumberAuthTextStyle & {
    backgroundColor?: Color;
    linkColor?: Color;
    textAlign?: NumberAuthAlignment;
  };
interface NumberAuthPrivacyAlertProps {
  style?: NumberAuthPrivacyAlertStyle;
  title?: string;
  maskShown?: boolean;
  maskColor?: Color;
  maskClosable?: boolean;
  titleStyle?: NumberAuthViewStyle &
    NumberAuthTextStyle & {
      backgroundColor?: Color;
      textAlign?: NumberAuthAlignment;
    };
  contentStyle?: NumberAuthViewStyle &
    NumberAuthTextStyle & {
      linkColor?: Color;
    };
  acceptButtonText?: string;
  acceptButtonBackgroundImages?: ImageSourcePropType[];
  acceptButtonStyle?: NumberAuthViewStyle &
    NumberAuthTextStyle & {
      linkColor?: Color;
      textAlign?: NumberAuthAlignment;
    };
  closeButton?: {
    style?: NumberAuthViewStyle;
    backgroundImage?: ImageSourcePropType;
  };
}

// todo privacyAlertContentOperatorFontSize privacyAlertOperatorColor privacyAlertCustomViews 属性未解析
export function NumberAuthPrivacyAlert(props: NumberAuthPrivacyAlertProps) {
  useEffect(() => {
    const privacyAlertIsNeedShow = true;
    const privacyAlertIsNeedAutoLogin = true;
    const {
      style,
      contentStyle,
      closeButton,
      titleStyle,
      acceptButtonText,
      acceptButtonStyle
    } = props;

    // modal style
    if (style) {
      const { textFontSize: buttonFontSize, textColor: buttonColor } =
        getTextStyle(acceptButtonStyle || {});
      const backgroundColor =
        typeof style.backgroundColor !== 'undefined'
          ? getHex(style.backgroundColor)
          : 0xffffffff;
      NumberAuthStore.updateConfig({
        privacyAlertIsNeedShow,
        privacyAlertIsNeedAutoLogin,
        privacyAlertBackgroundColor: backgroundColor,
        privacyAlertTitleContent: props.title || '请阅读并同意以下条款',
        privacyAlertCornerRadiusArray: getBorderRadius(style),
        privacyAlertBtnContent: acceptButtonText || '同意',

        privacyAlertFrame: getBoundingRect(style)
      });

      if (contentStyle) {
        const { textFontSize, textColor } = getTextStyle(contentStyle);
        console.log('contentStyle----', getBoundingRect(contentStyle));
        NumberAuthStore.updateConfig({
          privacyAlertPrivacyContentFrame: getBoundingRect(contentStyle),
          privacyAlertContentFontSize: textFontSize,
          privacyAlertContentBackgroundColor: backgroundColor,
          privacyAlertContentColors:
            typeof style.linkColor !== 'undefined'
              ? [textColor, getHex(style.linkColor) || 0x17639b]
              : [textColor, 0x17639b],
          privacyAlertContentAlignment: props.style?.textAlign
            ? getAlign(props.style?.textAlign)
            : 0
        });
      }

      if (acceptButtonStyle) {
        NumberAuthStore.updateConfig({
          privacyAlertButtonFrame: getBoundingRect(acceptButtonStyle),
          privacyAlertButtonTextColors: acceptButtonStyle?.linkColor
            ? [buttonColor, getHex(acceptButtonStyle?.linkColor) || buttonColor]
            : [buttonColor, buttonColor],
          privacyAlertButtonFontSize: buttonFontSize,
          privacyAlertButtonFontWeight: acceptButtonStyle.fontWeight
        });
      }

      if (props.acceptButtonBackgroundImages) {
        NumberAuthStore.updateConfig({
          privacyAlertBtnBackgroundImageUrls:
            props.acceptButtonBackgroundImages.map(i => resolveImageURL(i))
        });
      }
    }

    // title style
    if (titleStyle) {
      const {
        textFontSize: titleFontSize,
        textColor: titleColor,
        textWeight: titleFontWeight
      } = getTextStyle(titleStyle || {});
      NumberAuthStore.updateConfig({
        privacyAlertTitleFrame: getBoundingRect(titleStyle),
        privacyAlertTitleFontSize: titleFontSize,
        privacyAlertTitleColor: titleColor,
        privacyAlertTitleFontWeight: titleFontWeight,
        privacyAlertTitleAlignment:
          typeof props.titleStyle?.textAlign !== 'undefined'
            ? getAlign(props.titleStyle.textAlign)
            : 1, // 默认居中
        privacyAlertTitleBackgroundColor:
          typeof props.titleStyle?.backgroundColor !== 'undefined'
            ? getHex(props.titleStyle.backgroundColor)
            : 0xffffffff
      });
    }
    if (closeButton) {
      const privacyAlertCloseButtonIsNeedShow = true;
      NumberAuthStore.updateConfig({ privacyAlertCloseButtonIsNeedShow });
      if (closeButton.backgroundImage) {
        const privacyAlertCloseButtonImageUrl = resolveImageURL(
          closeButton.backgroundImage
        );
        NumberAuthStore.updateConfig({ privacyAlertCloseButtonImageUrl });
      }

      if (closeButton.style) {
        NumberAuthStore.updateConfig({
          privacyAlertCloseFrame: getBoundingRect(closeButton.style)
        });
      }

      if (typeof props.maskShown !== 'undefined') {
        NumberAuthStore.updateConfig({
          privacyAlertMaskIsNeedShow: props.maskShown
        });
      }
      if (typeof props.maskClosable !== 'undefined') {
        NumberAuthStore.updateConfig({
          tapPrivacyAlertMaskCloseAlert: props.maskClosable
        });
      }
      if (typeof props.maskColor !== 'undefined') {
        NumberAuthStore.updateConfig({
          privacyAlertMaskColor: getHex(props.maskColor)
        });
      }
    }
  }, []);
  return null;
}
