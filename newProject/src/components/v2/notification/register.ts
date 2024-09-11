import { useMessageStore } from '@/src/store/message';
import Getui from '@step.ai/getui-push-module';
import { checkNotification } from './util';

/** 首次 */
export const firstOpenNotificationSettings = async (
  successCallback?: () => void
) => {
  Getui.requestAuthorization();
  // useMessageStore.getState().getuiInit();
  // useMessageStore.getState().getuiInitService();
  successCallback?.();
};

export const openNotificationSettings = async (
  successCallback?: () => void
) => {
  // useMessageStore.getState().getuiInitService();
  const res = await Getui.openNotificationSettings();
  res && successCallback?.();
};

export const registerNotification = async (successCallback?: () => void) => {
  const status = await checkNotification();
  console.log(status, 'status===');
  if (status === 0) {
    firstOpenNotificationSettings(successCallback);
  }
  if (status === 1) {
    openNotificationSettings(successCallback);
  }
};
