import { useMemoizedFn } from 'ahooks';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { usePageFocused } from '@/src/hooks/usePageFocused';
import { RefreshType, useDetailStore } from '@/src/store/detail';
import {
  CommonColor,
  darkSceneColor,
  lightSceneColor
} from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet } from '@Utils/StyleSheet';
import { EmptyPlaceHolder } from '../Empty';
import { useShallow } from 'zustand/react/shallow';
import { CommentGroup } from './CommentGroup';
import { CommentSkeletion } from './CommentSkeleton';
import { CommentEvent, CommentEventBus } from './eventbus';

export const CommentList = ({
  detailId,
  theme = Theme.LIGHT,
  emptycontainerStyle: $customEmptyContainerStyle,
  containerStyle: $customContainerStyle
}: {
  detailId: string;
  theme?: Theme;
  emptycontainerStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}) => {
  const { topCommentId, topReplyId } = useLocalSearchParams();

  const [isPulling, setIsPulling] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [cursor, setCursor] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);

  const pageFocused = usePageFocused();

  const {
    commentList = [],
    pullCommentData,
    commentNeedForceLoad
  } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(detailId);
      return {
        commentList: info?.commentList,
        commentNeedForceLoad: info?.commentNeedForceLoad,
        pullCommentData: state.pullCommentData
      };
    })
  );

  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;

  const onPressEmpty = () => {
    // 唤起input输入
    CommentEventBus.emit(CommentEvent.TRIGGER_EDIT_COMMENT, {
      parentCommentId: '',
      repliedCommentId: '',
      repliedCommentName: ''
    });
  };

  const onReload = () => {
    fetchCommitList(true);
  };

  const fetchCommitList = useMemoizedFn(async (isInit: boolean) => {
    if (isPulling || !hasMore) {
      return;
    }

    // error 时无法触发 load more
    if (commentList.length === 0 && error && !isInit) {
      return;
    }

    try {
      setIsPulling(true);
      setError(undefined);
      const refrehType =
        topCommentId || commentNeedForceLoad
          ? RefreshType.FORCE_REFRESH
          : RefreshType.SLIENT_REFRESH;

      const res = await pullCommentData(
        detailId,
        isInit || cursor === '' ? refrehType : RefreshType.NO_REFRESH,
        cursor,
        {
          commentId: topCommentId as string,
          replyId: topReplyId as string
        }
      );

      const nextCursor = res?.pagination?.nextCursor || '';

      setCursor(nextCursor);
      setHasMore(nextCursor !== '');
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsPulling(false);
    }
  });

  useEffect(() => {
    const fetchMoreHandler = () => fetchCommitList(false);
    CommentEventBus.on('scrollComment', fetchMoreHandler);
    return () => {
      CommentEventBus.off('scrollComment', fetchMoreHandler);
    };
  }, []);

  useEffect(() => {
    if (error && pageFocused) {
      const onBeforeSubmit = async ({ onReady }: { onReady: () => void }) => {
        await fetchCommitList(true);
        onReady();
      };
      CommentEventBus.on(CommentEvent.BEFORE_SUBMIT, onBeforeSubmit);
      return () => {
        CommentEventBus.off(CommentEvent.BEFORE_SUBMIT, onBeforeSubmit);
      };
    }
  }, [error, pageFocused]);

  useEffect(() => {
    fetchCommitList(true);
  }, []);

  if (commentList.length === 0) {
    if (isPulling) {
      return (
        <View style={[$container, $customContainerStyle]}>
          <CommentSkeletion theme={theme} />
        </View>
      );
    }

    const tipText = error ? '小狸走丢了' : '小狸在等第一个评论';
    const btnText = error ? '刷新' : '去评论';
    const onPress = error ? onReload : onPressEmpty;
    return (
      <View
        style={[
          $emptyContainer,
          $customContainerStyle,
          $customEmptyContainerStyle
        ]}
      >
        <EmptyPlaceHolder
          type={theme === Theme.DARK ? 'recommendDark' : undefined}
        >
          <Text style={[$emptyText, { color: themeConfig.fontColor3 }]}>
            {tipText}
          </Text>
          <Text>&nbsp;</Text>
          <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
            <Text style={$emptyHighlight}>{btnText}</Text>
          </TouchableOpacity>
        </EmptyPlaceHolder>
      </View>
    );
  }

  return (
    <View style={[$container, $customContainerStyle]}>
      {commentList.map(comment => (
        <CommentGroup
          key={comment.commentId}
          detailId={detailId}
          comment={comment}
          theme={theme}
        />
      ))}
      {!isPulling && !hasMore ? (
        <Text style={[$bottomTip, { color: themeConfig.fontColor3 }]}>
          小狸也是有底线的～
        </Text>
      ) : null}
      {isPulling ? (
        <View>
          <ActivityIndicator size="small" color="rgba(217, 217, 217, 1)" />
        </View>
      ) : null}
      {error ? (
        <View style={[$bottomTipWrapper]}>
          <Text style={[{ color: themeConfig.fontColor3 }]}>加载失败，</Text>
          <Pressable
            onPress={() => fetchCommitList(false)}
            style={{ height: 18 }}
          >
            <Text style={{ color: CommonColor.red }}>重试</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

const $container: ViewStyle = {
  paddingTop: 20
};

const $emptyContainer: ViewStyle = {
  minHeight: 250,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const $emptyText: TextStyle = {
  fontWeight: '400',
  fontSize: 14,
  lineHeight: 20
};

const $emptyHighlight: TextStyle = {
  fontWeight: '500',
  fontSize: 14,
  lineHeight: 20,
  color: 'rgba(246, 135, 20, 1)'
};

const $bottomTip: TextStyle = {
  width: '100%',
  textAlign: 'center',
  alignItems: 'center'
};

const $bottomTipWrapper: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row'
};
