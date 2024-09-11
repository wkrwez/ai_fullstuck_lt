import { PickPbQueryParams } from '../utils';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import { World } from '@/proto-registry/src/web/raccoon/world/world_connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  /* 生成内容标题(小狸帮想) */
  CreateWorldTitleReq,
  CreateWorldTitleRes,
  /* 发布到社区 */
  PublishWorldReq,
  PublishWorldRes
} from '@step.ai/proto-gen/raccoon/world/world_pb';

const parallelWorldClient = createSocketConnect('World', World);

/* 生成内容标题(小狸帮想) */
type CreateWorldTitleRequest = PickPbQueryParams<CreateWorldTitleReq>;
const createParallelWorldTitle = (
  payload: CreateWorldTitleRequest,
  cb: (payload: PartialMessage<CreateWorldTitleRes>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  return stream(parallelWorldClient.createWorldTitle, payload)
    .on(({ data }) => {
      cb(data);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};
export { CreateWorldTitleRequest, createParallelWorldTitle };

/* 发布到社区 */
type PublishWorldRequest = PickPbQueryParams<PublishWorldReq>;
const publishParallelWorld = (payload: PublishWorldRequest) => {
  return parallelWorldClient.publishWorld(payload);
};
export { PublishWorldRequest, publishParallelWorld };
