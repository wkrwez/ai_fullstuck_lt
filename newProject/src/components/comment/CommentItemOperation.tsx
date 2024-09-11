import * as Clipboard from 'expo-clipboard';
import {
  ColorValue,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { CommentClient } from '@/src/api/comment';
import { saveEmoji } from '@/src/api/emoji';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { useEmojiStore } from '@/src/store/emoji';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { catchErrorLog } from '@/src/utils/error-log';
import { WaterMarkType, getWaterMark } from '@/src/utils/getWaterMark';
import { reportClick } from '@/src/utils/report';
import { saveImageWithWmk } from '@/src/utils/savePicture';
import { XiaoliToast } from '@Components/toast/XiaoliToast';
import { StyleSheet } from '@Utils/StyleSheet';
import * as svg from '@Assets/image/svg';
import { showConfirm } from '../confirm';
import { hideLoading, showLoading } from '../loading';
import { SheetModal } from '../sheet';
import { showToast } from '../toast';
import { CommentItem } from '@/proto-registry/src/web/raccoon/comment/comment_pb';
import { PartialMessage } from '@bufbuild/protobuf';
import { useShallow } from 'zustand/react/shallow';
import { CommentEvent, CommentEventBus } from './eventbus';
import { InputType } from './typing';

interface CommentItemOperationsProps {
  theme?: Theme;
  detailId: string;
  parentCommentId?: string;
  commentInfo: PartialMessage<CommentItem>;
  visible: boolean;
  onClose: () => void;
}

interface OperationConfig {
  onPress: () => void;
  text: string;
  iconComp: (props: {
    color?: ColorValue;
    width?: number;
    height?: number;
  }) => React.JSX.Element;
  isWarning: boolean;
}

export function CommentItemOperations({
  theme = Theme.LIGHT,
  detailId,
  parentCommentId,
  commentInfo,
  visible,
  onClose
}: CommentItemOperationsProps) {
  const { loginIntercept } = useAuthState();
  const { user } = useAppStore();

  const themeConfig = getThemeColor(theme);

  const { commentId, name } = commentInfo;
  const { commonInfo } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(detailId);
      return {
        commonInfo: info?.commonInfo
      };
    })
  );

  // 是我的评论：评论的uid  和  当前登陆人一致
  const isMyComment = commentInfo?.uid === user?.uid;
  // 是我的文章：文章的uid  和  当前登陆人一致
  const isMyArticle = commonInfo?.profile?.uid === user?.uid;

  const copyToClipboard = async () => {
    reportClick('comment_copy', {
      commentid: commentId,
      status: parentCommentId ? 'reply' : 'comment'
    });
    onClose();

    let copyContent = commentInfo.content || '';
    if (commentInfo.emoji) {
      copyContent += '[表情]';
    }

    await Clipboard.setStringAsync(copyContent);
    showToast('已复制');
  };

  const onClickReply = () => {
    if (commentId) {
      onClose();
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {
        type: InputType.TEXT,
        parentCommentId: parentCommentId || commentId,
        repliedCommentId: commentId,
        repliedCommentName: name
      });
    }
  };

  const onClickDelete = () => {
    onClose();
    reportClick('comment_delete', {
      commentid: commentId,
      status: parentCommentId ? 'reply' : 'comment'
    });
    loginIntercept(
      async () => {
        showConfirm({
          theme,
          title: '确认删除评论?',
          content: '评论相关的回复将会同时被删除',
          confirmText: '确认',
          cancelText: '取消',
          onConfirm: async ({ close }) => {
            try {
              showLoading();
              await useDetailStore
                .getState()
                .removeComment(
                  detailId,
                  commentId || '',
                  parentCommentId || ''
                );
              showToast('删除成功');
            } catch (e) {
              showToast('删除失败');
            } finally {
              close();
              hideLoading();
            }
          }
        });
      },
      { scene: LOGIN_SCENE.COMMENT }
    );
  };

  const onClickReport = () => {
    reportClick('comment_report', {
      commentid: commentId,
      status: parentCommentId ? 'reply' : 'comment'
    });
    onClose();

    loginIntercept(
      async () => {
        showConfirm({
          theme,
          title: '确认举报评论?',
          confirmText: '确认',
          cancelText: '取消',
          onConfirm: async ({ close }) => {
            try {
              if (!commentId) {
                showToast('操作失败');
                return;
              }
              showLoading();
              const res = await CommentClient.reportComment({
                commentId,
                parentCommentId
              });
              console.log(`reportComment response: `, res);
              showToast('感谢您的热心反馈，我们将尽快进行举报确认');
              // setReportModalVisible(false);
            } catch (e) {
              console.log(e);
              showToast('举报失败');
            } finally {
              close();
              hideLoading();
            }
          }
        });
      },
      { scene: LOGIN_SCENE.COMMENT }
    );
  };

  const onAddEmoji = () => {
    loginIntercept(
      () => {
        const emojiId = commentInfo.emoji?.emojiId;
        if (!emojiId) {
          catchErrorLog('addemoji_error', commentInfo);
          return;
        }
        showLoading();
        reportClick('emoji_attend_button');
        saveEmoji({ emojiId })
          .then(res => {
            hideLoading();
            showToast(<XiaoliToast />);
            useEmojiStore.getState().init();
          })
          .catch(e => {
            hideLoading();
            if (e.code === 10004) {
              showToast('请勿重复添加~');
            } else {
              showToast('添加失败');
            }
            catchErrorLog('addemoji_error', e);
          });
      },
      { scene: LOGIN_SCENE.COMMENT }
    );
  };

  const onSaveEmoji = () => {
    const wholeImageUrl = commentInfo.emoji?.wholeImageUrl;
    if (!wholeImageUrl) {
      catchErrorLog('saveemoji_error', commentInfo);
      return;
    }
    reportClick('emoji_download_button');
    showLoading();
    saveImageWithWmk(wholeImageUrl, getWaterMark(WaterMarkType.EMOJI))
      .then(() => {
        hideLoading();
        showToast('保存成功~');
      })
      .catch(e => {
        hideLoading();
        catchErrorLog('saveemoji_error', e);
        showToast('保存失败~');
      });
  };

  const operations: (OperationConfig & {
    type: OperationType;
    visible: boolean;
  })[] = [
    {
      type: OperationType.ADD_EMOJI,
      onPress: onAddEmoji,
      text: '添加到表情',
      iconComp: svg.EmojiAddIcon,
      isWarning: false,
      visible: !!commentInfo.emoji
    },
    {
      type: OperationType.SAVE_EMOJI,
      onPress: onSaveEmoji,
      text: '保存表情到本地',
      iconComp: svg.GenShareImageIcon,
      isWarning: false,
      visible: !!commentInfo.emoji
    },
    {
      type: OperationType.REPLY,
      onPress: onClickReply,
      text: '回复',
      iconComp: svg.ReplyIcon,
      isWarning: false,
      visible: true
    },
    {
      type: OperationType.COPY,
      onPress: copyToClipboard,
      text: '复制',
      iconComp: svg.CopyIcon,
      isWarning: false,
      visible: true
    },
    {
      type: OperationType.REPORT,
      onPress: onClickReport,
      text: '举报',
      iconComp: svg.ReportIcon,
      isWarning: false,
      visible: !isMyComment
    },
    {
      type: OperationType.DELETE,
      onPress: onClickDelete,
      text: '删除',
      iconComp: svg.DeleteIcon,
      isWarning: true,
      visible: isMyComment || isMyArticle
    }
  ];

  const visibleOperations = operations.filter(item => item.visible);

  return (
    <SheetModal
      isVisible={visible}
      onClose={onClose}
      remainHeight={0}
      maskShown={true}
      maskOpacity={0.4}
      closeBtn={false}
      dragable={false}
      theme={theme}
    >
      <View
        style={[
          menuStyle.menuContainer,
          {
            backgroundColor: themeConfig.bg
          }
        ]}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={menuStyle.menuHeader}>
            <View
              style={[
                menuStyle.menuHeaderBar,
                {
                  backgroundColor: themeConfig.fontColor3
                }
              ]}
            ></View>
          </View>
        </TouchableWithoutFeedback>
        {visibleOperations.map((op, index) => (
          <View
            key={index}
            style={[
              menuStyle.menuItem,
              {
                borderBottomColor: themeConfig.border
              },
              index === visibleOperations.length - 1
                ? menuStyle.lastMenuItem
                : undefined
            ]}
          >
            {renderOption(op)}
          </View>
        ))}
      </View>
    </SheetModal>
  );

  function renderOption(config: OperationConfig) {
    const { onPress, iconComp: IconComp, text, isWarning } = config;

    return (
      <TouchableOpacity style={menuStyle.menuItemInner} onPress={onPress}>
        <View style={menuStyle.menuItemInner}>
          <IconComp
            color={isWarning ? themeConfig.warningColor : themeConfig.fontColor}
            width={menuStyle.iconSize.width}
            height={menuStyle.iconSize.height}
          />
          <Text
            style={[
              $operationText,
              {
                color: isWarning
                  ? themeConfig.warningColor
                  : themeConfig.fontColor
              }
            ]}
          >
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

enum OperationType {
  REPLY = 'reply',
  COPY = 'copy',
  REPORT = 'report',
  DELETE = 'delete',
  ADD_EMOJI = 'addemoji',
  SAVE_EMOJI = 'saveemoji'
}

const $operationText: TextStyle = {
  marginLeft: 8,
  fontWeight: '500'
};

const menuStyle = StyleSheet.create({
  menuContainer: {
    width: '100%',
    height: 'auto',
    zIndex: 100
  },
  menuHeader: {
    width: '100%',
    height: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuHeaderBar: {
    width: 30,
    height: 4,
    borderRadius: 100
  },
  menuItem: {
    width: '100%',
    height: 60,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  lastMenuItem: {
    borderBottomWidth: 0
  },
  menuItemInner: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 60
  },
  iconSize: {
    width: 20,
    height: 20
  }
});
