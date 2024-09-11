import { StyleProp, ViewStyle } from 'react-native';
import { Theme } from '@/src/theme/colors/type';
import { PartialMessage } from '@bufbuild/protobuf';
import { CommentItem } from '@step.ai/proto-gen/raccoon/comment/comment_pb';

export enum InputType {
  TEXT = 'text',
  EMOJI = 'emoji'
}

export interface ReplyParamsType {
  detailId?: string;
  parentCommentId?: string;
  repliedCommentId?: string;
  repliedCommentName?: string;
}

export interface CommnetItemProps {
  parentComment?: PartialMessage<CommentItem>;
  comment: PartialMessage<CommentItem>;
  detailId: string;
  theme: Theme;
  containerStyle?: StyleProp<ViewStyle>;
}
