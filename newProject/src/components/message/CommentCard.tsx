import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useDetailStore } from '@/src/store/detail';
import { CommonColor } from '@/src/theme/colors/common';
import { GameType, RichCardInfo } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { Text } from '@Components/text';
import { CommentLike } from '../comment/CommentLike';
import { LikeStyle } from '../like/LikeIcon';
import { CardImage } from './components/CardImage';
import { Comment } from './components/Comment';
import { Header } from './components/Header';
import { ReplyButton } from './components/ReplyButton';
import type { PartialMessage } from '@bufbuild/protobuf';
import {
  CommentState,
  CommentWorkMsg,
  EventType,
  InboxMsg,
  ReplyCommentMsg
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

// interface ButtonProps {
//   icon ?:IconTypes,
//   iconsize?: number,
// }

interface CommentCardProps {
  data: InboxMsg;
  // content?: string;
  // reply?: string;
  // btn?: ButtonProps;
  messageStyle?: StyleProp<ViewStyle>;
  msgId?: string;
}

export function CommentCard(props: CommentCardProps) {
  const { data } = props;

  const isComment = props.data.eventType === EventType.CommentWork;
  const description = isComment ? '评论了你的作品' : '回复了你的评论';

  const msg = useMemo(() => {
    if (props.data.msg.case === 'commentWork') {
      const { value } = props.data.msg;
      return value;
    } else if (props.data.msg.case === 'replyComment') {
      return props.data.msg.value;
    }
    return null;
  }, []);

  const hideInteraction =
    msg?.senderComment?.state === CommentState.InVisible ||
    (msg instanceof ReplyCommentMsg &&
      Boolean(msg.targetComment) &&
      msg.targetComment?.state === CommentState.InVisible);

  return (
    <Pressable style={props.messageStyle} onPress={gotoDetailPage}>
      <Header
        icon="message_state"
        title={data.sender?.name}
        desc={`${description} ${formatDate(data.createdTime)}`}
        user={data.sender}
        id={msg?.work?.id?.toString()}
        onCard={onCard}
        gameType={msg?.work?.gameType}
        style={{
          padding: 0,
          marginTop: 10,
          paddingLeft: 16,
          paddingRight: 12
        }}
        work={msg?.work}
      >
        <CardImage source={msg?.work?.image}></CardImage>
      </Header>
      <Comment
        content={msg?.senderComment}
        replyTarget={
          msg instanceof CommentWorkMsg ? undefined : msg?.targetComment
        }
      ></Comment>
      {msg?.senderComment && !hideInteraction ? (
        <View style={st.$btnContainer}>
          <ReplyButton
            parentCommentId={
              msg?.senderComment.parentCommentId || msg?.senderComment?.id || ''
            }
            id={data.msgId}
            commentId={msg?.senderComment?.id || ''}
            commentUserName={data.sender?.name}
            detailId={msg.work?.id}
            brandtype={msg.work?.brandType}
            case={props.data.msg.case || ''}
          ></ReplyButton>
          <CommentLike
            liked={msg.isLiked}
            id={data.msgId}
            commentId={msg?.senderComment?.id}
            contentid={msg?.work?.id}
            likeIconStyle={LikeStyle.SOLID}
            inactiveColor={CommonColor.black40}
            size={14}
            style={$likeContainer}
            renderText={() => <Text style={$likeText}>点赞</Text>}
            case={props.data.msg.case}
          />
        </View>
      ) : null}
    </Pressable>
  );

  function onCard() {
    reportClick('message_button', {
      messageid: props.msgId,
      contentid: msg?.work?.id,
      case: props.data.msg.case,
      type: '3'
    });

    return isComment
      ? {
          topCommentId: msg?.senderComment?.id || '',
          topReplyId: ''
        }
      : {
          topCommentId:
            msg?.senderComment?.parentCommentId || msg?.senderComment?.id || '',
          topReplyId: msg?.senderComment?.id || ''
        };
  }

  function gotoDetailPage() {
    const params = onCard();
    const id = msg?.work?.id;
    if (id) {
      if (msg?.work?.gameType === GameType.WORLD) {
        router.push({
          pathname: `/parallel-world/${id}`,
          params: {
            id,
            ...params
          }
        });
      } else {
        if (msg.work?.image) {
          const { placeholder } = useDetailStore.getState();
          placeholder({
            card: {
              id,
              displayImageUrl: msg.work?.image
            }
          } as PartialMessage<RichCardInfo>);
        }
        router.push({
          pathname: `/detail/${id}`,
          params: {
            id,
            ...params
          }
        });
      }
    }
  }
}

const st = StyleSheet.create({
  $btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 74,
    marginTop: 16
  }
});

const $likeContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  height: 26,
  borderRadius: 13,
  backgroundColor: 'rgba(245, 245, 245, 1)',
  alignItems: 'center',
  paddingHorizontal: 15,
  marginLeft: 12
};

const $likeText: TextStyle = {
  marginLeft: 3,
  fontSize: 12,
  lineHeight: 14,
  fontWeight: '600',
  color: CommonColor.black2
};
