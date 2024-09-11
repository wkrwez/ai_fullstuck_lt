import { hideLoading } from '@/src/components';
import { useCreditStore } from '@/src/store/credit';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { logWarn } from '@/src/utils/error-log';
import {
  GameType,
  InvokeType
} from '@/proto-registry/src/web/raccoon/common/types_pb';

export const strategyUpdateHandle = async (invokeType: InvokeType) => {
  try {
    // 遇到错误，更新总量
    useCreditStore.getState().syncCredits();
    // 遇到错误，更新积分策略
    const res = await useCreditStore.getState().getIPStrategy([
      {
        index: Math.floor(Math.random() * 1000), // 随机唯一主键,
        invokeType: invokeType || InvokeType.INVOKE_UNKNOWN,
        gameType: GameType.DRAWING,
        brand: useMakePhotoStoreV2.getState().role1?.ip
      }
    ]);
    // 更新策略
    useCreditStore.getState().updateStrategy(res.consumptions[0]);
    hideLoading();
  } catch (error) {
    hideLoading();
    logWarn('points strategy update error', error);
  }
};
