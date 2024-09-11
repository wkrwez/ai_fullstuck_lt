import { Socket } from '@/src/api/websocket';
import { logWarn } from '@/src/utils/error-log';
import { PickPbQueryParams } from '../utils';
import { createSocketConnect } from '../websocket/connect';
import { stream } from '../websocket/stream';
import { ErrorRes } from '../websocket/stream_connect';
import { Emoji } from '@/proto-registry/src/web/raccoon/emoji/emoji_connect';
import {
  DeleteEmojiReq,
  EmojiDetailReq,
  EmojiDetailResponse,
  EmojiModule,
  GetEmojiListRequest,
  GetRecTextReq,
  MakeEmojiReq,
  PublishAndSaveEmojiReq,
  ReCreateEmojiStreamResponse,
  ReCreateReq,
  SaveEmojiReq
} from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';
import { PartialMessage } from '@bufbuild/protobuf';

export const EmojiClient = createSocketConnect('Emoji', Emoji);

// 1. 评论区表情包拉取界面
type EmojiListRequest = PickPbQueryParams<GetEmojiListRequest>;
const queryEmojiList = (payload: EmojiListRequest) => {
  return EmojiClient.getEmojiList(payload);
};
export { EmojiListRequest, queryEmojiList };

// 2. 表情包删除
type DeleteEmojiRequest = PickPbQueryParams<DeleteEmojiReq>;
const deleteEmoji = (payload: DeleteEmojiRequest) => {
  return EmojiClient.deleteEmoji(payload);
};
export { DeleteEmojiRequest, deleteEmoji };

// 3. 生成表情包
type MakeDefaultEmojiRequest = PickPbQueryParams<MakeEmojiReq>;
const makeDefaultEmoji = (payload: MakeDefaultEmojiRequest) => {
  return EmojiClient.makeEmoji(payload);
};
const makeDefaultEmojiStream = async (
  payload: MakeDefaultEmojiRequest,
  cb: (payload: PartialMessage<ReCreateEmojiStreamResponse>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  stream(EmojiClient.makeEmojiStream, payload)
    .on(({ data }) => {
      cb(data);
      if (data.isFinish) {
        Socket.events.off('disconnect', onError);
      }
    })
    .error(({ error }) => {
      logWarn('makeDefaultEmojiStreamError', error);
      onError(error);
      Socket.events.off('disconnect', onError);
    })
    .do();

  Socket.events.on('disconnect', onError, true);
};
export { makeDefaultEmoji, makeDefaultEmojiStream, MakeDefaultEmojiRequest };

// 4. 二创表情包接口
type RecreateEmojiRequest = PickPbQueryParams<ReCreateReq>;
const recreateEmoji = (payload: RecreateEmojiRequest) => {
  return EmojiClient.reCreateEmoji(payload);
};
const recreateEmojiStream = async (
  payload: RecreateEmojiRequest,
  cb: (payload: PartialMessage<ReCreateEmojiStreamResponse>) => void,
  onError: (payload: Uint8Array | PartialMessage<ErrorRes>) => void
) => {
  stream(EmojiClient.reCreateEmojiStream, payload)
    .on(({ data }) => {
      cb(data);
      if (data.isFinish) {
        Socket.events.off('disconnect', onError);
      }
    })
    .error(({ error }) => {
      logWarn('recreateEmojiStreamError', error);
      onError(error);
      Socket.events.off('disconnect', onError);
    })
    .do();
  Socket.events.on('disconnect', onError, true);
};
export { recreateEmoji, recreateEmojiStream, RecreateEmojiRequest };

// 5.获取推荐配文梗
type GetEmojiRecTextRequest = PickPbQueryParams<GetRecTextReq>;
const getEmojiRecText = (payload: GetEmojiRecTextRequest) => {
  return EmojiClient.getRecText(payload);
};
export { getEmojiRecText, GetEmojiRecTextRequest };

// 6.发布表情包
type PublishEmojiRequest = PickPbQueryParams<PublishAndSaveEmojiReq>;
const publishAndSaveEmoji = (payload: PublishEmojiRequest) => {
  return EmojiClient.publishAndSaveEmoji(payload);
};
export { publishAndSaveEmoji, PublishEmojiRequest };

// 7.表情包保存
type SaveEmojiRequest = PickPbQueryParams<SaveEmojiReq>;
const saveEmoji = (payload: SaveEmojiRequest) => {
  return EmojiClient.saveEmoji(payload);
};
export { saveEmoji, SaveEmojiRequest };

// 8.表情页详情
type EmojiDetailRequest = PickPbQueryParams<EmojiDetailReq>;
type EmojiDetail = PickPbQueryParams<EmojiDetailResponse>;
const queryEmojiDetail = (payload: EmojiDetailRequest) => {
  return EmojiClient.emojiDetail(payload);
};
export { queryEmojiDetail, EmojiDetailRequest, EmojiDetail };
