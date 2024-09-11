import { Text } from 'react-native';
import { create } from 'zustand';
import {
  UpdateCreditMessageNum,
  UpdateCreditTaskGot
} from '../api/message/credit';
import { getCreditByCrossDay, getTotalPoints } from '../api/points';
import { getCreditByIPandRole } from '../api/stragegy';
import { showToast } from '../components';
import { logWarn } from '../utils/error-log';
import { RewardTaskType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import {
  ConsumptionResult,
  GetConsumptionsRsp,
  QueryConsumptionParam
} from '@/proto-registry/src/web/raccoon/strategy/strategy_pb';

type States = {
  totalCredits: number;
  localPoints: number;
  localRewardToast: string;
  consumption: ConsumptionResult;
  triggerType: RewardTaskType;
};

type Actions = {
  checkAlreadyLoginCredit: () => void; // 0：0:30 登录
  setTotalCredits: (credit: number) => void; // 设置总积分
  updateCreditToast: (rewardToast: string, points: number) => void; // 设置 积分获取
  updateCreditTriggerType: (type: RewardTaskType) => void;
  syncCredits: () => void;
  init: () => void;
  getIPStrategy: (
    queryParams: Partial<QueryConsumptionParam>[]
  ) => Promise<GetConsumptionsRsp>;
  updateStrategy: (consumption: ConsumptionResult) => void;
  resetRewardToast: () => void;
};

const resetState = () => {
  return {
    totalCredits: 0,
    localPoints: 0,
    localRewardToast: '',
    triggerType: RewardTaskType.UNKNOWN,
    consumption: {} as ConsumptionResult
  };
};

export const useCreditStore = create<States & Actions>()((set, get) => ({
  ...resetState(),
  reset() {
    set({ ...resetState() });
  },
  init() {
    UpdateCreditMessageNum(({ points }) => {
      points && showToast(`小狸为你送来${points}狸电池，电力满满~`, 3000, true);
    });
  },
  async checkAlreadyLoginCredit() {
    try {
      const points = await getCreditByCrossDay();
      points && showToast(`小狸为你送来${points}狸电池，电力满满~`, 3000, true);
    } catch (error) {
      logWarn('[login already error credit]', error);
    }
  },
  setTotalCredits(credit: number) {
    set({ totalCredits: credit });
  },
  updateCreditToast(rewardToast: string, points: number) {
    set({
      localPoints: points,
      localRewardToast: rewardToast
    });
  },
  updateCreditTriggerType(type: RewardTaskType) {
    set({
      triggerType: type
    });
  },
  resetRewardToast() {
    set({
      localPoints: 0,
      localRewardToast: ''
    });
  },
  async syncCredits() {
    const credit = await getTotalPoints();
    set({
      totalCredits: credit
    });
  },
  async getIPStrategy(queryParams: Partial<QueryConsumptionParam>[]) {
    return getCreditByIPandRole(queryParams as QueryConsumptionParam[]);
  },
  updateStrategy(consumption: ConsumptionResult) {
    set({
      consumption: consumption
    });
  }
}));
