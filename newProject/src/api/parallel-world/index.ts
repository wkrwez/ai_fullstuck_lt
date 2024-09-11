import { PickPbQueryParams } from '../utils';
import { createSocketConnect } from '../websocket/connect';
import { World } from '@/proto-registry/src/web/raccoon/world/world_connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  /* 查询下一个章节剧情 */
  QueryPlotReq,
  QueryPlotRes,
  /* 从信息流进入，获取平行世界玩法内容 */
  QueryWorldReq,
  QueryWorldRes
} from '@step.ai/proto-gen/raccoon/world/world_pb';

const parallelWorldClient = createSocketConnect('World', World);

/* 从信息流进入，获取平行世界玩法内容 */
type QueryParallelWorldInfoRequest = PickPbQueryParams<QueryWorldReq>;
const queryParallelWorldInfo = (payload: PartialMessage<QueryWorldReq>) => {
  return parallelWorldClient.queryWorld(payload);
};
export { QueryParallelWorldInfoRequest, QueryWorldRes, queryParallelWorldInfo };

/* 查询下一个章节剧情 */
type ParallelWorldPlotRequest = PickPbQueryParams<QueryPlotReq>;
const queryParallelWorldPlot = (payload: PartialMessage<QueryPlotReq>) => {
  return parallelWorldClient.queryPlot(payload);
};
export { ParallelWorldPlotRequest, QueryPlotRes, queryParallelWorldPlot };
