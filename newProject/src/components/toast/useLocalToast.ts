import { useMemoizedFn } from 'ahooks';
import { useState } from 'react';
import { IToastModalProps } from './typing';

export function useLocalToast(): IToastModalProps & {
  showToast: (
    content: IToastModalProps['content'],
    duration?: number,
    enableEvents?: boolean
  ) => void;
  hideToast: () => void;
} {
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(1000);
  const [enableEvents, setEnableEvents] = useState(false);

  const [content, setContent] = useState<IToastModalProps['content']>('');

  const showToast = useMemoizedFn(
    (
      content: IToastModalProps['content'],
      duration?: number,
      enableEvents?: boolean
    ) => {
      if (content) {
        setVisible(true);
        setDuration(duration || 1000);
        setContent(content);
        setEnableEvents(enableEvents || false);
      }
    }
  );

  const hideToast = useMemoizedFn(() => {
    setVisible(false);
    setContent('');
  });

  return {
    showToast,
    hideToast,
    visible,
    duration,
    enableEvents,
    content,
    onChangeVisible: setVisible
  };
}
