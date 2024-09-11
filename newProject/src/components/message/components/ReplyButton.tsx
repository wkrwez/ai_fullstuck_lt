import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useAppStore } from '@/src/store/app';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';
import { CommonColor } from '@/src/theme/colors/common';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import { Avatar } from '../../avatar';
import { CommentEvent, CommentEventBus } from '../../comment/eventbus';
import { InputType } from '../../comment/typing';

interface ReplyButtonProps {
  detailId?: string;
  commentId: string;
  parentCommentId?: string;
  commentUserName?: string;
  brandtype?: number;
  id: string;
  case: string;
}

export function ReplyButton(props: ReplyButtonProps) {
  const { commentId, commentUserName, parentCommentId, detailId, brandtype } =
    props;
  const user = useAppStore(state => state.user);

  const onReply = () => {
    if (commentId) {
      useEmojiCreatorStore.getState().randomDefaultEmojiInfo(brandtype);
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {
        type: InputType.TEXT,
        detailId: detailId || '',
        parentCommentId: parentCommentId || '',
        repliedCommentId: commentId || '',
        repliedCommentName: commentUserName || ''
      });
    }
    reportClick('message_reply', {
      type: props.case === 'likeComment' ? 3 : 7, // 3: 内容被评论，7：内容被回复
      contentid: detailId,
      commentid: commentId,
      parentCommentId,
      sourceid: props.id,
      case: props.case
    });
  };

  return (
    <Pressable onPress={onReply}>
      <View style={$buttonContainer}>
        <Image
          source={formatTosUrl(user?.avatar || '', {
            size: 'size10'
          })}
          style={{ width: 20, height: 20, borderRadius: 20 }}
        ></Image>
        <Text style={$text}>回复</Text>
      </View>
    </Pressable>
  );
}

const $buttonContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  height: 26,
  borderRadius: 13,
  backgroundColor: 'rgba(245, 245, 245, 1)',
  alignItems: 'center',
  paddingLeft: 3,
  paddingRight: 15
};

const $text: TextStyle = {
  marginLeft: 6,
  fontSize: 12,
  lineHeight: 14,
  fontWeight: '600',
  color: CommonColor.black2
};
