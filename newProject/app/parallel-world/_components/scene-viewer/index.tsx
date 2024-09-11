import * as Haptics from 'expo-haptics';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react';
import {
  Dimensions,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { reportClick } from '@/src/utils/report';
import { Image } from '@Components/image';
import {
  VIEWER_CARD_IMG_HEIGHT,
  getGenImgWidthByHeight
} from '../../_constants';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const BTN_PREV = require('@Assets/image/parallel-world/btn-prev.png');
const BTN_NEXT = require('@Assets/image/parallel-world/btn-next.png');

interface SceneViewerProps {
  acts: (WorldAct | null)[];
  viewerStyle?: StyleProp<ViewStyle>;
  id: string;
  renderItem: (act: WorldAct | null, index: number) => React.ReactNode;
  onIndexChange?: (index: number) => void;
  onSkip?: (index: number) => boolean; // 返回当前章节是否可以直接跳过
  onNext?: (nextIndex: number) => void;
  isNextVisible?: boolean;
  onPrev?: (prevIndex: number) => void;
  isPrevVisible?: boolean;
  onExceed?: () => void;
}

const SceneViewer = forwardRef<ICarouselInstance, SceneViewerProps>(
  (
    {
      acts,
      id,
      renderItem,
      onIndexChange,
      onSkip,
      onExceed,
      onNext,
      isNextVisible = true,
      onPrev,
      isPrevVisible = true,
      viewerStyle
    },
    ref
  ) => {
    const carouselRef = useRef<ICarouselInstance>(null);

    // const handleSwipe = useMemoizedFn(
    //   (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    //     const index = carouselRef.current?.getCurrentIndex() ?? 0;
    //     let newIndx = index;
    //     if (e.translationX < -50) {
    //       /* translationX < 0: swipe left */
    //       if (index === acts.length - 1) {
    //         onExceed && onExceed();
    //       } else {
    //         carouselRef.current?.next();
    //         newIndx++;
    //         onNext && onNext(newIndx);
    //       }
    //     } else if (e.translationX > 50) {
    //       /* translationX > 0: swipe right */
    //       if (index > 0) {
    //         carouselRef.current?.prev();
    //         newIndx--;
    //         onPrev && onPrev(newIndx);
    //       }
    //     }
    //     onIndexChange && onIndexChange(newIndx);
    //   }
    // );

    // const panGesture = Gesture.Pan().onEnd(e => {
    //   'worklet';
    //   runOnJS(handleSwipe)(e);
    // });

    const handlePrev = () => {
      if (!isPrevVisible) return;

      const index = carouselRef.current?.getCurrentIndex() ?? 0;
      let newIndx = index;
      if (index > 0) {
        carouselRef.current?.prev();
        newIndx--;
        onPrev && onPrev(newIndx);
      }
      onIndexChange && onIndexChange(newIndx);
      Haptics.impactAsync();
      reportClick('new_content_preview', {
        contentid: id,
        new_content_button: 3
      });
    };

    const handleNext = () => {
      if (!isNextVisible) return;

      const index = carouselRef.current?.getCurrentIndex() ?? 0;

      //
      if (onSkip && onSkip(index)) {
        return;
      }

      let newIndx = index;
      if (index === acts.length - 1) {
        onExceed && onExceed();
      } else {
        carouselRef.current?.next();
        newIndx++;
        onNext && onNext(newIndx);
      }
      onIndexChange && onIndexChange(newIndx);
      Haptics.impactAsync();
      reportClick('new_content_preview', {
        contentid: id,
        new_content_button: 4
      });
    };

    useImperativeHandle(ref, () => carouselRef.current as ICarouselInstance);

    // TODO：后期优化
    useEffect(() => {
      onIndexChange && onIndexChange(0);
    }, [id]);

    return (
      <>
        <View
          style={[
            {
              height: '100%',
              paddingTop: 8,
              position: 'relative'
            },
            viewerStyle
          ]}
        >
          <Carousel
            ref={carouselRef}
            width={screenWidth - 40}
            data={acts}
            scrollAnimationDuration={1000}
            style={{
              justifyContent: 'center',
              width: '100%'
            }}
            enabled={false}
            pagingEnabled={true}
            snapEnabled={false}
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: 'left',
              stackInterval: 0
            }}
            renderItem={({ item: act, index }) => (
              <View style={{ alignItems: 'center' }} key={index}>
                {renderItem(act, index)}
              </View>
            )}
          />
          {/* <View
            style={{
              position: 'absolute',
              zIndex: -10,
              opacity: 0.2,
              left: 30,
              top: 18,
              transform: [{ rotate: '3deg' }, { scale: 1.04 }]
            }}
          >
            <StaticCard
              imageUrl=""
              imgHeight={VIEWER_CARD_IMG_HEIGHT}
              textNode={<View style={{ height: 54 }}></View>}
            />
          </View> */}
        </View>
        <Pressable
          onPress={handlePrev}
          style={{
            // opacity: 0.1,
            // backgroundColor: 'red',
            width: '50%',
            height: VIEWER_CARD_IMG_HEIGHT - 60,
            zIndex: 100,
            left: 0,
            position: 'absolute'
          }}
        />
        <Pressable
          onPress={handleNext}
          style={{
            // opacity: 0.1,
            // backgroundColor: 'green',
            width: '50%',
            height: VIEWER_CARD_IMG_HEIGHT - 60,
            right: 0,
            zIndex: 100,
            position: 'absolute'
          }}
        />
        {isPrevVisible && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 10,
              top: VIEWER_CARD_IMG_HEIGHT,
              width: 40,
              height: 40
            }}
            onPress={handlePrev}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={BTN_PREV}
            />
          </TouchableOpacity>
        )}
        {isNextVisible && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              top: VIEWER_CARD_IMG_HEIGHT,
              width: 40,
              height: 40
            }}
            onPress={handleNext}
          >
            <Image
              style={{ width: '100%', height: '100%' }}
              source={BTN_NEXT}
            />
          </TouchableOpacity>
        )}
      </>
    );
  }
);

export default SceneViewer;
