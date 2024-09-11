import { useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { StyleSheet } from '@/src/utils';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { Image } from '@Components/image';
import { Header } from './components/Header';
import { TargetButton } from './components/TargetButton';
import {
  ButtonType,
  InboxMsg
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface HeaderCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewStyle>;
}

export function HeaderCard(props: HeaderCardProps) {
  const { data } = props;
  const msg = useMemo(() => {
    if (props.data.msg.case === 'announce') {
      const { value } = props.data.msg;
      return value;
    }
    return null;
  }, []);

  return (
    <View style={props.messageStyle}>
      <Header
        title={data.sender?.name}
        desc={`${formatDate(data.createdTime)}`}
        user={data.sender}
        // url={msg?.url || ''}
      ></Header>
      <View style={st.$cardImageContainer}>
        <Image
          source={msg?.cover || ''}
          tosSize="size2"
          style={{ width: '100%', height: 120 }}
        ></Image>
        <View style={st.$cardTextConatiner}>
          <Text style={st.$titStyle}>{msg?.title}</Text>
          <Text style={st.$texStyle}>{msg?.content}</Text>
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 12 }}>
          {msg?.buttonType !== ButtonType.NoButton ? (
            <TargetButton
              preset="lightTheme"
              size="small"
              style={{ width: 80 }}
              textStyle={{ color: '#FF6A3B', fontSize: 12 }}
              url={msg?.url}
              title={msg?.title}
              reportType="1"
              data={data}
            >
              点击查看
            </TargetButton>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  $cardImageContainer: {
    width: 343,
    marginHorizontal: 16,
    backgroundColor: 'rgba(248,248,248,1)',
    borderRadius: 6
  },
  $cardTextConatiner: {
    width: 343,
    padding: 12
  },
  $titStyle: {
    fontFamily: 'PingFang SC',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 19,
    marginBottom: 4
  },
  $texStyle: {
    width: 319,
    fontFamily: 'PingFang SC',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgba(0,0,0,0.54)'
  }
});
