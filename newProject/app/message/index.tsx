import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { showToast } from '@/src/components';
import { CommentInput } from '@/src/components/comment/Input';
import {
  CommentEvent,
  CommentEventBus
} from '@/src/components/comment/eventbus';
import { ListBottomTip } from '@/src/components/listBottomTip';
import {
  SkeletonCircle,
  SkeletonColumn,
  SkeletonRow,
  SkeletonSpan
} from '@/src/components/skeletion';
import Notification from '@/src/components/v2/notification';
import useNotification from '@/src/components/v2/notification/hook';
import { useMessageStore } from '@/src/store/message';
import { EnotiType, useStorageStore } from '@/src/store/storage';
import { CommonColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { reportExpo } from '@/src/utils/report';
import { EmptyPlaceHolder } from '@Components/Empty';
import { InboxMsgCard } from '@Components/message';
import { Screen } from '@Components/screen';
import { Text } from '@Components/text';
import { logWarn } from '@Utils/error-log';
import {
  CommentWorkMsg,
  EventType,
  InboxMsg
} from '@step.ai/proto-gen/raccoon/inbox/inbox_pb';

const MAX_SIZE = 10;
export default function () {
  const { query, read } = useMessageStore.getState();
  const [list, setList] = useState<InboxMsg[]>([]);
  const retryTimeRef = useRef(0);
  const [pagination, setPagination] = useState<{
    size: number;
    cursor: string;
  }>({
    size: MAX_SIZE,
    cursor: ''
  });
  const [isPulling, setPulling] = useState(false);
  const isEnd = useRef(false);

  const { notificationVisible, setNotificationVisible } = useNotification({
    expire: 7,
    signal: EnotiType.notiReachDatedByMsgCenter
  });

  const onCloseNotification = () => {
    setNotificationVisible(false);
  };

  const params = useLocalSearchParams();

  useEffect(() => {
    setPulling(true);
    reRequrst();
  }, []);

  // 同步点赞评论的操作
  useEffect(() => {
    const onLikeCommentInDetailPage = ({
      commentId,
      like
    }: {
      commentId: String;
      like: boolean;
    }) => {
      const index = list.findIndex(
        item =>
          (item.eventType === EventType.CommentWork ||
            item.eventType === EventType.ReplyComment) &&
          (item.msg.value as CommentWorkMsg)?.senderComment?.id === commentId
      );

      if (index != -1) {
        const updatedList = [...list];
        (updatedList[index].msg.value as CommentWorkMsg).isLiked = like;
        setList(updatedList);
      }
    };
    CommentEventBus.on(CommentEvent.LIKE_COMMENT, onLikeCommentInDetailPage);

    return () => {
      CommentEventBus.off(CommentEvent.LIKE_COMMENT, onLikeCommentInDetailPage);
    };
  }, [list]);

  return (
    <Screen
      title="消息列表"
      headerStyle={{
        borderBottomColor: 'rgba(210,210,210,1)',
        borderBottomWidth: 0.2
      }}
      screenStyle={{
        backgroundColor: CommonColor.white
      }}
    >
      <View style={{ width: '100%', height: '100%' }}>
        <ScrollView
          onMomentumScrollEnd={onMomentumScrollEnd}
          showsVerticalScrollIndicator={false}
        >
          {list.length === 0 && isPulling ? (
            <SkeletonColumn style={{ padding: 16 }} gap={32} repeat={8}>
              <SkeletonRow gap={12}>
                <SkeletonCircle size={50} />
                <SkeletonSpan height={72} style={{ flex: 1 }} radius={8} />
              </SkeletonRow>
            </SkeletonColumn>
          ) : null}

          {list.length === 0 && !isPulling ? (
            <View style={{ marginTop: 238, zIndex: 99 }}>
              <EmptyPlaceHolder>
                <Text color="rgba(0,0,0,0.4)">还没有任何消息</Text>
              </EmptyPlaceHolder>
            </View>
          ) : null}

          {Boolean(list.length)
            ? list.map((item, index) => (
                <InboxMsgCard
                  key={`${item.msgId} + ${index}`}
                  data={item}
                  id={item.msgId}
                  messageStyle={{
                    marginTop: index === 0 ? 10 : 8,
                    marginBottom: index === list.length - 1 ? 30 : 8
                  }}
                />
              ))
            : null}

          {Boolean(list.length) && isPulling && (
            <View
              style={{
                width: '100%',
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator size="small" color="rgba(217, 217, 217, 1)" />
            </View>
          )}

          {isEnd.current && !isPulling && Boolean(list.length) ? (
            <ListBottomTip />
          ) : null}
        </ScrollView>
      </View>
      <Notification
        visible={notificationVisible}
        onClose={onCloseNotification}
        slogan={'开启 App 通知，才能及时收到互动通知噢'}
        signal={EnotiType.notiReachDatedByMsgCenter}
      />
      <CommentInput showDisplayInput={false} />
    </Screen>
  );

  function queryList() {
    return query({
      pagination: pagination
    }).then(res => {
      setPagination(prev => ({
        ...prev,
        cursor: res.pagination?.nextCursor || ''
      }));

      isEnd.current = !res.pagination?.nextCursor;
      setList(data => {
        return data.concat(res.msgs);
      });
      return res.msgs;
    });
  }

  function reRequrst() {
    if (retryTimeRef.current > 3) {
      showToast('加载失败，请重试');
      logWarn('请求消息列表失败3次', {});
      return;
    }
    setPulling(true);
    retryTimeRef.current += 1;
    queryList()
      .then(res => {
        setPulling(false);
        const maxMsgId = Math.max(...res.map(i => Number(i.msgId)));
        if (res.length > 0) {
          reportExpo('message', { status: '0' });
          read(maxMsgId.toString());
        } else {
          reportExpo('message', { status: '1' });
        }
        // read(BigInt(maxMsgId))
      })
      .catch(e => {
        setPulling(false);
        logWarn('请求消息列表失败', e);
        if (retryTimeRef.current >= 3) {
          showToast('加载失败，请重试');
        } else {
          reRequrst();
        }
        return Promise.reject(e);
      });
  }

  function onMomentumScrollEnd() {
    if (isEnd.current) return;
    if (isPulling) {
      return;
    }
    setPulling(true);
    queryList()
      .then(res => {
        setPulling(false);
        return res;
      })
      .catch(e => {
        setPulling(false);
        logWarn('请求消息列表失败', e);
        showToast('加载失败，请重试');
        return Promise.reject(e);
      });
  }
}
