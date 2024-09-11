import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Icon } from '@/src/components';
import { CommentBubble } from '@/src/components/comment/CommentBubble';
import { CommentModal } from '@/src/components/comment/CommentModal';
import { DetailLike } from '@/src/components/like';
import { LikeStyle } from '@/src/components/like/LikeIcon';
import { useDetailStore } from '@/src/store/detail';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { colors, typography } from '@/src/theme';
import { CommonColor, getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { formatNumber } from '@/src/utils/transNum';
import { BUTTON_HEIGHT } from '../../_constants';
import { useShallow } from 'zustand/react/shallow';

export function InteractionBottom({ detailId }: { detailId: string }) {
  const { topCommentId } = useLocalSearchParams();

  const [visible, setVisible] = useState(false);
  const { commonInfo } = useDetailStore(
    useShallow(state => {
      const detail = state.getDetail(detailId);
      return {
        commentInfo: detail?.commentInfo,
        commonInfo: detail?.commonInfo
      };
    })
  );

  const { topic, world } = useParallelWorldMainStore(
    useShallow(state => ({
      world: state.worldInfo,
      topic: state.topic
    }))
  );

  const displayCommentCountStr =
    commonInfo?.stat?.comments && commonInfo?.stat?.comments > 0
      ? formatNumber(commonInfo.stat.comments) || ''
      : '';

  const onPressBtn = () => {
    reportClick('buttombar_button', { contentid: detailId }, 'comment');
    setVisible(true);

    const originId = world.originalCardId;
    topic &&
      reportExpo('world_comment_topic', {
        contentid: originId
      });
  };

  const clickHandler = (isLike: boolean) => {
    reportClick('buttombar_button', { contentid: detailId, isLike }, 'like');
  };

  const clickTopicHandler = () => {
    setVisible(false);
    const originId = world.originalCardId;

    router.push(`/topic/world/${originId}`);
    topic &&
      reportClick('world_comment_topic', {
        contentid: originId
      });
  };

  useEffect(() => {
    // 当有置顶评论时，自动打开评论弹窗
    if (detailId && topCommentId) {
      setVisible(true);
    }
  }, [detailId]);

  return (
    <View style={$bottomContainer}>
      <DetailLike
        liked={Boolean(commonInfo?.stat?.liked)}
        likeCount={Number(commonInfo?.stat?.beingLikeds || 0)}
        cardId={detailId || ''}
        size={28}
        onLikeClicked={clickHandler}
        likeIconStyle={LikeStyle.LINEAR}
        inactiveColor={CommonColor.white}
        renderText={(count = 0) => (
          <View style={$textContainer}>
            <Text style={$text}>
              {count > 0 ? formatNumber(count) : '点赞'}
            </Text>
          </View>
        )}
      />
      <Pressable onPress={onPressBtn}>
        <View style={$commentIconContainer}>
          <Icon size={30} icon="comment_light"></Icon>
          <View style={$textContainer}>
            <Text style={$text}>{displayCommentCountStr || '评论'}</Text>
          </View>
          <CommentModal
            theme={Theme.DARK}
            detailId={detailId}
            visible={visible}
            onClose={() => setVisible(false)}
            headerSlot={
              topic ? (
                <View style={[$commentHeader]}>
                  <Text
                    style={{
                      color: getThemeColor(Theme.DARK).fontColor3,
                      marginRight: 4,
                      flex: 0
                    }}
                  >
                    更多平行世界：
                  </Text>
                  <Pressable
                    onPress={clickTopicHandler}
                    style={{
                      flex: 1
                    }}
                  >
                    <Text
                      style={{
                        color: CommonColor.blue,
                        marginRight: 4
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      #{topic}
                    </Text>
                  </Pressable>
                </View>
              ) : null
            }
          />
        </View>
      </Pressable>
      {/* <CommentBubble theme={Theme.DARK} style={{ right: -10, top: -22 }} /> */}
    </View>
  );
}

const bgColor = '#1F2935';

const $bottomContainer: ViewStyle = {
  ...StyleSheet.rowStyle,
  backgroundColor: bgColor,
  height: BUTTON_HEIGHT,
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 12
};

const $textContainer: ViewStyle = {
  paddingVertical: 0,
  paddingHorizontal: 2,
  position: 'absolute',
  left: 20,
  backgroundColor: bgColor,
  borderRadius: 4,
  alignSelf: 'flex-start'
};

const $text: TextStyle = {
  fontSize: 12,
  lineHeight: 14,
  fontWeight: '900',
  color: colors.white,
  fontFamily: typography.fonts.baba.heavy
  //   textShadowOffset: { width: 20, height: 20 },
  //   textShadowColor: bgColor,
  //   textShadowRadius: 20
};

const $commentIconContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 34,
  marginRight: 20
};

const $commentHeader: ViewStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginBottom: 20,
  paddingRight: 50
};
