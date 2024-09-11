import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Animated, Pressable, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsetsStyle } from '@/src/hooks';
import { useDetailStore } from '@/src/store/detail';
import { CommonColor } from '@/src/theme/colors/common';
import { StyleSheet } from '@/src/utils';
import { reportClick } from '@/src/utils/report';
import { CommentBubble } from '@Components/comment/CommentBubble';
import { TakePhotoButton } from '@Components/detail/takePhotoButton';
import { Image, ImageStyle } from '@Components/image';
import { Text } from '@Components/text';
import { CommentEvent, CommentEventBus } from '../../comment/eventbus';
import { DetailLike, DetailLikeActions } from '../../like';
import { LikeStyle } from '../../like/LikeIcon';
import { DetailEventBus } from '@/app/detail/eventbus';
import { useShallow } from 'zustand/react/shallow';

const jumpComment = require('@Assets/image/comment/jumpComment.png');

interface BottomBarProps {
  detailId: string;
  onTakePhoto: () => void;
}

export interface BottombarHandle {
  onLike: () => void;
}

export const BottomBar = forwardRef<BottombarHandle, BottomBarProps>(
  (props: BottomBarProps, ref) => {
    const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
    const { detailId } = props;

    const likeRef = useRef<DetailLikeActions>(null);
    useImperativeHandle(
      ref,
      () => ({
        onLike: () => {
          likeRef.current?.changeLikeStatus(true);
        }
        // focus: () => inputRef.current?.focus(),
        // blur: () => inputRef.current?.blur()
      }),
      []
    );
    const { detail, commonInfo } = useDetailStore(
      useShallow(state => {
        const info = state.getDetail(detailId);
        return {
          detail: info?.detail,
          commonInfo: info?.commonInfo
        };
      })
    );

    console.log(`detail and commonInfo: `, detail, commonInfo);
    const paddingBottom = Math.max(
      Number($containerInsets.paddingBottom ?? 0),
      16
    );
    return (
      <View
        style={[
          $wrap,
          {
            height: BOTTOM_HEIGHT + paddingBottom,
            paddingBottom: paddingBottom
          }
        ]}
      >
        <TakePhotoButton onPress={props.onTakePhoto} />
        <View style={$right}>
          {commonInfo?.stat?.liked !== undefined ? (
            <DetailLike
              ref={likeRef}
              liked={commonInfo?.stat?.liked}
              likeCount={Number(commonInfo?.stat?.beingLikeds || 0)}
              cardId={detail?.cardId || ''}
              size={26}
              fontStyle={$iconCount}
              likeIconStyle={LikeStyle.LINEAR}
              emptyText="点赞"
              onLikeClicked={() => {
                reportClick(
                  'buttombar_button',
                  { contentid: detailId },
                  'like'
                );
              }}
            />
          ) : null}
          <JumpComment
            commentCount={commonInfo?.stat?.comments}
            onClicked={() => {
              reportClick(
                'buttombar_button',
                { contentid: detailId },
                'comment'
              );
              reportClick(
                'comment_input',
                { contentid: detailId, from: 2 },
                'click'
              );
            }}
          />
        </View>
      </View>
    );
  }
);

const JumpComment = ({
  commentCount = BigInt(0),
  onClicked
}: {
  commentCount?: bigint;
  onClicked: () => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = async () => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = async () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const displayCommentCountStr =
    Number(commentCount) === 0 ? '评论' : String(commentCount);

  const scrollToComment = () => {
    onClicked?.();
    DetailEventBus.emit('scrollToComment');
    setTimeout(() => {
      CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {
        parentCommentId: '',
        repliedCommentId: '',
        repliedCommentName: ''
      });
    });
  };
  const tapOnce = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      console.log('scrollToComment');
      runOnJS(scrollToComment)();
    });

  return (
    <>
      <GestureDetector gesture={tapOnce}>
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
          <Animated.View
            style={[
              $iconContaier,
              {
                maxWidth: 70,
                marginLeft: 30,
                transform: [{ scale }]
              }
            ]}
          >
            <Image source={jumpComment} style={{ width: 24, height: 24 }} />
            <Text style={$iconCount}>{displayCommentCountStr}</Text>
          </Animated.View>
        </Pressable>
      </GestureDetector>
      <CommentBubble />
    </>
  );
};

const BOTTOM_HEIGHT = 52;
const $wrap: ViewStyle = {
  ...StyleSheet.rowStyle,
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  borderTopWidth: 0.5,
  borderColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.08),
  backgroundColor: StyleSheet.currentColors.white,
  paddingRight: 16,
  paddingTop: 16,
  paddingLeft: 16
};

const $iconContaier: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
};

const $right: ViewStyle = {
  ...StyleSheet.rowStyle
};

const $iconCount: TextStyle = {
  fontSize: 14,
  fontWeight: '600',
  color: CommonColor.titleGray,
  marginLeft: 10
};
