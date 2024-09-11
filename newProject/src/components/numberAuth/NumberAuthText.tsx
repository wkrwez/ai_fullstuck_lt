import { useEffect } from 'react';
import {
  NumberAuthConfig_AttributedText,
  NumberAuthConfig_CustomView
} from '@step.ai/number-auth/src/proto/number_auth_config_pb';
import { NumberAuthStore } from './store';
import {
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getBoundingRect,
  getTextStyle
} from './utils';

interface NumberAuthTextProps {
  style?: NumberAuthTextStyle & NumberAuthViewStyle;
  view?: NumberAuthConfig_CustomView;
  children?: string;
  onPress?: () => void;
}

export function NumberAuthText(props: NumberAuthTextProps) {
  useEffect(() => {
    const { style, children } = props;
    const view = new NumberAuthConfig_CustomView();
    const attributedText = new NumberAuthConfig_AttributedText();
    attributedText.text = children || '';

    if (style) {
      view.frame = getBoundingRect(style);
      const { textColor, textFontSize } = getTextStyle(style);
      attributedText.textColor = textColor;
      attributedText.textFontSize = textFontSize;
      view.text = attributedText;
    }

    if (props.onPress) {
    }

    const { customViews } = NumberAuthStore.config;
    NumberAuthStore.updateConfig({
      customViews: (customViews || []).concat(view)
    });
  }, []);
  return null;
}
