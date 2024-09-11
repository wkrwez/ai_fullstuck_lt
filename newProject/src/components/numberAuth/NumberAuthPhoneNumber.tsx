import { useEffect } from 'react';
import { NumberAuthStore } from './store';
import {
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getBoundingRect,
  getTextStyle
} from './utils';

export interface NumberAuthPhoneNumberProps {
  style?: NumberAuthViewStyle & NumberAuthTextStyle;
}

export function NumberAuthPhoneNumber(props: NumberAuthPhoneNumberProps) {
  useEffect(() => {
    if (props.style) {
      const numberFrame = getBoundingRect(props.style);
      if (!props.style.left && !props.style.right) {
        NumberAuthStore.updateConfig({
          numberOffsetY: props.style.top || 0
        });
      } else {
        NumberAuthStore.updateConfig({
          numberFrame
        });
      }
      const { textColor, textFontSize, textWeight } = getTextStyle(props.style);
      NumberAuthStore.updateConfig({
        numberFontSize: textFontSize,
        numberColor: textColor,
        numberFontWeight: textWeight
      });
    }
  }, []);
  return null;
}
