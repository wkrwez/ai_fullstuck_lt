import { useMemoizedFn } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { reportClick } from '@/src/utils/report';
import { WorldAPM } from '../../_constants';
import { AnimationDir } from '../mask-images';
import { WorldAct } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { StoryValue } from './display-card';

export const useDisplayMaskCardGesture = ({
  width,
  next,
  swipeNext,
  prev,
  swipePrev
}: {
  width: number;
  next: () => void;
  swipeNext: () => void;
  prev: () => void;
  swipePrev: () => void;
}) => {
  const doOper = useMemoizedFn(e => {
    console.log('doOper!!!!!!!!!!!!!!');
    if (e.velocityX < 0) {
      reportClick('content_page', {
        interactive_behavior: WorldAPM.INTERACTIVE_BEHAVIOR.RIGHT
      });
      // next();
      swipeNext();
    } else {
      reportClick('content_page', {
        interactive_behavior: WorldAPM.INTERACTIVE_BEHAVIOR.LEFT
      });
      // prev();
      swipePrev();
    }
  });

  const doClickOper = useMemoizedFn(e => {
    console.log('doOper!!!!!!!!!!!!!!');
    if (e.absoluteX < width * 0.2) {
      reportClick('content_page', {
        interactive_behavior: WorldAPM.INTERACTIVE_BEHAVIOR.CLICK,
        prev: 1
      });
      prev();
    } else {
      reportClick('content_page', {
        interactive_behavior: WorldAPM.INTERACTIVE_BEHAVIOR.CLICK
      });
      next();
    }
  });

  const pan = Gesture.Pan().onEnd(e => {
    runOnJS(doOper)(e);
  });

  const tapGesture = Gesture.Tap().onEnd(e => {
    runOnJS(doClickOper)(e);
  });

  const composed = Gesture.Exclusive(pan, tapGesture);

  return { composed };
};

export const useMaskImageSwitch = ({ acts }: { acts: WorldAct[] }) => {
  const images = useMemo<string[]>(() => {
    return acts?.map(act => act.image?.imageUrl ?? '') ?? [];
  }, [acts]);
  // const [currentSource, setCurrentSource] = useState<string>(
  //   acts[0]?.image?.imageUrl ?? ''
  // );
  // const [prefetchSource, setPreSource] = useState<string>('');
  // const [swipeDir, setSwipeDir] = useState(AnimationDir.left);

  // const switchImg = useMemoizedFn((idx: number, dir: AnimationDir) => {
  //   setSwipeDir(dir);
  //   setCurrentSource(images[idx]);
  //   if (idx < images.length - 1) {
  //     setPreSource(images[idx + 1]);
  //   } else {
  //     setPreSource('');
  //   }
  // });

  return {
    // currentSource, prefetchSource, swipeDir, switchImg,
    images
  };
};

export const useDisplayMaskCardVideoInit = ({
  showVideo,
  onVideoPlayed
}: {
  showVideo: boolean;
  onVideoPlayed?: () => void;
}) => {
  const $firstImgTextOpacity = useSharedValue(0);

  const $videoTextStyle_a = useAnimatedStyle(() => {
    return { opacity: $firstImgTextOpacity.value };
  });
  const [isVideoPlayed, setIsVideoPlayed] = useState(!showVideo);

  useEffect(() => {
    if (showVideo) {
      $firstImgTextOpacity.value = withSequence(
        withDelay(1000, withTiming(1)),
        withDelay(
          1000,
          withTiming(0, {}, isAnimationFinished => {
            if (isAnimationFinished) {
              runOnJS(setIsVideoPlayed)(true);
              if (onVideoPlayed) runOnJS(onVideoPlayed)();
            }
          })
        )
      );
    }
  }, []);

  return { isVideoPlayed, $videoTextStyle_a };
};

export const useImgAnimatedStyle = ({
  storyList,
  imgBasicHeight
}: {
  storyList: StoryValue[];
  imgBasicHeight: number;
}) => {
  const $isFull = useSharedValue(true);
  useEffect(() => {
    if (storyList.length === 0) {
      $isFull.value = true;
    } else {
      $isFull.value = false;
    }
  }, [storyList.length]);

  const $textStyle_a = useAnimatedStyle(() => {
    return { height: withTiming($isFull.value ? 10 : 140) };
  });

  const $imgContainerStyle_a = useAnimatedStyle(() => {
    const h = imgBasicHeight - 4;
    return { height: withTiming($isFull.value ? h + 130 : h) };
  });

  const $imgStyle_a = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(
            $isFull.value ? (imgBasicHeight + 130) / imgBasicHeight : 1
          )
        },
        { translateY: withTiming($isFull.value ? 60 : 0) }
      ]
    };
  });

  return { $textStyle_a, $imgContainerStyle_a, $imgStyle_a };
};
