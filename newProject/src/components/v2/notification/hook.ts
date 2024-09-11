import { Dispatch, useEffect, useState } from 'react';
import { EnotiType, useStorageStore } from '@/src/store/storage';
import { reportExpo } from '@/src/utils/report';
import {
  checkIsOverOneWeek,
  checkIsOverThreeDays,
  checkNotificationSuccess
} from './util';

interface INotificationHookProps {
  expire: number;
  signal: EnotiType;
  lock?: boolean;
}

/**
 *
 * @param type 表示天数
 * @returns
 */
export default function useNotification({
  expire,
  signal,
  lock = false
}: INotificationHookProps) {
  /** 复制该段落代码,设定不同通知题型 */
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [initLock, setInitLock] = useState(lock);

  const store = useStorageStore();
  const __setStorage = store.__setStorage;

  useEffect(() => {
    const getNotification = async () => {
      const hasNoti = await checkNotificationSuccess();

      const checkDate = store[signal];
      if (hasNoti) {
        setNotificationVisible(false);
      } else {
        console.log(
          initLock,
          'initLock ===',
          expire,
          checkIsOverOneWeek(checkDate)
        );
        if (initLock) {
          // 如果不是初始展示，外部控制
          return;
        }
        if (
          !checkDate ||
          (checkIsOverThreeDays(checkDate) && expire === 3) ||
          (checkIsOverOneWeek(checkDate) && expire === 7)
        ) {
          setNotificationVisible(true);
          // reportExpo('all', {
          //   module: 'push',
          //   push_scene: signal
          // });
          __setStorage({
            [signal]: Date.now()
          });
        }
      }
    };
    getNotification();
  }, [initLock]);
  /** === 通知结束 === */

  return { notificationVisible, setNotificationVisible, setInitLock };
}
