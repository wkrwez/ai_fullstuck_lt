import { useMemoizedFn } from 'ahooks';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { IOScrollView } from 'react-native-intersection-observer';
import Reanimated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { EmptyPlaceHolder } from '@/src/components/Empty';
import {
  CommentEvent,
  CommentEventBus
} from '@/src/components/comment/eventbus';
import { hideShare } from '@/src/components/share';
import { LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks/useAuthState';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useDetailStore } from '@/src/store/detail';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { CommonColor } from '@/src/theme/colors/common';
import { Source, reportClick } from '@/src/utils/report';
import { formatNumber } from '@/src/utils/transNum';
import { FadeView } from '@Components/animation/FadeView';
import { Comment } from '@Components/comment';
import { BottomBar, BottombarHandle } from '@Components/detail/bottomBar';
import { HeaderLeft, HeaderRight } from '@Components/detail/header';
import { ImageContent } from '@Components/detail/imageContent';
import { SameSheet } from '@Components/detail/sameSheet';
import { TakePhotoDetail } from '@Components/detail/takephotoDetail';
import {
  DoubleClickLike,
  DoubleClickLikeActions
} from '@Components/doubleClickLike';
import { Image } from '@Components/image';
import { Screen } from '@Components/screen';
import { Tabs } from '@Components/tabs';
import { StyleSheet } from '@Utils/StyleSheet';
import { useShallow } from 'zustand/react/shallow';
import { DetailEventBus } from './eventbus';

const CARD_NOT_FOUNT_ERROR = 10002;
const ICON_HL = require('@Assets/image/feed/tab_highlight.png');
export type ScrollViewRef = {
  get: () => ScrollView;
};

export default function Detail() {
  const navigation = useNavigation();
  const { id, gameId, topCommentId } = useLocalSearchParams();
  const cardId = Array.isArray(id) ? id[0] : id;

  const { loading, error, detail, commonInfo } = useDetailStore(
    useShallow(state => {
      const info = state.getDetail(cardId);
      return {
        loading: info?.loading,
        error: info?.error,
        detail: info?.detail,
        commonInfo: info?.commonInfo
      };
    })
  );

  const bottomRef = useRef<BottombarHandle>(null);

  const [tabType, setTabType] = useState('comment');
  // const [tabType, setTabType] = useState('takephoto'); // todo
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const [showImageSelector, setImageSelector] = useState(false);
  const tabPositionRef = useRef(0);
  const { loginIntercept } = useAuthState();
  const scrollViewRef =
    useRef<ScrollViewRef>() as MutableRefObject<ScrollViewRef>;
  const doubleClickLikeRef = useRef<DoubleClickLikeActions>(null);

  const hasProcessedTopComment = useRef(false);
  const hasReplacePath = useRef(false);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (tabType === 'comment') {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const offsetY = contentOffset.y;
      const contentHeight = contentSize.height;
      const scrollHeight = layoutMeasurement.height;

      if (scrollHeight + offsetY > contentHeight - 200) {
        CommentEventBus.emit('scrollComment');
      }
    }
  };

  const onScreenCapture = useMemoizedFn(() => {
    CommentEventBus.emit(CommentEvent.COLSE_COMMENT_INPUT);
  });

  // todo
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     setTimeout(() => {
  //       // todo 要在动画执行完后reset，不要setTimeOut
  //       useDetailStore.getState().reset();
  //     }, 0);
  //   });

  //   return unsubscribe; // 在组件卸载时取消订阅
  // }, [navigation]);

  useEffect(() => {
    DetailEventBus.on('scrollToComment', () => {
      reportClick('buttombar_button', { contentid: detail?.cardId }, 'comment');
      setTabType('comment');
      const ref = scrollViewRef?.current?.get();
      ref && ref.scrollTo({ y: tabPositionRef.current });
    });

    return () => {
      // 关闭弹窗
      hideShare();
      DetailEventBus.off('scrollToComment');
    };
  }, []);

  const handleTabLayout = (e: LayoutChangeEvent) => {
    const layout = e.nativeEvent.layout;
    tabPositionRef.current = layout.y;

    if (!hasProcessedTopComment.current) {
      topCommentId &&
        scrollViewRef?.current?.get()?.scrollTo({ y: tabPositionRef.current });
      hasProcessedTopComment.current = true;
    }
  };
  const displayCommentCount = commonInfo?.stat?.comments || 0;
  const displayCommentCountStr =
    displayCommentCount === 0 ? '' : formatNumber(displayCommentCount);

  useEffect(() => {
    const fetchDetailInfo = () => {
      const { getDetail, requestDetail } = useDetailStore.getState();

      if (!getDetail(cardId)?.loading) {
        const gid = Array.isArray(gameId) ? gameId[0] : gameId;
        requestDetail({ cardId, gameId: gid }); // todo 参数有问题
      }
    };

    fetchDetailInfo();
  }, [navigation]);

  useEffect(() => {
    // 避免多次触发 router.replace
    if (hasReplacePath.current) {
      return;
    }

    if (
      // 作品不存在
      (error?.code === CARD_NOT_FOUNT_ERROR && !loading) ||
      // 存在错误且没有缓存
      (error && !loading && !detail && !commonInfo)
    ) {
      router.replace('/empty-page/');
      hasReplacePath.current = true;
    }
  }, [error, loading, detail, commonInfo]);

  return (
    <>
      <Screen
        ScrollViewComp={IOScrollView}
        scrollViewRef={scrollViewRef}
        preset="auto"
        // style={{ height: 2000 }}
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={{
          height: 'auto',
          paddingBottom: Number($containerInsets.paddingBottom ?? 0) + 84
        }}
        screenStyle={{
          backgroundColor: CommonColor.white
        }}
        style={{
          ...Platform.select({
            ios: {
              marginBottom: 6
            },
            android: {
              marginTop: 6
            }
          })
        }}
        headerLeft={() => <HeaderLeft detailId={cardId} />}
        headerRight={() => <HeaderRight detailId={cardId} />}
        ScrollViewProps={{
          onScroll,
          scrollEventThrottle: 100,
          showsVerticalScrollIndicator: false
        }}
      >
        <ImageContent
          data={detail || undefined}
          onLike={config => {
            if (config?.doubleLike) {
              doubleClickLikeRef.current?.start(
                config.doubleLike.offsetX,
                config.doubleLike.offsetY
              );
            }

            if (bottomRef.current && bottomRef.current.onLike) {
              bottomRef.current.onLike();
            }
          }}
          onScreenCapture={onScreenCapture}
        />
        <Tabs
          style={tabStyles.$tabStyle}
          itemStyle={tabStyles.$tabItemStyle}
          itemTextStyle={tabStyles.$tabItemTextStyle}
          activeTextStyle={tabStyles.$tabActiveTextStyle}
          activeNode={
            <Reanimated.View
              entering={FadeIn}
              style={tabStyles.$tabActiveSlashWrapper}
            >
              <View style={tabStyles.$tabActiveSlash} />
            </Reanimated.View>

            // <View style={tabStyles.$tabActiveNode}>
            //   <Image
            //     style={{ width: '100%', height: '100%' }}
            //     source={ICON_HL}
            //   />
            // </View>
          }
          current={tabType}
          items={[
            {
              key: 'comment',
              label: `评论 ${displayCommentCountStr}`
            },
            {
              key: 'takephoto',
              label: '拍摄角色'
            }
          ]}
          onChange={type => {
            reportClick(type === 'comment' ? 'commenttab' : 'roletab', {
              contentid: cardId
            });
            setTabType(type);
          }}
        ></Tabs>
        <View style={tabStyles.$tabContent} onLayout={handleTabLayout}>
          {tabType === 'comment' && (
            <FadeView>
              <Comment detailId={cardId} />
            </FadeView>
          )}
          {tabType === 'takephoto' && detail && (
            <FadeView>
              <TakePhotoDetail data={detail.protoInfo} detailId={cardId} />
            </FadeView>
          )}
        </View>

        {detail && (
          <SameSheet
            data={detail}
            isVisible={showImageSelector}
            onTakePhoto={onTakePhoto}
            onClose={() => {
              setImageSelector(false);
            }}
          />
        )}
      </Screen>
      <BottomBar
        detailId={cardId}
        ref={bottomRef}
        onTakePhoto={() => {
          reportClick('join_button', { contentid: detail?.cardId });
          loginIntercept(
            () => {
              const photos = detail?.photos;
              if (!photos) return;
              if (photos.length > 1) {
                setImageSelector(true);
              } else {
                onTakePhoto(photos[0].photoId);
              }
              // if()
            },
            { scene: LOGIN_SCENE.TAKE_SAME_STYLE }
          );
        }}
      />

      <DoubleClickLike ref={doubleClickLikeRef}></DoubleClickLike>
    </>
  );

  function onTakePhoto(id: string) {
    const mapData = detail?.mapProtoData;
    if (!mapData) return;
    const data = mapData[id];
    const { protoId, prompt, photos, size, roles, style } = data;

    useMakePhotoStoreV2.getState().syncData({
      prompt,
      protoId,
      roles,
      style,
      cardId: cardId || ''
    });
    useMakePhotoStoreV2.getState().changePageState(PageState.diy);
    router.push({
      pathname: '/make-photo/',
      params: {
        from: Source.DRAWING_WITH_PROMPT
      }
    });
  }
}

const tabStyles = StyleSheet.create({
  $tabStyle: {
    width: '90%',
    marginLeft: '5%',
    height: 60,
    alignItems: 'center',
    ...StyleSheet.rowStyle
  },
  $tabItemStyle: {
    flex: 1
  },
  $tabItemTextStyle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 26,
    fontWeight: '600',
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4)
  },
  $tabActiveTextStyle: {
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.87)
  },
  $tabActiveSlashWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  $tabActiveSlash: {
    width: 30,
    height: 2,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.87),
    borderRadius: 4
  },
  $tabActiveNode: {
    position: 'absolute',
    top: 10,
    left: 60,
    width: 46,
    height: 33
  },
  $tabContent: {
    paddingBottom: 13
  }
});
