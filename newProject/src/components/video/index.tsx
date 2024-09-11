import { AVPlaybackSource, Video as ExpoVideo, ResizeMode } from 'expo-av';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { StyleSheet } from '@Utils/StyleSheet';

type VideoItem = {
  source: AVPlaybackSource;
  loop?: boolean; // 自动循环
  autoNext?: boolean; // 自动下一个
  onFinish?: () => void; // 播放完成的回调
};
export interface VideoProps {
  videos: VideoItem[];
  onAllFinished?: () => void;
  onFinish?: (index: number) => void; // 播放完成的回调
}

export interface VideoHandle {
  next: () => void;
  play: () => void;
  show: () => void;
  reset: () => void;
  hide: () => void;
  changeSources: (payload: VideoItem[]) => void;
}

// 连续播放的一组视频
export const Video = forwardRef<VideoHandle, VideoProps>((props, ref) => {
  useImperativeHandle(
    ref,
    () => ({
      next,
      play,
      show,
      reset,
      hide,
      changeSources
    }),
    []
  );

  const index = useRef(0);
  const videoBackRef = useRef<ExpoVideo>(null);
  const videoFrontRef = useRef<ExpoVideo>(null);
  const showFrontVideo = useRef(false);
  const resetRef = useRef(false);
  const opacityFrontVal = useSharedValue(0);
  const opacityVal = useSharedValue(0);
  const sourceRef = useRef<VideoItem[]>();

  const $frontVideoAnimationStyle = useAnimatedStyle(() => ({
    opacity: opacityFrontVal.value
  }));

  const $videoAnimationStyle = useAnimatedStyle(() => ({
    opacity: opacityVal.value
  }));

  const { width, height } = useScreenSize('screen');

  // 初始化 预加载
  useEffect(() => {
    console.log('video------------');
    sourceRef.current = props.videos;
    videoBackRef.current?.loadAsync(getVideoSource()[0].source);
    // return () => {
    //   alert(12334543);
    // };
  }, []);

  return (
    <>
      <Animated.View
        style={[StyleSheet.absoluteFill, $frontVideoAnimationStyle]}
      >
        <ExpoVideo
          isMuted
          ref={videoBackRef}
          source={props.videos[0].source}
          style={[StyleSheet.absoluteFill]}
          isLooping={false}
          resizeMode={ResizeMode.COVER}
          // shouldPlay
          onPlaybackStatusUpdate={status => {
            // @ts-ignore
            if (status.didJustFinish) {
              console.log('finish1------', index.current);
              // 播放完了
              onFinish();
            }
          }}
        ></ExpoVideo>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, $videoAnimationStyle]}>
        <ExpoVideo
          isMuted
          style={[StyleSheet.absoluteFill, { width, height }]}
          ref={videoFrontRef}
          source={props.videos[1].source}
          isLooping={true}
          resizeMode={ResizeMode.STRETCH}
          onPlaybackStatusUpdate={status => {
            // @ts-ignore
            if (status.didJustFinish) {
              console.log('finish2------', index.current);
              // 播放完了
              onFinish();
            }
          }}
        ></ExpoVideo>
      </Animated.View>
    </>
  );

  function preload() {
    const nextIndex = index.current + 1;
    console.log('preload', nextIndex);
    if (nextIndex >= getVideoSource().length) return;
    // const showFront = currentVideoRef === videoFrontRef;
    const showFront = showFrontVideo.current;
    const nextItem = getVideoSource()[nextIndex];
    const nextRef = showFront ? videoBackRef : videoFrontRef;
    nextRef.current?.setIsLoopingAsync(nextItem.loop || false);
    nextRef.current?.loadAsync(nextItem.source);
  }

  function show() {
    resetRef.current = false;
    opacityFrontVal.value = 1;
    index.current = 0;
    showFrontVideo.current = false;
    play();
    preload();
  }

  function hide() {
    opacityFrontVal.value = 0;
    opacityVal.value = 0;
    index.current = 0;
    showFrontVideo.current = false;
    getCurrentVideo()?.pauseAsync();
  }

  function play() {
    console.log('play----', showFrontVideo.current);
    return getCurrentVideo()?.playAsync();
  }

  function pause() {
    getCurrentVideo()?.replayAsync({ shouldPlay: false, positionMillis: 0 });
    //   .then(() => {
    //     getCurrentVideo()?.pauseAsync();
    //   });
    // await getCurrentVideo()?.pauseAsync();
    //   getCurrentVideo()?.stopAsync();
  }

  function getVideoSource() {
    return sourceRef.current || [];
  }

  async function next() {
    console.log('next--------', index.current);
    pause();
    switchVideo();
    play();
    index.current += 1;
    preload();
  }

  function switchVideo() {
    const showFront = showFrontVideo.current;
    console.log('switchVideo-----', showFront);
    if (showFront) {
      opacityVal.value = 0;
      showFrontVideo.current = false;
    } else {
      opacityVal.value = 1;
      showFrontVideo.current = true;
    }
  }

  function getCurrentVideo() {
    return showFrontVideo.current
      ? videoFrontRef.current
      : videoBackRef.current;
  }

  function reset() {
    videoBackRef.current?.loadAsync(getVideoSource()[0].source);
    resetRef.current = true;
  }

  function changeSources(source: VideoItem[]) {
    sourceRef.current = source;
    reset();
  }

  // 播放完了
  function onFinish() {
    if (resetRef.current) return;
    console.log('onFinish----', index.current);
    const currentIndex = index.current;
    if (props.onFinish) {
      props.onFinish(currentIndex);
    }
    const currentItem = getVideoSource()[index.current];

    // 自动下一个
    if (currentItem.autoNext) {
      next();
      return;
    }

    // 自动循环
    if (currentItem.loop) {
      getCurrentVideo()?.replayAsync();
    }

    // 全部播放完
    if (index.current >= getVideoSource().length - 1) {
      if (props.onAllFinished) {
        props.onAllFinished();
      }
      return;
    }
  }
});
