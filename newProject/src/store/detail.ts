import uniqBy from 'lodash.uniqby';
import { create } from 'zustand';
import { GetPublish } from '@/src/api/makephoto';
import { DeleteDetail, GetPageCommonInfo } from '@/src/api/query';
import { logWarn } from '@Utils/error-log';
import { CommentClient } from '../api/comment';
import { ErrorRes } from '../api/websocket/stream_connect';
import {
  FRONTEND_FETCH_WAITING_TIMEOUT,
  requestWithTimeout
} from '../utils/requestWithTimeout';
import { EmojiInfo } from '@/proto-registry/src/web/raccoon/emoji/emoji_pb';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  CommentItem,
  PublishCommentReq,
  PublishCommentRes,
  QueryCommentsByCursorReq,
  QueryCommentsByCursorRes
} from '@step.ai/proto-gen/raccoon/comment/comment_pb';
import { RichCardInfo } from '@step.ai/proto-gen/raccoon/common/showcase_pb';
import { GameType } from '@step.ai/proto-gen/raccoon/common/types_pb';
import {
  GetPublishRequest,
  GetPublishResponse,
  ImagegenProto,
  Photo,
  Role
} from '@step.ai/proto-gen/raccoon/makephoto/makephoto_pb';
import {
  CardSocialInfoResponse,
  DeleteCardRsp
} from '@step.ai/proto-gen/raccoon/query/query_pb';
import { useAppStore } from './app';
import { useEmojiCreatorStore } from './emoji-creator';

type PhotoType = {
  [key in string]: Photo[];
};

type ProtoInfoType = {
  [key in string]: ProtoInfo;
};

type DetailRequst = {
  cardId: string;
  // articleId: string,
  gameId?: string;
  gameType?: GameType;
  gameIp?: number;
};

export type ProtoInfo = {
  photos?: Photo[];
  protoId: string;
  roles: Role[];
  style: string;
  size: string;
  prompt: string;
};

export type DetailInfo = {
  cardId: string;
  photos: Photo[];
  title: string;
  text: string;
  publishTime: string;
  protoInfo: ProtoInfo[];
  mapProtoData: ProtoInfoType; // photoid to proto info
  placeholder?: number;
  cardMetaAttrs?: Record<string, string>;
};

// 最多只允许缓存 50 条 PostDetailInfo 在内存中，同 UserInfo
const MAX_SIZE = 50;
// 最小对相同 cardId 的内容请求间隔
const MIN_FETCH_DURATION = 2000;
// 控制同 cardId 的获取结果限制
const requestExpireTime: Record<string, number> = {};

// comment
const COMMENT_PAGE_SIZE = 10;

const mapId = (arr: Photo[]) => {
  const data: PhotoType = arr.reduce((result: PhotoType, item) => {
    if (!result[item.protoId]) {
      result[item.protoId] = [];
    }
    result[item.protoId].push(item);
    return result;
  }, {});
  return data;
};

const mapProtoId = (arr: ProtoInfo[], photos: Photo[]) => {
  const protoMap: ProtoInfoType = arr.reduce((result: ProtoInfoType, item) => {
    result[item.protoId] = item;
    return result;
  }, {});

  const photoMap: ProtoInfoType = photos.reduce(
    (result: ProtoInfoType, item) => {
      result[item.photoId] = protoMap[item.protoId];
      return result;
    },
    {}
  );
  return photoMap;
};

const getProtoInfo = (protos: ImagegenProto[], mapData: PhotoType) => {
  const map = new Map();

  protos.forEach(item => {
    // const key = [item.prompt, item.style, ...item.roles.map(i => i.role)].join('_')
    const key = [...item.roles.map(i => i.role)].join('_');
    if (map.has(key)) {
      const current = map.get(key);
      current.photos = current.photos.concat(mapData[item.protoId]);
      map.set(key, current);
    } else {
      map.set(key, {
        ...item,
        photos: mapData[item.protoId]
      });
    }
  });

  return Array.from(map, ([name, value]) => value).map(i => ({
    ...i,
    photos: uniqBy(i.photos, (k: PhotoType) => k.photoId)
  }));
};

const getDefaultPostInfo = () => ({
  loading: false,
  error: null,
  imageIndex: 1,
  detail: null,
  commonInfo: null,
  commentList: []
});

/** 详情 */
type PostDetailInfo = {
  id: string;
  type?: GameType;
  loading: boolean;
  error: ErrorRes | null;
  detail: DetailInfo | null;
  imageIndex: number;
  commonInfo: PartialMessage<CardSocialInfoResponse> | null;
  /** 评论相关 */
  commentList: Array<PartialMessage<CommentItem>>;
  commentNeedForceLoad?: boolean;
};

type States = {
  __posts: PostDetailInfo[];
};

export enum RefreshType {
  NO_REFRESH = 0,
  SLIENT_REFRESH = 1,
  FORCE_REFRESH = 2
}

let mock = 0;

type Actions = {
  // 清空信息
  reset: (id: string) => void;
  // 设置占位信息
  placeholder: (data: PartialMessage<RichCardInfo>) => void;
  requestDetail: (payload: DetailRequst) => void;
  deleteDetail: (payload: string) => Promise<DeleteCardRsp>;
  changeCommentTotal: (id: string, update: (current: number) => number) => void;
  pullCommentData: (
    id: string,
    refresh?: RefreshType,
    cursor?: string,
    top?: {
      commentId: string;
      replyId: string;
    }
  ) => Promise<QueryCommentsByCursorRes | undefined>;
  removeComment: (
    id: string,
    commentId: string,
    parentCommentId?: string
  ) => void;
  insertComment: (
    id: string,
    commentReqParams: PartialMessage<PublishCommentReq> & {
      // 用于插入新评论
      emojiInfo?: EmojiInfo;
    }
  ) => { newCommitId?: string } | undefined;
  updateReplyData: (
    id: string,
    commentId: string,
    update: (list: CommentItem[]) => CommentItem[],
    updateTotalCount: (count: number) => number
  ) => void;
  updateCertainCommentInfo: (
    detailId: string,
    commentId: string,
    payload: Partial<CommentItem>
  ) => void;
  // 设置当前轮播索引
  setImageIndex: (id: string, index: number) => void;
  // 更新 post 信息(不存在则新增，新增和更新都会将该信息推到最前面)
  updateDetail: (id: string, data: Partial<PostDetailInfo>) => void;
  // 获取本地信息
  getDetail: (id: string) => PostDetailInfo | undefined;
};

export const useDetailStore = create<States & Actions>()((set, get) => ({
  __posts: [],
  updateDetail(id, data) {
    const posts = [...get().__posts];

    const index = posts.findIndex(item => item.id === id);
    const latest = {
      id,
      ...getDefaultPostInfo(),
      ...(index !== -1 ? posts.splice(index, 1)[0] : {}),
      ...data
    };

    posts.push(latest);

    if (posts.length > MAX_SIZE) {
      posts.shift();
    }

    set({
      __posts: posts
    });
  },
  getDetail(id: string) {
    const posts = get().__posts;
    const index = posts.findIndex(item => item.id === id);
    return index !== -1 ? posts[index] : undefined;
  },
  reset(id: string) {
    const posts = [...get().__posts];
    const index = posts.findIndex(item => item.id === id);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        ...getDefaultPostInfo()
      };
      set({
        __posts: posts
      });
    }
  },
  placeholder(data) {
    // 用卡片信息占位
    const { card, user, socialStat } = data;
    if (!card?.id) {
      return;
    }

    const info = get().getDetail(card.id);
    if (!info) {
      get().updateDetail(card.id, {
        imageIndex: 1,
        commonInfo: {
          profile: user,
          stat: socialStat
        },
        detail: {
          photos: [
            new Photo({
              url: card?.displayImageUrl
            })
          ],
          cardId: card?.id || '',
          title: card?.title || '',
          text: '',
          publishTime: '',
          protoInfo: [],
          mapProtoData: {},
          placeholder: 1
        }
      });
    }
  },
  requestDetail(payload: DetailRequst) {
    const { cardId, gameType = GameType.DRAWING } = payload;

    // 频控
    if (requestExpireTime[cardId] && Date.now() < requestExpireTime[cardId]) {
      return;
    }
    requestExpireTime[cardId] = Date.now() + MIN_FETCH_DURATION;

    const { updateDetail } = get();

    // 清空评论数据
    updateDetail(cardId, { type: gameType });

    console.log('detail id: ', cardId);

    // 页面信息
    requestWithTimeout<CardSocialInfoResponse>(
      GetPageCommonInfo({
        id: cardId
      }),
      { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
    )
      .then(res => {
        updateDetail(cardId, {
          commonInfo: res
        });
      })
      .catch(e => {
        updateDetail(cardId, {
          error: e
        });
        logWarn('GetPageCommonInfoError', e);
      });

    if (gameType === GameType.DRAWING) {
      updateDetail(cardId, { loading: true });
      requestWithTimeout<GetPublishResponse>(
        GetPublish(
          new GetPublishRequest({
            cardId
          })
        ),
        { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
      )
        .then((res: GetPublishResponse) => {
          const { protos, photos, publishTime, story, title } = res;
          // 初始化emoji创作信息
          useEmojiCreatorStore.getState().changeRoleInfo(protos[0].roles[0]);
          useEmojiCreatorStore.getState().changeCardInfo({
            cardId: cardId
          });
          if (publishTime < BigInt(0)) {
            updateDetail(cardId, {
              error: new ErrorRes({ reason: JSON.stringify(res) })
            });
            logWarn('GetPublishRequestPublishTimeError', JSON.stringify(res));
            // router.replace('/empty-page/');
            return;
          }
          const mapData = mapId(photos || []);
          const mapProtoData = mapProtoId(protos, photos);
          // const protoPhotos: ProtoPhoto[] = photos.map(item => ({
          //     ...item,
          //     protoInfo: mapProtoData[item.protoId]
          // }))
          const detail = {
            photos: photos,
            title,
            text: story,
            publishTime: (publishTime || '').toString(),
            // group by roles&prompts
            protoInfo: getProtoInfo(protos, mapData),
            mapProtoData,
            cardId: payload.cardId,
            cardMetaAttrs: res.cmetadata?.attrs
          };
          updateDetail(cardId, {
            detail
          });
        })
        .catch((e: ErrorRes) => {
          updateDetail(cardId, {
            error: e
          });
          logWarn('GetPublishRequestError', e);
        })
        .finally(() => {
          // todo 要改，写在store中不合理
          updateDetail(cardId, { loading: false });
        });
    }
  },
  deleteDetail(cardId: string) {
    return DeleteDetail({ cardId });
  },
  changeCommentTotal(id: string, update: (current: number) => number) {
    const { updateDetail, getDetail } = get();
    const { commonInfo } = getDetail(id) || {};
    if (commonInfo?.stat) {
      commonInfo.stat.comments = BigInt(
        Math.max(update(Number(commonInfo.stat.comments || 0)), 0)
      );
      const newCommonInfo = { ...commonInfo } as CardSocialInfoResponse;
      updateDetail(id, { commonInfo: newCommonInfo });
    }
  },
  async pullCommentData(detailId, refresh, cursor, top) {
    const { getDetail, updateDetail } = get();
    const { commentList = [], commentNeedForceLoad: prevCommentNeedForceLoad } =
      getDetail(detailId) || {};

    if (!detailId) {
      // detailId为空的，请求卡片数据错误
      return;
    }

    if (refresh === RefreshType.FORCE_REFRESH) {
      updateDetail(detailId, {
        commentList: []
      });
    }

    try {
      const queryCommentsParams = new QueryCommentsByCursorReq({
        cardId: detailId,
        topParentCommentId: top?.commentId,
        topSecondCommentId: top?.replyId,
        pagination: {
          size: COMMENT_PAGE_SIZE,
          cursor: refresh !== RefreshType.NO_REFRESH ? '' : cursor
        }
      });

      // await new Promise((r, reject) => {
      //   setTimeout(() => {
      //     if (mock % 3 === 0) {
      //       reject(new Error('1'));
      //     } else {
      //       r(1);
      //     }
      //     mock++;
      //   }, 3000);
      // });

      const res = await requestWithTimeout<QueryCommentsByCursorRes>(
        CommentClient.queryCommentsByCursor(queryCommentsParams),
        { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
      );

      // 回写数据
      updateDetail(detailId, {
        commentNeedForceLoad:
          refresh !== RefreshType.NO_REFRESH ? false : prevCommentNeedForceLoad,
        commentList:
          refresh !== RefreshType.NO_REFRESH
            ? res.comments
            : [...commentList, ...res.comments]
      });

      return res;
    } catch (e) {
      logWarn('queryCommentsByCursorError', e);
      throw e;
    }
  },
  async insertComment(id, commentReqParams) {
    const { user } = useAppStore.getState();

    const { getDetail, updateDetail, changeCommentTotal, updateReplyData } =
      get();

    try {
      if (!id) {
        throw new Error('empty detailId');
      }

      const { commonInfo, commentList = [] } = getDetail(id) || {};

      const requestParams = new PublishCommentReq({
        ...commentReqParams,
        emojiId: commentReqParams.emojiInfo?.emojiId || commentReqParams.emojiId
      });

      const res = await requestWithTimeout<PublishCommentRes>(
        CommentClient.publishComment(requestParams),
        { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
      );

      // 立即插入一条数据
      const now = new Date().getTime();
      let repliedComment = undefined;
      if (
        commentReqParams.repliedCommentId &&
        commentReqParams.parentCommentId !== commentReqParams.repliedCommentId
      ) {
        repliedComment = commentList
          .find(item => item.commentId === commentReqParams.parentCommentId)
          ?.comments?.find(
            item => item.commentId === commentReqParams.repliedCommentId
          );
      }
      const newComment = {
        commentId: res.commentId,
        time: BigInt(Math.floor(now / 1000)),
        avatar: user?.avatar,
        name: user?.name,
        content: commentReqParams.content,
        isLiked: false,
        isAuthor: user?.uid === commonInfo?.profile?.uid,
        totalLikes: 0,
        uid: user?.uid,
        emoji: commentReqParams.emojiInfo,
        repliedComment
      } as PartialMessage<CommentItem>;

      if (commentReqParams.parentCommentId) {
        updateReplyData(
          id,
          commentReqParams.parentCommentId,
          prev => [newComment as CommentItem, ...prev],
          prev => prev + 1
        );
      } else {
        updateDetail(id, {
          commentList: [newComment, ...commentList],
          commentNeedForceLoad: true
        });
        changeCommentTotal(id, current => current + 1);
      }

      return { newCommentId: res.commentId };
    } catch (e) {
      logWarn('insertCommentError', e);
      throw e;
    }
  },
  updateReplyData(
    id: string,
    commentId: string,
    update: (list: CommentItem[]) => CommentItem[],
    updateTotalCount: (count: number) => number
  ) {
    const { updateDetail, getDetail, changeCommentTotal } = get();
    const { commentList: prev } = getDetail(id) || {};
    const commentList = (prev?.slice() || []) as CommentItem[];

    const targetIndex = commentList.findIndex(
      item => item.commentId === commentId
    );

    if (targetIndex !== undefined && targetIndex !== -1) {
      const prev = commentList[targetIndex].comments || [];
      const prevTotal = commentList[targetIndex].totalComments || 0;
      commentList[targetIndex].comments = update(prev);
      const nextTotal = updateTotalCount(prevTotal);
      commentList[targetIndex].totalComments = nextTotal;

      updateDetail(id, {
        commentList,
        commentNeedForceLoad: true
      });
      changeCommentTotal(id, current => current + nextTotal - prevTotal);
    }
  },
  updateCertainCommentInfo(
    detailId: string,
    commentId: string,
    payload: Partial<CommentItem>
  ) {
    const { updateDetail, getDetail } = get();
    const { commentList = [] } = getDetail(detailId) || {};

    const list = commentList.slice();
    const index = list.findIndex(item => item.commentId === commentId);
    if (index !== -1) {
      list.splice(index, 1, {
        ...list[index],
        ...payload
      });
    }
    updateDetail(detailId, {
      commentList: list
    });
  },
  async removeComment(id: string, commentId: string, parentCommentId?: string) {
    const { updateDetail, getDetail, changeCommentTotal, updateReplyData } =
      get();
    const { commentList = [] } = getDetail(id) || {};

    try {
      if (!commentId) {
        throw new Error('empty commitId');
      }

      const res = await requestWithTimeout(
        CommentClient.deleteComment({ commentId }),
        { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
      );

      if (parentCommentId) {
        updateReplyData(
          id,
          parentCommentId,
          prev => {
            const next = prev.slice();
            const index = next.findIndex(item => item.commentId === commentId);
            next.splice(index, 1);
            return next;
          },
          prev => prev - 1
        );
      } else {
        const index = commentList.findIndex(
          item => item.commentId === commentId
        );
        const repliesCount = commentList[index].totalComments || 0;
        updateDetail(id, {
          commentList: commentList.filter(x => x.commentId !== commentId)
        });

        changeCommentTotal(id, current => current - 1 - repliesCount);
      }
    } catch (e) {
      logWarn('removeCommentError', e);
      throw e;
    }
  },
  setImageIndex(id: string, index: number) {
    const { updateDetail } = get();
    updateDetail(id, { imageIndex: index });
  }
}));
