import React, { ReactNode } from 'react';
import { KeyboardAvoidingViewProps, TextStyle, ViewStyle } from 'react-native';
import { ButtonProps } from '@Components/index';
import { PortalProps } from '@gorhom/portal/lib/typescript/components/portal/types';

export type RenderSheetFunction = (sheet: {
  close: () => void;
}) => React.ReactNode;

// export const isIos = Platform.OS === 'ios';

export type SheetConfig = {
  content: RenderSheetFunction;
  title?: string | ReactNode;
  titleStyle?: TextStyle;
  titleBarStyle?: ViewStyle;
  closeBtn?: ReactNode | null;
  maskClosable?: boolean;
  onClose?: () => void;
  useKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  childrenPadding?: boolean;
  maskShown?: boolean; // 是否移除mask
};

export interface SheetModalProps {
  isVisible: boolean;
  style?: ViewStyle;
  title?: string | ReactNode;
  titleStyle?: TextStyle;
  titleBarStyle?: ViewStyle;
  onClose: () => void;
  onShow?: () => void;
  // 出现动效结束后回调
  onShowAnimationDone?: () => void;
  maskOpacity?: number;
  maskClosable?: boolean;
  maskChildren?: React.ReactNode;
  children?: React.ReactNode;
  dragable?: boolean;
  closeBtn?: ReactNode | null;
  childrenPadding?: boolean;
  maskShown?: boolean; // 是否移除mask
  zIndex?: number;
  theme?: 'dark' | 'light';
  /**
   * SheetModal 由于在 _Layout 最根节点的组件当中，所以 Screen 组件中的 KeyboardAvoidingView 无法让 SheetModal 中的输入框生效，所以 SheetModal 加了下
   */
  portalProps?: PortalProps;
  useKeyboardAvoidingView?: boolean;
  keyboardAvoidingViewProps?: KeyboardAvoidingViewProps;
  remainHeight?: number;
  onGesture?: (v: number) => void;
  onDismiss?: () => void;
}

export const MAX_TRANSLATE = 1000;

export type ConfirmSheetConfig = SheetConfig & {
  cancelButtonProps?: ButtonProps;
  confirmButtonProps?: ButtonProps;
  onCancel?: (props: { close: () => void }) => void;
  onConfirm?: (props: { close: () => void }) => void;
  confirmBtnStyle?: ViewStyle;
};

export interface SheetContextProps {
  showSheet: (config: SheetConfig) => void;
  showConfirmSheet: (config: ConfirmSheetConfig) => void;
}
