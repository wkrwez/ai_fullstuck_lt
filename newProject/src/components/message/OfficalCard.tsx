import { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { CardImage } from './components/CardImage';
import { Header } from './components/Header';
import {
  EventType,
  InboxMsg,
  WorkMsg
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface OfficalCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewStyle>;
  msgId?: string;
}

export function OfficalCard(props: OfficalCardProps) {
  const { data } = props;

  const msg = useMemo(() => {
    if (props.data.msg.case === 'recommentWork') {
      const { value } = props.data.msg;
      return value;
    }
    return null;
  }, []);
  return (
    <View style={props.messageStyle}>
      {msg?.work?.id ? (
        <Header
          title={data.sender?.name}
          desc={`官方推荐了你的作品 ${formatDate(data.createdTime)}`}
          user={data.sender}
          id={(msg?.work?.id).toString()}
          work={msg.work}
          style={{
            padding: 0,
            marginTop: 10,
            marginBottom: 10,
            paddingLeft: 16,
            paddingRight: 16
          }}
        >
          <CardImage source={msg?.work?.image}></CardImage>
        </Header>
      ) : (
        <Header
          title={data.sender?.name}
          desc={`官方推荐了你的作品 ${formatDate(data.createdTime)}`}
          user={data.sender}
          onCard={onCard}
          style={{
            padding: 0,
            marginTop: 10,
            marginBottom: 10,
            paddingLeft: 16,
            paddingRight: 16
          }}
        >
          <CardImage source={msg?.work?.image}></CardImage>
        </Header>
      )}
    </View>
  );
  function onCard() {
    reportClick('message_button', {
      messageid: props.msgId,
      contentid: msg?.work?.id,
      type: '4'
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
