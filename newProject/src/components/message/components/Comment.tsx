import { Text, View } from 'react-native';
import { StyleSheet } from '@/src/utils';
import {
  CommentMsg,
  CommentState
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';
import { Reply } from './Reply';

interface CommentProps {
  content?: CommentMsg;
  replyTarget?: CommentMsg;
}

export function Comment(props: CommentProps) {
  const renderContent = (c: CommentMsg) => {
    return c.state === CommentState.Visible
      ? c.content
      : `[${Boolean(c.parentCommentId) ? '此回复' : '此评论'}已删除]`;
  };
  return (
    <View style={st.$commentContainer}>
      {props.content && (
        <Text ellipsizeMode={'tail'} numberOfLines={3} style={st.$commentText}>
          {renderContent(props.content)}
        </Text>
      )}
      {props.replyTarget && (
        <Reply reply={renderContent(props.replyTarget)}></Reply>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  $commentContainer: {
    width: 220,
    marginLeft: 74,
    marginTop: 6
  },
  $commentText: {
    fontFamily: 'PingFang SC',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'left'
  }
});
