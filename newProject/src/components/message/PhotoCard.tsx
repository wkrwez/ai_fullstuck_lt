import { router } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';
import { useAppStore } from '@/src/store/app';
import { typography } from '@/src/theme';
import {
  $MSG_COLORS,
  $flex,
  $flexCenter,
  $flexHCenter
} from '@/src/theme/variable';
import { GameType } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import Button, { EButtonType } from '../v2/button';
import { CardImage } from './components/CardImage';
import { Header } from './components/Header';
// import { MessageButton } from './components/MessageButton';
import { TargetButton } from './components/TargetButton';
import { EventType, InboxMsg } from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

interface PhotoCardProps {
  data: InboxMsg;
  messageStyle?: StyleProp<ViewStyle>;
  msgId?: string;
}

export function PhotoCard(props: PhotoCardProps) {
  const { data, messageStyle } = props;

  const msg = useMemo(() => {
    if (props.data.msg.case === 'makeCopy') {
      const { value } = props.data.msg;
      return value;
    }
    return null;
  }, []);

  const currentUid = useAppStore(state => state.user?.uid);

  return (
    <View style={messageStyle}>
      <Header
        icon="same_state"
        title={data.sender?.name}
        desc={`${msg?.copiedWork?.gameType === GameType.WORLD ? '创建了你的平行世界' : '对你的作品拍了同款了'} ${formatDate(data.createdTime)}`}
        user={data.sender}
        onCard={onCard}
        style={{
          padding: 0,
          marginTop: 10,
          marginBottom: 12,
          paddingLeft: 16,
          paddingRight: 16
        }}
        id={msg?.copiedWork?.id?.toString()}
        work={msg?.copiedWork}
        extra={JSON.stringify({ gameType: msg?.copiedWork?.gameType })}
        gameType={msg?.copiedWork?.gameType}
      >
        <CardImage source={msg?.copiedWork?.image}></CardImage>
      </Header>
      <View style={st.$btnContainer}>
        <View style={$flexHCenter}>
          <Button
            type={EButtonType.NORMAL}
            $customBtnStyle={st.$creditBtn}
            pressOpacity={1}
            onPress={() => {
              router.push({
                pathname: ('/user/' + currentUid) as RelativePathString
              });
            }}
          >
            <Text style={st.$creditBtnText}>声望+1</Text>
          </Button>
          {msg?.dispatchPoints?.points ? (
            <Button
              type={EButtonType.NORMAL}
              $customBtnStyle={st.$creditBtn}
              pressOpacity={1}
              style={{
                marginLeft: 10
              }}
              onPress={() => {
                router.push({
                  pathname: '/credit/'
                });
              }}
            >
              <Text style={st.$creditBtnText}>
                {'狸电池+' + msg?.dispatchPoints?.points}
              </Text>
            </Button>
          ) : null}
        </View>
      </View>
    </View>
  );
  function onCard() {
    reportClick('message_button', {
      messageid: props.msgId,
      contentid: msg?.copiedWork?.id,
      type: '5'
    });
  }
}

const st = StyleSheet.create({
  $btnContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 78
  },
  $creditBtn: {
    height: 22,
    borderRadius: 93,
    backgroundColor: $MSG_COLORS.creditColor,
    pointerEvents: 'none',
    paddingHorizontal: 10,
    paddingVertical: 2,
    ...$flexCenter
  },
  $creditBtnText: {
    color: $MSG_COLORS.creditTextColor,
    fontFamily: typography.fonts.pingfangSC.normal,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18
  }
});
