import { createSocketConnect } from '../websocket/connect';
import { Query } from '@/proto-registry/src/web/raccoon/query/query_connect';
import { Resource } from '@/proto-registry/src/web/raccoon/resource/resource_connect';

const resourceClient = createSocketConnect('Resource', Resource);
export const searchClient = createSocketConnect('Query', Query);

export enum ESearchResourceType {
  HOME = '1001',
  HOT_RANK = '1002',
  RESULT_TAG = '1003'
}

export const getQuerySourceByType = async (resourceId: ESearchResourceType) => {
  // 1001 默认搜索词轮播 1002 搜索热榜 1003 结果页 tag
  return await resourceClient.getResourceMaterial({
    resourceId
  });
};
