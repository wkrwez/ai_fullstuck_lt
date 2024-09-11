import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { feedClient } from '@/src/api';
import { Screen, showToast } from '@/src/components';
import { RequestScene } from '@/src/components/infiniteList/typing';
import { WorldTopicBg } from '@/src/components/parallelWorld/topic/WorldTopicBg';
import { WorldTopicHeader } from '@/src/components/parallelWorld/topic/WorldTopicHeader';
import { WorldTopicInfo } from '@/src/components/parallelWorld/topic/WorldTopicInfo';
import { WorldTopicLink } from '@/src/components/parallelWorld/topic/WorldTopicLink';
import { WaterFall2 } from '@/src/components/waterfall/WaterFall2';
import { useRequestFeed } from '@/src/components/waterfall/useRequsetFeed';
import { CellCardScene } from '@/src/gums/feed/cellcard';
import { useSafeBottomArea, useScreenSize } from '@/src/hooks';
import { CommonColor } from '@/src/theme/colors/common';
import { logWarn } from '@/src/utils/error-log';
import { reportExpo } from '@/src/utils/report';
import { RecSceneName } from '@/app/feed/type';
import { GameType } from '@/proto-registry/src/web/raccoon/common/types_pb';
import {
  AllCardsRequest,
  RootWorldResponse
} from '@/proto-registry/src/web/raccoon/query/query_pb';
import { ScrollState } from './typing';
import { TopicType } from './typing';

interface TopicConfigtype<T> {
  Bg: React.FC<{ info?: T }>;
  Info: React.FC<{ info?: T }>;
  Header: React.FC<{ info?: T; scrollOverHeader: boolean }>;
  Link: React.FC<{ info?: T }>;
  fetchPageInfo: (id?: string) => Promise<T>;
  getFeedParams?: (id?: string) => Partial<AllCardsRequest>;
}

export const TopicConfig: Record<string, TopicConfigtype<any>> = {
  [TopicType.WORLD]: {
    Bg: WorldTopicBg,
    Info: WorldTopicInfo,
    Header: WorldTopicHeader,
    Link: WorldTopicLink,
    fetchPageInfo: id =>
      feedClient.rootWorld({
        cardId: id
      }),
    getFeedParams: (id?: string) => ({
      cardId: id,
      game: GameType.WORLD,
      recSceneName: RecSceneName.TOPIC_WORLD
    })
  } as TopicConfigtype<RootWorldResponse>
};

export default function Topic() {
  const { type = '', id = '' } = useLocalSearchParams<{
    type: string;
    id: string;
  }>();
  const navigation = useNavigation();

  const [topicInfo, setTopicInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const pageAlive = useRef(false);

  const [scrollStatus, setScrollStatus] = useState<ScrollState>(
    ScrollState.TOP
  );
  const prevScrollTop = useRef<number>(0);

  const screenHeight = useScreenSize('window').height;
  const $bottom = useSafeBottomArea();
  const feedStartPosition = useRef<number>(-1);

  const config = type ? TopicConfig[type] : undefined;

  const initPageData = async () => {
    try {
      setLoading(true);
      const res = await config?.fetchPageInfo?.(id);
      setTopicInfo(res);
      setLoading(false);
    } catch (error) {
      logWarn('topicPageLoadInfoError', error);
      if (pageAlive.current) {
        router.replace({
          pathname: '/empty-page/',
          params: {
            text: '来晚了，内容消失啦'
          }
        });
      }
    }
  };

  const {
    sourceData,
    loading: feedLoading,
    error,
    hasMore,
    fetchList
  } = useRequestFeed({
    defaultFetch: true,
    requestParams: {
      ...config?.getFeedParams?.(id)
    },
    onError: scene =>
      scene === RequestScene.REFRESHING
        ? showToast('刷新失败啦，请重试')
        : undefined
  });

  const onScroll = ({ offsetY }: { offsetY: number }) => {
    // 1 - page up; 0 - page down
    const direction = prevScrollTop.current - offsetY < 0 ? 1 : 0;
    const compare = direction
      ? (a: number, b: number) => a < b
      : (a: number, b: number) => a <= b;

    if (compare(offsetY, 54)) {
      scrollStatus !== ScrollState.TOP && setScrollStatus(ScrollState.TOP);
    } else if (
      feedStartPosition.current === -1 ||
      compare(offsetY, feedStartPosition.current)
    ) {
      scrollStatus !== ScrollState.SCROLL_OVER_HEADER &&
        setScrollStatus(ScrollState.SCROLL_OVER_HEADER);
      opacity.value = 0;
    } else if (scrollStatus !== ScrollState.SCROLL_OVER_FEED) {
      setScrollStatus(ScrollState.SCROLL_OVER_FEED);
      opacity.value = 1;
    }
    prevScrollTop.current = offsetY;
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    feedStartPosition.current = layout.y;
  };

  const opacity = useSharedValue(0);
  const $animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value
    }),
    [scrollStatus]
  );

  useEffect(() => {
    pageAlive.current = true;

    setTimeout(() => {
      reportExpo('page_expo', {
        scriptid: id
      });
    });
    initPageData();

    const unsubscribeFocus = navigation.addListener('focus', () => {
      pageAlive.current = true;
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      pageAlive.current = false;
    });

    return () => {
      pageAlive.current = false;
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);

  if (!config) {
    return null;
  }

  const { Bg, Info, Header, Link } = config || {};

  return (
    <Screen
      title=""
      theme="dark"
      headerStyle={{
        borderBottomWidth: 0
      }}
      safeAreaEdges={['top']}
      backgroundView={<Bg info={topicInfo} />}
      headerLeft={() => (
        <Header
          info={topicInfo}
          scrollOverHeader={scrollStatus > ScrollState.TOP}
        />
      )}
    >
      {/* fake border */}
      <Animated.View style={[$fakeBorderTop, $animatedStyle]}>
        <View style={$fakeBorderBg}>
          <Bg info={topicInfo} />
        </View>
        <View style={$fakeBorder}></View>
      </Animated.View>
      {/* fake bg */}
      <Animated.View style={[$animatedStyle]}>
        <View
          style={{
            position: 'absolute',
            top: '50%',
            height: screenHeight,
            width: '100%',
            backgroundColor: '#F5F5F5'
          }}
        ></View>
      </Animated.View>

      <WaterFall2
        data={sourceData}
        loading={feedLoading}
        error={error}
        hasMore={hasMore}
        onRequest={fetchList}
        onScroll={onScroll}
        enablePullRefresh={false}
        renderContentContainer={renderContentContainer}
        footerStyle={{
          ...$footerStyle,
          paddingBottom: topicInfo ? $bottom + 48 : $bottom
        }}
        extendedState={{
          scene: CellCardScene.TOPIC_WORLD
        }}
      ></WaterFall2>
      <Link info={topicInfo} />
    </Screen>
  );

  function renderContentContainer(
    props?: { style?: ViewStyle },
    renderChildren?: () => React.ReactNode
  ) {
    const contentHeight =
      typeof props?.style?.height === 'number'
        ? Math.max(props.style.height, (screenHeight * 3) / 4) + 16
        : props?.style?.height || screenHeight;

    return (
      <>
        <Info info={topicInfo} />
        <View
          onLayout={onLayout}
          style={[
            props?.style,
            $contentWrapper,
            {
              height: contentHeight
            }
          ]}
        >
          <View>{renderChildren?.()}</View>
        </View>
      </>
    );
  }
}

const $fakeBorderTop: ViewStyle = {
  position: 'absolute',
  top: 0,
  height: 8,
  width: '100%',
  zIndex: 1,
  overflow: 'hidden'
};

const $fakeBorderBg: ViewStyle = {
  height: 8,
  width: '100%',
  backgroundColor: CommonColor.white
};

const $fakeBorder: ViewStyle = {
  borderTopColor: '#F5F5F5',
  borderLeftColor: '#F5F5F5',
  borderRightColor: '#F5F5F5',
  borderWidth: 8,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  position: 'absolute',
  top: 0,
  height: 8,
  paddingTop: 16,
  width: '100%',
  zIndex: 1
};

const $footerStyle: ViewStyle = {
  backgroundColor: '#F5F5F5',
  marginTop: 0,
  marginBottom: 0,
  paddingTop: 12
};

const $contentWrapper: ViewStyle = {
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  paddingVertical: 8,
  // paddingHorizontal: 6,
  backgroundColor: '#F5F5F5',
  width: '100%'
};
