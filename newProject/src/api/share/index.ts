import { createSocketConnect } from '../websocket/connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import { Share } from '@step.ai/proto-gen/raccoon/share/share_connect';
import { GenerateSharePicRequest } from '@step.ai/proto-gen/raccoon/share/share_pb';

const queryClient = createSocketConnect('Share', Share);

export const GenerateSharePic = (
  payload: PartialMessage<GenerateSharePicRequest>
) => {
  return queryClient.generateSharePic(payload);
};

// 分享积分回调
export const ShareCallback = () => {
  return queryClient.shareCallback();
};
