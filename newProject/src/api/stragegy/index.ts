import { createSocketConnect } from '../websocket/connect';
import { Strategy } from '@/proto-registry/src/web/raccoon/strategy/strategy_connect';
import { QueryConsumptionParam } from '@/proto-registry/src/web/raccoon/strategy/strategy_pb';

export const strategyClient = createSocketConnect('Strategy', Strategy);

/** 获取积分展示策略 */
export const getCreditByIPandRole = (queryParams: QueryConsumptionParam[]) => {
  return strategyClient.getConsumptions({
    params: queryParams || []
  });
};
