import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { CommentClient } from '@/src/api/comment';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useCreditStore } from '@/src/store/credit';
import { InteractionType, useHistoryStore } from '@/src/store/histroy';
import { logWarn } from '@/src/utils/error-log';
import {
  FRONTEND_FETCH_WAITING_TIMEOUT,
  requestWithTimeout
} from '@/src/utils/requestWithTimeout';
import { showToast } from '../toast';
import { RewardTaskType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import { useShallow } from 'zustand/react/shallow';

export interface useLikeDetailParams {
  liked: boolean;
  likeCount?: number;
  cardId: string;
  // 按钮点击回调，可用于埋点
  onLikeClicked?: (isLike: boolean) => void;
  // 成功点击回调
  onLikeSuccess?: (isLike: boolean) => void;
}

export function useLikeDetail({
  cardId,
  onLikeClicked,
  onLikeSuccess,
  liked,
  likeCount
}: useLikeDetailParams) {
  // 因为前端要做点赞的假状态，点击之后立即点亮，所有需要一个内部状态
  const [currentLiked, setCurrentLiked] = useState(!!liked);

  const { updateHistoryCache, currentCache } = useHistoryStore(
    useShallow(state => ({
      currentCache: state.viewHistory[cardId],
      updateHistoryCache: state.update
    }))
  );

  const { loginIntercept } = useAuthState();

  // 当外部的followed状态变更的时候，直接同步一次内部状态，
  useEffect(() => {
    setCurrentLiked(liked);
  }, [liked]);

  useEffect(() => {
    if (currentCache && currentCache.liked !== undefined) {
      setCurrentLiked(Boolean(currentCache.liked));
    }
  }, [currentCache]);

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
          const params = {
            cardId,
            like: target
          };
          console.log(`like article request: `, params);
          const res = await requestWithTimeout(CommentClient.likeWork(params), {
            timeout: FRONTEND_FETCH_WAITING_TIMEOUT
          });

          const targetNum = target
            ? (likeCount || 0) + 1
            : (likeCount || 0) - 1;

          updateHistoryCache(InteractionType.POST, cardId, {
            liked: target,
            likeCount: BigInt(targetNum)
          });

          useCreditStore
            .getState()
            .updateCreditTriggerType(RewardTaskType.LIKE_CARD);

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
