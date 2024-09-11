import { useMemoizedFn } from 'ahooks';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { ImageStyle, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { InView } from 'react-native-intersection-observer';
import { runOnJS } from 'react-native-reanimated';
import { Image } from '@/src/components/image';
import { useAppStore } from '@/src/store/app';
import { useDetailStore } from '@/src/store/detail';
import { CommonColor, getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportClick, reportExpo } from '@/src/utils/report';
import { formatDate } from '@/src/utils/transDate';
import { Avatar } from '../avatar';
import { Icon } from '../icons';
import { LikeAlign, LikeStyle } from '../like/LikeIcon';
import { useShallow } from 'zustand/react/shallow';
import { CommentItemOperations } from './CommentItemOperation';
import { CommentLike } from './CommentLike';
import { CommentEvent, CommentEventBus } from './eventbus';
import { CommnetItemProps, InputType } from './typing';

export const CommentItemComp = (props: CommnetItemProps) => {
  const { commonInfo, updateCertainCommentInfo } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(props.detailId);
      return {
        commonInfo: info?.commonInfo,
        updateCertainCommentInfo: state.updateCertainCommentInfo
      };
    })
  );

  const { user } = useAppStore();

  const { comment, detailId, theme, parentComment, containerStyle } = props;
  const {
    commentId,
    content,
    isAuthor,
    isAuthorLiked,
    isLiked,
    name,
    uid,
    totalLikes,
    emoji,
    repliedComment
  } = comment;
  const repliedTarget = repliedComment || parentComment;
  const [menuModalVisible, setMenuModalVisible] = useState(false);

  // 是作者自己的评论：文章的uid  和  评论的uid一致
  const isAuthorSelfComment = commonInfo?.profile?.uid === uid;
  // 是我的评论：评论的uid  和  当前登陆人一致
  const isMyComment = uid === user?.uid;
  // 是否为回复
  const isReply = Boolean(repliedTarget);
  // 是否为回复的回复
  const isSecondaryReply =
    Boolean(repliedComment?.commentId) &&
    repliedComment?.commentId !== parentComment?.commentId;

  const themeConfig = getThemeColor(theme);

  const onGotoUserpage = () => {
    reportClick('comment_user', {
      userid: uid,
      status: isReply ? 'reply' : 'comment'
    });
  };

  const reportExposure = () => {
    reportExpo(isReply ? 'reply_expo' : 'comment_expo', {
      commentid: commentId,
      contentid: detailId,
      parentid: repliedTarget?.commentId
    });
  };

  const showOperations = () => {
    Haptics.selectionAsync();
    setMenuModalVisible(true);
  };

  const gotoPreviewEmoji = useMemoizedFn(() => {
    if (emoji) {
      router.push(`/emoji/recreate/${emoji.emojiId}`);
      reportClick('emojI_pre_button');
    }
  });

  const onLikeSuccess = (like?: boolean) => {
    reportClick(
      'comment_button',
      {
        issuccess: true,
        commentid: commentId,
        status: repliedTarget ? 'reply' : 'comment'
      },
      'like'
    );

    if (commentId) {
      updateCertainCommentInfo(detailId, commentId, {
        isLiked: Boolean(like),
        totalLikes: like ? (totalLikes || 0) + 1 : (totalLikes || 0) - 1
      });
    }
  };

  const onReply = useMemoizedFn(() => {
    if (commentId) {
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {
        type: InputType.TEXT,
        parentCommentId: parentComment?.commentId || commentId,
        repliedCommentId: commentId,
        repliedCommentName: name
      });
    }
  });

  const onLongPressComment = Gesture.LongPress().onEnd(() => {
    runOnJS(showOperations)();
  });

  const onOneTapComment = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      runOnJS(onReply)();
    });

  const composed = Gesture.Exclusive(onOneTapComment, onLongPressComment);

  const onOneTapEmoji = Gesture.Tap().onStart(() => {
    runOnJS(gotoPreviewEmoji)();
  });
  const onOneTapEmoji2 = Gesture.Tap().onStart(() => {
    runOnJS(gotoPreviewEmoji)();
  });

  return (
    <View>
      <View
        style={[
          $container,
          {
            paddingTop: isReply ? 16 : 0
          },
          containerStyle
        ]}
      >
        {isReply ? <View style={$replyItemPlaceholder} /> : null}
        <View style={$avatarContainer}>
          <Avatar
            size={isReply ? 24 : 36}
            profile={comment}
            onGotoUserpage={onGotoUserpage}
          ></Avatar>
        </View>
        <View style={$contentContainer}>
          <View style={$left}>
            <View style={$titleContainer}>
              <View style={$authorName}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[$authorNameText, { color: themeConfig.fontColor3 }]}
                >
                  {name}
                </Text>
              </View>
              {isAuthor ? (
                <View
                  style={[
                    $titleIsAuthor,
                    {
                      backgroundColor:
                        theme === Theme.DARK
                          ? CommonColor.brand1
                          : CommonColor.brand3
                    }
                  ]}
                >
                  <Text
                    style={[
                      $titleIsAuthorText,
                      {
                        color:
                          theme === Theme.DARK
                            ? themeConfig.fontColor
                            : CommonColor.brand1
                      }
                    ]}
                  >
                    作者
                  </Text>
                </View>
              ) : null}
            </View>
            <GestureDetector gesture={composed}>
              <View>
                <View>
                  {content || isSecondaryReply ? (
                    <View style={$content}>
                      <Text>
                        {isSecondaryReply && repliedTarget ? (
                          <>
                            <Text
                              style={[
                                $contentText,
                                { color: themeConfig.fontColor }
                              ]}
                            >
                              回复
                            </Text>
                            <Text
                              style={[
                                $contentText,
                                { color: themeConfig.fontColor3 }
                              ]}
                            >
                              {repliedTarget.name}
                            </Text>
                            <Text
                              style={[
                                $contentText,
                                { color: themeConfig.fontColor }
                              ]}
                            >
                              ：
                            </Text>
                          </>
                        ) : null}

                        <Text
                          style={[
                            $contentText,
                            { color: themeConfig.fontColor }
                          ]}
                        >
                          {content}
                        </Text>
                      </Text>
                    </View>
                  ) : null}
                  {emoji ? (
                    <View>
                      <GestureDetector gesture={onOneTapEmoji}>
                        <Image
                          style={$emojiContent}
                          source={emoji.wholeImageUrl}
                          contentFit="contain"
                          tosSize="size4"
                        />
                      </GestureDetector>

                      {!isMyComment ? (
                        <GestureDetector gesture={onOneTapEmoji2}>
                          <View style={$emojiTip}>
                            <Icon
                              size={13}
                              icon={'comment_emoji'}
                              style={{
                                tintColor: CommonColor.blue3
                              }}
                            />
                            <Text style={$emojiText}>可以做表情包啦!</Text>
                          </View>
                        </GestureDetector>
                      ) : null}
                    </View>
                  ) : null}
                </View>
                <Text style={$footerContainer}>
                  <Text
                    style={[$createTime, { color: themeConfig.fontColor3 }]}
                  >
                    {formatDate(Number(comment.time) * 1000)}
                  </Text>
                  <Text>{'  '}</Text>
                  <Text style={[$replyTip, { color: themeConfig.fontColor2 }]}>
                    回复
                  </Text>
                </Text>
                {isAuthorLiked && !isAuthorSelfComment ? (
                  <View
                    style={[
                      $titleIsAuthorLiked,
                      { backgroundColor: themeConfig.eleBg }
                    ]}
                  >
                    <Text
                      style={[
                        $titleIsAuthorLikedText,
                        { color: themeConfig.fontColor2 }
                      ]}
                    >
                      作者赞过
                    </Text>
                  </View>
                ) : null}
              </View>
            </GestureDetector>
          </View>
          <View style={$right}>
            <CommentLike
              liked={isLiked as boolean}
              likeCount={totalLikes}
              commentId={commentId || ''}
              needEmitEvent={true}
              onLikeSuccess={onLikeSuccess}
              inactiveColor={themeConfig.fontColor3}
              inactiveIconColor={themeConfig.eleBg}
              activeColor={themeConfig.fontColor3}
              likeIconStyle={LikeStyle.SOLID}
              fontStyle={{
                fontSize: 12,
                fontWeight: '400'
              }}
              size={18}
              align={LikeAlign.COLUMN}
            />
          </View>
        </View>
      </View>
      <InView
        style={$exposureTrigger}
        triggerOnce={true}
        onChange={inView => inView && reportExposure()}
      />
      {menuModalVisible ? (
        <CommentItemOperations
          theme={theme}
          commentInfo={comment}
          parentCommentId={parentComment?.commentId}
          detailId={detailId}
          visible={menuModalVisible}
          onClose={() => setMenuModalVisible(false)}
        />
      ) : null}
    </View>
  );
};

const $container: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'flex-start'
};
const $avatarContainer: ViewStyle = {
  flex: 0,
  borderRadius: 18,
  // backgroundColor: '#ccc',
  marginRight: 12
};
const $contentContainer: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center'
};
const $left: ViewStyle = {
  flex: 1
};
const $right: ViewStyle = {
  marginLeft: 24,
  minWidth: 30,
  flex: 0
};

const $exposureTrigger: ViewStyle = {
  height: 1,
  backgroundColor: 'transparent'
};

const $titleContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

const $authorName: ViewStyle = {
  width: 'auto',
  flexShrink: 1
};
const $authorNameText: TextStyle = {
  fontSize: 13,
  lineHeight: 18
};
const $titleIsAuthor: ViewStyle = {
  flex: 0,
  height: 16,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 6,
  paddingRight: 6,
  marginLeft: 6,
  alignSelf: 'flex-start'
};
const $titleIsAuthorText: TextStyle = {
  fontSize: 9,
  fontWeight: '500'
};
const $titleIsAuthorLiked: ViewStyle = {
  height: 16,
  borderRadius: 100,
  backgroundColor: '#F4F4F5',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 6,
  paddingRight: 6,
  marginTop: 6,
  alignSelf: 'flex-start'
};
const $titleIsAuthorLikedText: TextStyle = {
  color: 'rgba(0, 0, 0, 0.54)',
  fontSize: 9,
  lineHeight: 15,
  fontWeight: '500'
};

const $content: ViewStyle = {
  marginTop: 2
};

const $contentText: TextStyle = {
  fontSize: 14,
  lineHeight: 22
};

const $footerContainer: ViewStyle = {
  marginTop: 4
};

const $createTime: TextStyle = {
  fontSize: 12,
  lineHeight: 17
};

const $replyTip: TextStyle = {
  fontSize: 12,
  fontWeight: '500',
  lineHeight: 17
};

const $emojiContent: ImageStyle = {
  width: 120,
  height: 120,
  borderWidth: 0.5,
  borderColor: CommonColor.white2,
  borderRadius: 2.5,
  marginTop: 6
};

const $emojiTip: ViewStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  marginTop: 8
};

const $emojiText: TextStyle = {
  marginLeft: 4,
  color: CommonColor.blue3,
  fontSize: 11,
  lineHeight: 13,
  height: 13
};

const $replyItemPlaceholder: ViewStyle = {
  width: 48,
  height: 1
};
