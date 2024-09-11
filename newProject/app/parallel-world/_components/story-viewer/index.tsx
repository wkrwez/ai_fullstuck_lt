import { Subscription } from 'expo-modules-core';
// import Swiper from 'react-native-swiper';
import { router } from 'expo-router';
// import * as ScreenCapture from 'expo-screen-capture';
import LottieView from 'lottie-react-native';
import {
  TouchEvent,
  TouchEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  GestureResponderEvent,
  NativeMouseEvent,
  Platform,
  Pressable,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeOut, Layout, runOnJS } from 'react-native-reanimated';
import {
  SwiperFlatList,
  SwiperFlatListProps
} from 'react-native-swiper-flatlist';
import { SharedElement } from 'react-navigation-shared-element';
import { $maskStyle } from '@/src/components/sheet/style';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { useScreenSize } from '@/src/hooks';
import { useAuthState } from '@/src/hooks/useAuthState';
import { DetailInfo, useDetailStore } from '@/src/store/detail';
import { StyleSheet, dp2px, getScreenSize } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { Image } from '@Components/image';
import { NetworkImage } from '@Components/networkImage';
import { Pagination } from '@Components/pagination';
import { showPreviewImages } from '@Components/previewImageModal';
// import { Channel } from '@Components/share';
import { Text } from '@Components/text';
import InfoCard from '../info-card';

type StoryViewerProps = {
  data?: DetailInfo;
  onLike?: () => void;
};

export function StoryViewer(props: StoryViewerProps) {
  const screenSize = useScreenSize();

  const width = screenSize.width - 36;

  const [index, setIndex] = useState(1);
  const swiperRef = useRef<SwiperFlatList>(null);
  const height = useMemo(() => {
    return ((width || 1) * 936) / 704;
  }, [width]);
  const indexRef = useRef(index);
  const lastScrollX = useRef(0);
  const canBackRef = useRef(false);
  const likeLottieRef = useRef<LottieView>(null);

  // const hasPermissions = async () => {
  //   // const { status } = await ScreenCapture.isAvailableAsync();
  //   return await ScreenCapture.isAvailableAsync();
  // };

  useEffect(() => {
    let subscription: Subscription;

    // const addListenerAsync = async () => {
    //   if (await hasPermissions()) {
    //     subscription = ScreenCapture.addScreenshotListener(() => {
    //       // onShare();
    //     });
    //   } else {
    //     console.log(
    //       'Permissions needed to subscribe to screenshot events are missing!'
    //     );
    //   }
    // };
    // addListenerAsync();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const onLike = () => {
    if (likeLottieRef.current) {
      likeLottieRef.current.play();
    }
    if (props.onLike) {
      props.onLike();
    }
  };

  const tapTwiceGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(onLike)();
    });

  function onChangeIndex(params: { changed: { index: number }[] }) {
    if (!swiperRef.current) return;
    const index = params.changed?.[0]?.index + 1;
    setIndex(index);
    useDetailStore.getState().setImageIndex(index);
  }

  function onChangeAndroidIndex({ index }: { index: number }) {
    setIndex(index + 1);
    useDetailStore.getState().setImageIndex(index + 1);
  }

  function onTouchStart(e: GestureResponderEvent) {
    lastScrollX.current = e.nativeEvent.pageX;
  }

  function onTouchMove(e: GestureResponderEvent) {
    if (
      indexRef.current === 1 &&
      e.nativeEvent.pageX - lastScrollX.current > 100
    ) {
      canBackRef.current = true;
    }
  }

  const composed = Gesture.Exclusive(tapTwiceGesture);

  return (
    <View
      style={[st.$wrapper, { alignItems: 'center', justifyContent: 'center' }]}
    >
      <GestureDetector gesture={composed}>
        <View style={[st.$swiperWrap, { width }]}>
          {/* @ts-ignore */}
          <SwiperFlatList
            ref={swiperRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onScrollEndDrag={() => {
              if (canBackRef.current) {
                setTimeout(() => {
                  router.back();
                }, 200);
              }
            }}
            showPagination={false}
            data={props.data?.photos || []}
            renderItem={({ item }) => (
              <View key={item.photoId}>
                <Image source={item.url} style={{ width, height }} />

                <InfoCard cardStyle={{ backgroundColor: 'white' }}>
                  <View
                    style={{
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      position: 'relative'
                    }}
                  >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, fontWeight: '400' }}>
                        炭治郎将车票递给列车员
                      </Text>
                    </View>
                  </View>
                </InfoCard>
              </View>
            )}
            keyExtractor={item => item.photoId}
            {...(Platform.OS === 'android'
              ? { onChangeIndex: onChangeAndroidIndex }
              : { onViewableItemsChanged: onChangeIndex })}
          ></SwiperFlatList>
        </View>
      </GestureDetector>
    </View>
  );
}

const st = StyleSheet.create({
  $wrapper: {
    // borderWidth: 1,
    borderColor: 'red',
    position: 'relative'
  },
  $swiperWrap: {
    position: 'relative',
    width: '100%',
    zIndex: 1
  }
});
