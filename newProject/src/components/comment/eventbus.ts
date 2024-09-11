import { Event } from '@/src/utils/event';

export const CommentEventBus = new Event();

export enum CommentEvent {
  // 点赞评论
  LIKE_COMMENT = 'likeComment',
  // 滚动评论区至底部
  SCROLL_COMMENT = 'scrollComment',
  // 吊起评论输入框
  TRIGGER_EDIT_COMMENT = 'triggerEditComment',
  // 关闭评论输入框
  COLSE_COMMENT_INPUT = 'closeCommentInput',
  // 发送评论
  BEFORE_SUBMIT = 'before_submit',
  // 输入框 focus 状态变化事件
  COMMENT_INPUT_STATE_CHANGE = 'commentInputStateChange'
}
