import { PickPbQueryParams } from '../utils';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import { World } from '@/proto-registry/src/web/raccoon/world/world_connect';
import { PartialMessage } from '@bufbuild/protobuf';
import {
  /* 换一换幕图片(重新生成图片) */
  CreateActImageReq,
  CreateActImageRes,
  /* 保存world信息 */
  SaveWorldReq,
  SaveWorldRes,
  /* 更新幕内容 */
  UpdatePlotActReq,
  UpdatePlotActRes
} from '@step.ai/proto-gen/raccoon/world/world_pb';

const parallelWorldClient = createSocketConnect('World', World);

/* 1.换一换幕图片(重新生成图片) */
type CreateActImageRequest = PickPbQueryParams<CreateActImageReq>;
type CreatedActImage = PartialMessage<CreateActImageRes>;
const createActImage = (
  payload: CreateActImageRequest,
  cb: (payload: PartialMessage<CreateActImageRes>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  return stream(parallelWorldClient.createActImage, payload)
    .on(({ data }) => {
      cb(data);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};
export { CreateActImageRequest, createActImage, CreatedActImage };

/* 2.更新幕内容 */
type UpdatePlotActRequest = PickPbQueryParams<UpdatePlotActReq>;
const uploadPlotAct = (payload: UpdatePlotActRequest) => {
  return parallelWorldClient.updatePlotAct(payload);
};
export { UpdatePlotActRequest, uploadPlotAct };

/* 3. 保存world信息 */
type SaveWorldReqRequest = PickPbQueryParams<SaveWorldReq>;
const saveWorld = (payload: SaveWorldReqRequest) => {
  return parallelWorldClient.saveWorld(payload);
};
export { SaveWorldReqRequest, saveWorld, SaveWorldRes };
