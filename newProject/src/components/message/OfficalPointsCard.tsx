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

interface OfficalPointsCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewStyle>;
  msgId?: string;
}

export function OfficalPointsCard(props: OfficalPointsCardProps) {
  const { data } = props;

  const msg = useMemo(() => {
    if (props.data.msg.case === 'dispatchPoints') {
      const { value } = props.data.msg;
      return value;
    }
    return null;
  }, []);
  return (
    <View style={props.messageStyle}>
      {msg?.points ? (
        <Header
          title={data.sender?.name}
          onCard={onCard}
          desc={`小狸为你送来了 ${msg?.points} 狸电池 ${formatDate(data.createdTime)}`}
          user={data.sender}
          id={msg?.points!.toString()}
          style={{
            padding: 0,
            marginTop: 10,
            marginBottom: 10,
            paddingLeft: 16,
            paddingRight: 16
          }}
        ></Header>
      ) : (
        <View></View>
      )}
    </View>
  );
  function onCard() {
    reportClick('message_button', {
      messageid: props.msgId,
      contentid: msg?.points,
      type: '4'
    });
  }
}
