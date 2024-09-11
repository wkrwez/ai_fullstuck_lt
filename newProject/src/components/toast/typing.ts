import { ReactNode } from 'react';

export interface IToastModalProps {
  visible: boolean;
  onChangeVisible: (visible: boolean) => void;
  content: string | ReactNode;
  duration?: number; //-1 代表不自动消失
  enableEvents?: boolean;
}

export interface IToastProviderProps {}
