import { PickPbQueryParams } from '../utils';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import { World } from '@/proto-registry/src/web/raccoon/world/world_connect';
import { PartialMessage } from '@bufbuild/protobuf';
import {
  /* 3.生成新世界线的转折点(小狸帮想) */
  CreatePlotChoiceReq,
  CreatePlotChoiceRes,
  /* 5.生成新剧情章节(根据【平行世界id】生成剧情) */
  CreatePlotReq,
  CreatePlotRes,
  /* 4.生成新平行世界(开启新时间线 -> 获取【平行世界id】) */
  CreateWorldReq,
  CreateWorldRes,
  /* 1. 查询转折点列表 */
  QueryChoicesReq,
  QueryChoicesRes,
  /* 2.查询剧情走向标签 */
  QueryPlotTagsReq,
  QueryPlotTagsRes
} from '@step.ai/proto-gen/raccoon/world/world_pb';

const parallelWorldClient = createSocketConnect('World', World);

/* 1. 查询转折点列表 */
type PlotChoicesRequest = PickPbQueryParams<QueryChoicesReq>;
const queryPlotChoices = (payload: PlotChoicesRequest) => {
  return parallelWorldClient.queryChoices(payload);
};
export { PlotChoicesRequest, queryPlotChoices };

/* 2. 查询剧情走向标签 */
type PlotTagsRequest = PickPbQueryParams<QueryPlotTagsReq>;
const queryPlotTags = (payload: PlotTagsRequest) => {
  return parallelWorldClient.queryPlotTags(payload);
};
export { PlotTagsRequest, queryPlotTags };

/* 3. 生成新世界线的转折点(小狸帮想) */
type CreatePlotChoiceRequest = PickPbQueryParams<CreatePlotChoiceReq>;
const createPlotChoice = (
  payload: CreatePlotChoiceRequest,
  cb: (payload: PartialMessage<CreatePlotChoiceRes>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  return stream(parallelWorldClient.createPlotChoice, payload)
    .on(({ data }) => {
      cb(data);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};
export { CreatePlotChoiceRequest, createPlotChoice };

/* 4. 生成新平行世界(开启新时间线 -> 获取【平行世界id】) */
type CreateWorldRequest = PickPbQueryParams<CreateWorldReq>;
const createWorld = (payload: CreateWorldRequest) => {
  return parallelWorldClient.createWorld(payload);
};
export { CreateWorldRequest, createWorld };

/* 5. 生成新剧情章节(根据【平行世界id】生成剧情) */
type CreatePlotRequest = Omit<PickPbQueryParams<CreatePlotReq>, 'nonce'>;
type CreatedAct = PartialMessage<CreatePlotRes>;
const createPlot = (
  payload: CreatePlotRequest,
  cb: (payload: PartialMessage<CreatePlotRes>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  return stream(parallelWorldClient.createPlot, payload)
    .on(({ data }) => {
      cb(data);
    })
    .error(({ error }) => {
      onError(error);
    })
    .do();
};
export { CreatePlotRequest, createPlot, CreatedAct };
