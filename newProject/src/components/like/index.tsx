import { forwardRef, useImperativeHandle } from 'react';
import { useCreditStore } from '@/src/store/credit';
import { useShallow } from 'zustand/react/shallow';
import { LikeIcon, LikeIconProps } from './LikeIcon';
import { useLikeDetail, useLikeDetailParams } from './useLikeDetail';

type DetailLikeProps = Omit<LikeIconProps, 'onLike'> & useLikeDetailParams;

export interface DetailLikeActions {
  changeLikeStatus: (like: boolean) => void;
}

export const DetailLike = forwardRef<DetailLikeActions, DetailLikeProps>(
  (props, ref) => {
    const { liked, likeCount, cardId, onLikeClicked, onLikeSuccess, ...rest } =
      props;

    const { localPoints, localRewardToast, triggerType } = useCreditStore(
      useShallow(state => ({
        localPoints: state.localPoints,
        localRewardToast: state.localRewardToast,
        triggerType: state.triggerType
      }))
    );

    const { currentLiked, onPressLike } = useLikeDetail({
      liked,
      likeCount,
      onLikeClicked,
      onLikeSuccess,
      cardId
    });

    useImperativeHandle(ref, () => ({
      changeLikeStatus: onPressLike
    }));

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
        onLike={onPressLike}
        {...rest}
      />
    );
  }
);
