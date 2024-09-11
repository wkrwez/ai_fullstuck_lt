import {
  regularAndHighlighted,
  regularAndWeakened,
  solidAndHighlighted,
  solidAndWeakened1,
  solidAndWeakened2,
  solidAndWeakened3
} from './style';
import { FollowBtnTheme, FollowStatus, styleConfig } from './type';

export function calcFollowStatus(
  isFollowing: boolean,
  isBeingFollowed: boolean
) {
  if (isFollowing) {
    return isBeingFollowed
      ? FollowStatus.FOLLOW_EACH_OTHER
      : FollowStatus.FOLLOWING;
  } else {
    return isBeingFollowed ? FollowStatus.BEING_FOLLOWED : FollowStatus.DEFAULT;
  }
}

export const FollowDisplayConfig: Record<
  string,
  {
    text: string;
  } & Record<FollowBtnTheme, styleConfig>
> = {
  [FollowStatus.DEFAULT]: {
    text: '关注',
    [FollowBtnTheme.REGULAR]: regularAndHighlighted,
    [FollowBtnTheme.SOLID]: solidAndHighlighted,
    [FollowBtnTheme.SOLID_DARK_MODE]: solidAndHighlighted,
    [FollowBtnTheme.SOLID_COLOR_MODE]: solidAndHighlighted
  },
  [FollowStatus.FOLLOWING]: {
    text: '已关注',
    [FollowBtnTheme.REGULAR]: regularAndWeakened,
    [FollowBtnTheme.SOLID]: solidAndWeakened1,
    [FollowBtnTheme.SOLID_DARK_MODE]: solidAndWeakened2,
    [FollowBtnTheme.SOLID_COLOR_MODE]: solidAndWeakened3
  },
  [FollowStatus.BEING_FOLLOWED]: {
    text: '回关',
    [FollowBtnTheme.REGULAR]: regularAndHighlighted,
    [FollowBtnTheme.SOLID]: solidAndHighlighted,
    [FollowBtnTheme.SOLID_DARK_MODE]: solidAndHighlighted,
    [FollowBtnTheme.SOLID_COLOR_MODE]: solidAndHighlighted
  },
  [FollowStatus.FOLLOW_EACH_OTHER]: {
    text: '互相关注',
    [FollowBtnTheme.REGULAR]: regularAndWeakened,
    [FollowBtnTheme.SOLID]: solidAndWeakened1,
    [FollowBtnTheme.SOLID_DARK_MODE]: solidAndWeakened2,
    [FollowBtnTheme.SOLID_COLOR_MODE]: solidAndWeakened3
  }
};
