import { useMemo, useState } from 'react';
import { StyleProp, View, ViewProps } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { CardImage } from './components/CardImage';
import { Header } from './components/Header';
import { Reply } from './components/Reply';
import { EventType, InboxMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface UpvoteCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewProps>;
  msgId?: string;
}

const typeStr = {
  [EventType.LikeWork]: '作品',
  [EventType.LikeComment]: '评论',
  [EventType.Annouce]: '',
  [EventType.RecommendWork]: '',
  [EventType.CommentWork]: '',
  [EventType.Follow]: '',
  [EventType.MakeCopy]: '',
  [EventType.ReplyComment]: ''
};
export function UpvoteCard(props: UpvoteCardProps) {
  const { data, messageStyle } = props;
  const desc = useMemo(() => {
    return `赞了你的${typeStr[props.data.eventType]} ${formatDate(props.data.createdTime)}`;
  }, []);
  const msg = useMemo(() => {
    if (props.data.msg.case === 'likeWork') {
      const { value } = props.data.msg;
      return value;
    }
    if (props.data.msg.case === 'likeComment') {
      const { value } = props.data.msg;
      return value;
    }
    return null;
  }, []);

  return (
    <View style={messageStyle}>
      {msg?.work?.id ? (
        <Header
          icon="like_btn"
          title={data.sender?.name}
          desc={desc}
          user={data.sender}
          id={(msg?.work?.id).toString()}
          work={msg.work}
          gameType={msg?.work?.gameType}
          onCard={onCard}
          style={{
            padding: 0,
            marginTop: 10,
            paddingLeft: 16,
            paddingRight: 16,
            marginBottom: props.data.msg.case === 'likeWork' ? 10 : 0
          }}
        >
          {msg && <CardImage source={msg.work?.image}></CardImage>}
        </Header>
      ) : (
        <Header
          icon="like_btn"
          title={data.sender?.name}
          desc={desc}
          user={data.sender}
        >
          {msg && <CardImage source={msg.work?.image}></CardImage>}
        </Header>
      )}
      {props.data.msg.case === 'likeComment' && (
        <View style={{ width: 220, marginLeft: 78 }}>
          <Reply reply={props.data.msg.value.targetComment?.content}></Reply>
        </View>
      )}
    </View>
  );
  function onCard() {
    reportClick('message_button', {
      messageid: props.msgId,
      contentid: msg?.work?.id,
      type: props.data.msg.case === 'likeWork' ? '2' : '6'
    });
  }
}

// const st = StyleSheet.create({
//   $btnContainer:{
//     display:'flex',
//     flexDirection:'row',
//     marginLeft:78,
//     marginTop:16
//   }
// })
