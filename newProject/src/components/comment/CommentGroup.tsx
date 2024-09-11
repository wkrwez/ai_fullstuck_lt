import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { CommentClient } from '@/src/api/comment';
import { useDetailStore } from '@/src/store/detail';
import { logWarn } from '@/src/utils/error-log';
import {
  FRONTEND_FETCH_WAITING_TIMEOUT,
  requestWithTimeout
} from '@/src/utils/requestWithTimeout';
import { showToast } from '../toast';
import {
  QueryCommentsByCursorRes,
  QuerySubCommentsByCursorReq
} from '@/proto-registry/src/web/raccoon/comment/comment_pb';
import { CommentItemComp } from './CommentItem';
import { CommnetItemProps } from './typing';

export function CommentGroup(props: CommnetItemProps) {
  const { comment, detailId, theme } = props;

  const { totalComments = 0, comments = [] } = comment;

  const updateReplyData = useDetailStore(state => state.updateReplyData);

  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const remaining = Math.max(totalComments - comments.length, 0);

  const onClickFetchMoreReply = async () => {
    try {
      setLoading(true);

      const queryCommentsParams = new QuerySubCommentsByCursorReq({
        cardId: detailId,
        parentCommentId: comment.commentId || '',
        pagination: {
          cursor: cursor,
          size: 20
        }
      });

      const res = await requestWithTimeout<QueryCommentsByCursorRes>(
        CommentClient.querySubCommentsByCursor(queryCommentsParams),
        { timeout: FRONTEND_FETCH_WAITING_TIMEOUT }
      );

      const { pagination, comments } = res || {};
      updateReplyData(
        detailId,
        comment.commentId || '',
        prev => (cursor === '' ? comments : prev.concat(comments)),
        prev => prev
      );
      setCursor(pagination?.nextCursor || '');
    } catch (error) {
      showToast('加载失败，请重试');
      logWarn('querySubCommentsByCursorError', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginBottom: 24 }}>
      <CommentItemComp detailId={detailId} comment={comment} theme={theme} />
      {comments.map((item, index) => (
        <CommentItemComp
          key={index}
          detailId={detailId}
          parentComment={comment}
          comment={item}
          theme={theme}
        />
      ))}
      {remaining ? (
        <Pressable onPress={onClickFetchMoreReply} style={$replyFetchMore}>
          {loading ? (
            <ActivityIndicator
              size="small"
              style={{ width: 30 }}
              color="rgba(217, 217, 217, 1)"
            />
          ) : (
            <Text style={$replyFetchMoreIcon}>展开 {remaining} 条回复</Text>
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const $replyFetchMore: ViewStyle = {
  width: '100%',
  paddingLeft: 48 + 36,
  justifyContent: 'flex-start',
  flexDirection: 'row',
  marginTop: 16
};

const $replyFetchMoreIcon: TextStyle = {
  color: '#466899',
  fontSize: 13,
  lineHeight: 18,
  fontWeight: '600'
};
