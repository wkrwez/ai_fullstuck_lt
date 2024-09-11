import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Text, View } from 'react-native';
// import { ImageBackground } from 'react-native';
// import { ImageBackground } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { Image } from '@/src/components';
import { Video, VideoHandle } from '@/src/components/video';
import { PlatformStr, getPlatformStr } from '@/src/store/message';
import {
  FOLD_STATUS_ENUM,
  PARALLEL_WORLD_PAGES_ENUM,
  WorldRoute,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { createStyle } from '@/src/utils';
import { reportExpo } from '@/src/utils/report';
import CountdownLoading from './_components/loading/countdown-loading';
import { useReset } from './_hooks/reset.hook';
import { useShallow } from 'zustand/react/shallow';
import { PARALLEL_WORLD_BG, PARALLEL_WORLD_BG_VIDEO } from './_constants';
import ParallelWorldConsumer from './consumer';
import ParallelWorldFeed from './feed';
import ParallelWorldMain from './main';
import ParallelWorldMainAndroid from './main-android';
import ParallelWorldPublish from './publish';

export const FOLD_DUR = 400;

type Platform = PlatformStr | 'others';

const renderParallelPage = (
  page: PARALLEL_WORLD_PAGES_ENUM,
  route: WorldRoute,
  platform: Platform | undefined
) => {
  if (!platform) return null;

  const main = (
    // platform !== 'huawei' ? (
    <ParallelWorldMain routeInfo={route} />
  );
  // ) : (
  //   <ParallelWorldMainAndroid routeInfo={route} />
  // );

  switch (page) {
    case PARALLEL_WORLD_PAGES_ENUM.MAIN:
      // return <ParallelWorldMain routeInfo={route} />;
      return main;
    case PARALLEL_WORLD_PAGES_ENUM.FEED:
      return <ParallelWorldFeed routeInfo={route} />;
    case PARALLEL_WORLD_PAGES_ENUM.CONSUMER:
      return <ParallelWorldConsumer routeInfo={route} />;
    case PARALLEL_WORLD_PAGES_ENUM.PUBLISH:
      return <ParallelWorldPublish />;
    default:
      // return <ParallelWorldMain routeInfo={route} />;
      return main;
  }
};

export default function World() {
  const [androidPlatform, setAndroidPlatform] = useState<Platform>();

  const initPlatformStr = async () => {
    const platformStr = (await getPlatformStr()) ?? 'others';
    setAndroidPlatform(platformStr);
  };

  const {
    // parallelWorldPage,
    pageFoldStatus,
    isParallelWorldLoading,
    pushWorldRouteStack,
    switchPageFoldStatus,
    worldRouteStack
  } = useParallelWorldStore(
    useShallow(state => ({
      pageFoldStatus: state.pageFoldStatus,
      isParallelWorldLoading: state.isParallelWorldLoading,
      pushWorldRouteStack: state.pushWorldRouteStack,
      switchPageFoldStatus: state.switchPageFoldStatus,
      worldRouteStack: state.worldRouteStack
    }))
  );

  const curRoute = useMemo(() => {
    return worldRouteStack[worldRouteStack.length - 1];
  }, [worldRouteStack]);

  const $screenDisplayRatio = useSharedValue(1);

  const $screenFoldStyle_A = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: $screenDisplayRatio.value }]
    };
  });

  const { id } = useLocalSearchParams();

  useFocusEffect(
    useCallback(() => {
      console.log('useFocusEffect!!!!!!!!!', id);

      pushWorldRouteStack({
        route: PARALLEL_WORLD_PAGES_ENUM.MAIN,
        cardId: id as string
      });
      reportExpo(
        'content_page',
        {
          contentid: id
        },
        true
      );
    }, [id])
  );

  useEffect(() => {
    if (pageFoldStatus === FOLD_STATUS_ENUM.FOLD) {
      $screenDisplayRatio.value = withTiming(0, { duration: FOLD_DUR });
    } else if (pageFoldStatus === FOLD_STATUS_ENUM.UNFOLD) {
      $screenDisplayRatio.value = withTiming(1, { duration: FOLD_DUR });
    } else if (pageFoldStatus === FOLD_STATUS_ENUM.FOLD_2_UNFOLD) {
      $screenDisplayRatio.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(
          FOLD_DUR / 2,
          withTiming(1, { duration: FOLD_DUR }, isFinished => {
            if (isFinished) {
              runOnJS(switchPageFoldStatus)(FOLD_STATUS_ENUM.UNFOLD);
            }
          })
        )
      );
    }
  }, [pageFoldStatus]);

  const videoRef = useRef<VideoHandle>(null);

  useEffect(() => {
    videoRef.current?.show();
    if (isParallelWorldLoading) {
      videoRef.current?.play();
    } else {
      videoRef.current?.reset();
    }
  }, [isParallelWorldLoading]);

  useEffect(() => {
    initPlatformStr();
  }, []);

  const { resetWorld } = useReset();

  // TODO
  useEffect(() => {
    return () => {
      resetWorld();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {curRoute?.route && !isParallelWorldLoading && (
        <Animated.View style={[{ flex: 1 }, $screenFoldStyle_A]}>
          {renderParallelPage(curRoute?.route, curRoute, androidPlatform)}
        </Animated.View>
      )}
      {isParallelWorldLoading && (
        <View style={[styles.$absoluteFull, styles.$loadingBox]}>
          <CountdownLoading />
        </View>
      )}
      <View style={[styles.$absoluteFull, styles.$bgVideo]}>
        <Video
          ref={videoRef}
          videos={[
            { source: PARALLEL_WORLD_BG_VIDEO, loop: true },
            { source: PARALLEL_WORLD_BG_VIDEO }
          ]}
        />
      </View>
      <Image
        source={PARALLEL_WORLD_BG}
        contentFit="cover"
        style={[styles.$absoluteFull, styles.$bgImg]}
      />
    </View>
  );
}

const styles = createStyle({
  $absoluteFull: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  $loadingBox: {
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    position: 'absolute',
    alignContent: 'center',
    paddingBottom: 120,
    justifyContent: 'center'
  },
  $bgVideo: {
    position: 'absolute',
    flex: 1,
    zIndex: -1
  },
  $bgImg: {
    position: 'absolute',
    // borderColor: 'red',
    flex: 1,
    zIndex: -2
  }
});
