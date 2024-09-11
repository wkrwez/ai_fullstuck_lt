import { Socket } from '../websocket';
import { AcquireLoginPointsRsp } from '@/proto-registry/src/web/raccoon/points/login_pb';
import { AcquireRewardPointsRes } from '@/proto-registry/src/web/raccoon/reward/reward_pb';
import type { PartialMessage } from '@bufbuild/protobuf';

// 监听登录积分消息
export const UpdateCreditMessageNum = (
  cb: (data: PartialMessage<AcquireLoginPointsRsp>) => void
) => {
  Socket.events.on(`Points/AcquireLoginPoints`, body => {
    const data = AcquireLoginPointsRsp.fromBinary(body);
    cb(data);
  });
};

// 监听积分获得任务消息
export const UpdateCreditTaskGot = (
  cb: (data: PartialMessage<AcquireRewardPointsRes>) => void,
  p0: any
) => {
  Socket.events.on(`Reward/AcquireRewardPoints`, body => {
    const data = AcquireRewardPointsRes.fromBinary(body);
    console.log(data, 'bbbbbbbb');
    cb(data);
  });
};
