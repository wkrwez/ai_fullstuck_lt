import { Text, View } from 'react-native';
import { StyleSheet } from '@/src/utils';

interface ReplyProps {
  reply?: string;
}

export function Reply(props: ReplyProps) {
  return (
    <View style={st.$replyContainer}>
      <View style={st.$replyIcon}></View>
      <Text ellipsizeMode={'tail'} numberOfLines={3} style={st.$replyText}>
        {props?.reply}
      </Text>
    </View>
  );
}

const st = StyleSheet.create({
  $replyContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 2,
    marginTop: 6
  },
  $replyIcon: {
    width: 4,
    height: 13,
    marginRight: 8,
    marginTop: 2.5,
    backgroundColor: 'rgba(235, 235, 235, 1)',
    borderRadius: 100
  },
  $replyText: {
    fontFamily: 'PingFang SC',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.6)'
  }
});
