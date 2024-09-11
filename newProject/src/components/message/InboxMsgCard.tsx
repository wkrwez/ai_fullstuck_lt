import { StyleProp, ViewStyle } from 'react-native';
import { EventType, InboxMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';
// todo 命名要改
// 关注
import { AttentionCard } from './AttentionCard';
// 评论
import { CommentCard } from './CommentCard';
// 官方消息
import { HeaderCard } from './HeaderCard';
// 官方推荐
import { OfficalCard } from './OfficalCard';
import { OfficalPointsCard } from './OfficalPointsCard';
// 拍了同款
import { PhotoCard } from './PhotoCard';
// 赞了作品
import { UpvoteCard } from './UpvoteCard';

export function InboxMsgCard(props: {
  data: InboxMsg;
  id: string;
  messageStyle?: StyleProp<ViewStyle>;
}) {
  const { data, messageStyle } = props;
  const { eventType } = data;
  // console.log(9999, 'InboxMsgCard', eventType, EventType.Follow, data);

  switch (eventType) {
    case EventType.Follow:
      return <AttentionCard data={data} messageStyle={messageStyle} />;
    case EventType.LikeWork:
    case EventType.LikeComment:
      return (
        <UpvoteCard data={data} messageStyle={messageStyle} msgId={props.id} />
      );
    case EventType.CommentWork:
    case EventType.ReplyComment:
      return <CommentCard data={data} messageStyle={messageStyle} />;
    case EventType.Annouce:
      return <HeaderCard data={data} messageStyle={messageStyle} />;
    case EventType.RecommendWork:
      return (
        <OfficalCard data={data} messageStyle={messageStyle} msgId={props.id} />
      );
    case EventType.DispatchPoints:
      return (
        <OfficalPointsCard
          data={data}
          messageStyle={messageStyle}
          msgId={props.id}
        />
      );
    case EventType.MakeCopy:
      return (
        <PhotoCard data={data} messageStyle={messageStyle} msgId={props.id} />
      );
    // todo 回复
  }
  return null;
}
