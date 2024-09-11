import { Socket } from '@/src/api/websocket';
import { Pagination } from '@/src/types';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { Inbox } from '@/proto-registry/src/web/raccoon/inbox/inbox_connect';
import type { PartialMessage } from '@bufbuild/protobuf';
import { NotifyNewMsgRes } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

const messageClient = createSocketConnect('Inbox', Inbox);

export const QueryInboxUnread = () => {
  return messageClient.queryInboxUnread({});
};

// 监听消息数
export const UpdateMessageNum = (
  cb: (data: PartialMessage<NotifyNewMsgRes>) => void
) => {
  Socket.events.on(`Inbox/NotifyNewMsg`, body => {
    const data = NotifyNewMsgRes.fromBinary(body);
    cb(data);
  });
};

// 查询消息列表
export const QueryInboxMsg = (payload: {
  page: number;
  size?: number;
  cursor?: string;
}) => {
  return messageClient.queryInboxMsg({
    page: payload.page || 1,
    size: payload.size || 10,
    cursor: payload.cursor
  });
};

// 查询消息列表 v2
export const QueryInboxMsgByCursor = (payload: { pagination: Pagination }) => {
  return messageClient.queryInboxMsgByCursor(payload);
};

// 已读消息
export const ReadInboxMsg = (msgId: string) => {
  return messageClient.readInboxMsg({
    lastReadMaxMsgId: msgId
  });
};
