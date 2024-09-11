import { reportClick } from '@/src/utils/report';
import { LikeIcon, LikeIconProps } from '../like/LikeIcon';
import { useLikeComment, useLikeCommentParams } from './useLikeComment';

type CommentLikeProps = Omit<LikeIconProps, 'onLike'> &
  useLikeCommentParams & { case?: string; id: string; contentid?: string };

export const CommentLike = (props: CommentLikeProps) => {
  const {
    liked,
    likeCount,
    contentid,
    commentId,
    onLikeClicked,
    onLikeSuccess,
    needEmitEvent,
    ...rest
  } = props;

  const { currentLiked, onPressLike } = useLikeComment({
    liked,
    onLikeClicked,
    onLikeSuccess,
    commentId,
    needEmitEvent
  });

  let displayLikeCount = likeCount || 0;
  if (!liked && currentLiked) {
    displayLikeCount++;
  } else if (liked && !currentLiked) {
    displayLikeCount--;
  }

  return (
    <LikeIcon
      liked={currentLiked}
      likeCount={displayLikeCount}
      onLike={e => {
        onPressLike(e);
        reportClick('message_like', {
          commentid: commentId,
          contentid: contentid,
          case: props.case,
          type: props.case === 'likeComment' ? 3 : 7 // 3: 内容被评论，7：内容被回复
        });
      }}
      {...rest}
    />
  );
};
