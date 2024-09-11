import { createSocketConnect } from '../websocket/connect';
import { Reward } from '@/proto-registry/src/web/raccoon/reward/reward_connect';

export const rewardClient = createSocketConnect('Reward', Reward);

/** 获取积分展示策略 */
export const getTaskByReward = async () => {
  return rewardClient.getRewardTasks({});
};
