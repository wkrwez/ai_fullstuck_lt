import { createSocketConnect } from '../websocket/connect';
import { Empty, PartialMessage } from '@bufbuild/protobuf';
import {
  BindClientIdReq,
  BindClientIdRsp
} from '@step.ai/proto-gen/raccoon//offsite/offsite_pb';
import { Offsite } from '@step.ai/proto-gen/raccoon/offsite/offsite_connect';

const pushClient = createSocketConnect('Offsite', Offsite);

export const pushInitService = (paylaod: PartialMessage<BindClientIdReq>) => {
  return pushClient.bindClientId(paylaod);
};
