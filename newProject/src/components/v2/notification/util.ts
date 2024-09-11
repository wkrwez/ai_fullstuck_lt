import Getui from '@step.ai/getui-push-module';

/** 检查是否被授权 [0 首次 1.被拒绝 2 成功] */
export const checkNotification = async () => {
  const status = await Getui.getAuthorizationStatus();
  return status;
};

/** 检查是否被授权成功 */
export const checkNotificationSuccess = async () => {
  const status = await Getui.getAuthorizationStatus();
  return status === 2;
};

/** 大于 3 天 */
export const checkIsOverThreeDays = (lastTime: number) => {
  // return Date.now() - lastTime > 5 * 1000; // 5s 测试
  return Date.now() - lastTime > 3 * 24 * 60 * 60 * 1000;
};

/** 大于一周 */
export const checkIsOverOneWeek = (lastTime: number) => {
  // return Date.now() - lastTime > 5 * 1000; // 5s 测试
  return Date.now() - lastTime > 7 * 24 * 60 * 60 * 1000;
};
