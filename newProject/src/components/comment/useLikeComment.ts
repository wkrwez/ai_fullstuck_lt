import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { CommentClient } from '@/src/api/comment';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { logWarn } from '@/src/utils/error-log';
import { CommentEvent, CommentEventBus } from '../comment/eventbus';
import { showToast } from '../toast';

export interface useLikeCommentParams {
  liked: boolean;
  commentId: string;
  needEmitEvent?: boolean;
  // 按钮点击回调，可用于埋点
  onLikeClicked?: (isLike: boolean) => void;
  // 成功点击回调
  onLikeSuccess?: (isLike: boolean) => void;
}

export function useLikeComment({
  commentId,
  needEmitEvent,
  onLikeClicked,
  onLikeSuccess,
  liked
}: useLikeCommentParams) {
  const [currentLiked, setCurrentLiked] = useState(!!liked);

  const { loginIntercept } = useAuthState();

  useEffect(() => {
    setCurrentLiked(liked);
  }, [liked]);

  const onPressLike = (isLike: boolean) => {
    Haptics.selectionAsync();

    if (isLike === currentLiked) {
      return;
    }

    loginIntercept(
      async () => {
        const prev = currentLiked;
        const target = !currentLiked;
        setCurrentLiked(target);
        onLikeClicked?.(target);

        try {
          await CommentClient.likeComment({
            commentId,
            like: target
          });
          if (needEmitEvent) {
            CommentEventBus.emit(CommentEvent.LIKE_COMMENT, {
              commentId,
              like: target
            });
          }
          onLikeSuccess?.(target);
        } catch (error) {
          setCurrentLiked(prev);
          showToast('操作失败，请重试');
          logWarn('likeWorkError', error);
        }
      },
      { scene: LOGIN_SCENE.LIKE }
    );
  };

  return {
    currentLiked,
    onPressLike
  };
}
