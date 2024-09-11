import { StyleProp, View, ViewProps } from 'react-native';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { Follow } from '@Components/follow';
import { Header } from './components/Header';
import { InboxMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface AttentionCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewProps>;
}

export function AttentionCard(props: AttentionCardProps) {
  function onUpdatefollow(followed: boolean) {
    reportClick('follow_button', {
      msgId: props.data.msgId,
      followed
    });
  }

  return (
    <View style={props.messageStyle}>
      <Header
        user={props.data.sender}
        title={props.data.sender?.name}
        desc={'关注了你 ' + formatDate(props.data.createdTime)}
        icon="attention_state"
        uid={props.data.sender?.uid}
        style={{
          padding: 0,
          marginTop: 10,
          marginBottom: 10,
          paddingLeft: 16,
          paddingRight: 16
        }}
      >
        {props.data.sender?.uid ? (
          <Follow
            uid={props.data.sender?.uid}
            beingFollowed={
              props.data.msg.case === 'follow' && props.data.msg.value.isFan
            }
            followed={
              props.data.msg.case === 'follow' &&
              props.data.msg.value.isFollowed
            }
            style={{}}
            onFollow={() => onUpdatefollow(true)}
            onUnfollow={() => onUpdatefollow(false)}
          />
        ) : null}
      </Header>
    </View>
  );
}
