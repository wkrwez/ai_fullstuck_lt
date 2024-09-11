import { ReactNode, useEffect } from 'react';
import { ImageSourcePropType } from 'react-native';
import { uuid } from '@/src/utils/uuid';
import * as NumberAuthLogic from '@step.ai/number-auth';
import {
  NumberAuthConfig,
  NumberAuthConfig_CustomView
} from '@step.ai/number-auth/src/proto/number_auth_config_pb';
import { NumberAuthStore } from './store';
import {
  NumberAuthTextStyle,
  NumberAuthViewStyle,
  getBoundingRect,
  getTextStyle,
  resolveImageURL
} from './utils';

export interface NumberAuthCustomViewProps {
  style?: NumberAuthViewStyle;
  backgroundImage?: ImageSourcePropType;
  onPress?: () => void;
  text?: { style?: NumberAuthTextStyle; text: string };
  children?: (view: NumberAuthConfig_CustomView) => ReactNode;
  // callbackName?: string;
}
export function NumberAuthCustomView(props: NumberAuthCustomViewProps) {
  useEffect(() => {
    const view = new NumberAuthConfig_CustomView();
    if (props.backgroundImage) {
      view.imageUrl = resolveImageURL(props.backgroundImage);
    }

    if (props.style) {
      view.frame = getBoundingRect(props.style);
    }

    if (props.onPress) {
      const callbackName = uuid();
      view.callbackEventName = callbackName;
      NumberAuthStore.callbacks[callbackName] = props.onPress;
    }

    const { customViews } = NumberAuthStore.config;
    NumberAuthStore.updateConfig({
      customViews: (customViews || []).concat(view)
    });
  }, []);

  return null;
}
