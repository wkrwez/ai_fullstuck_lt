import { getVersionStr } from '@/src/utils/getVersion';
import { channel, extraData } from '@step.ai/app-info-module';

export const getChannel = () => {
  if (channel === 'TestFlight' || getVersionStr() === '1.1.5 (172)') {
    return 'creator';
  }
  return channel;
};
