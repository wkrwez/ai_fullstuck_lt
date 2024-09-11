import { useMemoizedFn, useUnmount } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, runOnJS } from 'react-native-reanimated';
import { BorderText } from '../border-text';

export interface EmojiGenLoadingProps {
  text: string;
  isLoading: boolean;
  dimension: { width: number; height: number };
}

const LIMIT = 100;

interface FontTransForm {
  scale: number;
  rotate: number;
  translateX: number;
  translateY: number;
}

function getRandomSign() {
  return Math.random() < 0.5 ? -1 : 1;
}

const getTransform = (limit: number): FontTransForm => {
  return {
    scale: 2 + Math.random() / 5,
    rotate: Math.floor(Math.random() * 30) * getRandomSign(),
    translateX: Math.random() * limit * getRandomSign(),
    translateY: Math.random() * limit * getRandomSign()
  };
};

const fontSizeMap = { 1: 84, 2: 82, 3: 76, 4: 68 };

type FontSizeType = keyof typeof fontSizeMap;

export default function EmojiGenLoading({
  text,
  dimension,
  isLoading
}: EmojiGenLoadingProps) {
  const [maskTextList, setMaskTextList] = useState<
    { text: string; transform: FontTransForm }[]
  >([]);

  const intervalRef = useRef<number>();

  const { displayText, fontsize } = useMemo(() => {
    const textArr = Array.from(text);
    const startIdx = textArr.findIndex(char => char !== ' ');

    let displayText: string;
    if (startIdx < 0) {
      displayText = '狸谱';
    } else {
      const textList = textArr.slice(startIdx, startIdx + 4);
      displayText = textList.join('') || '狸谱';
    }

    const fontsize = fontSizeMap[displayText?.length as FontSizeType] ?? 58;

    return { displayText, fontsize };
  }, [text]);

  const displayList = useMemo(() => {
    let list = [];
    if (displayText.length) {
      for (let index = 0; index < LIMIT; index++) {
        list[index] = { text: displayText, transform: getTransform(300 / 2) };
      }
    }
    return list;
  }, [displayText]);

  const [textDimension, setTextDimension] = useState<{
    width: number;
    height: number;
  }>();

  const [visibleIdx, setVisibleIdx] = useState(0);

  const startAnimation = useMemoizedFn(() => {
    let interval = 110; // 设定时间间隔为 100ms
    let lastTime = performance.now();
    let count = 0;

    const step = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        setVisibleIdx(i => {
          return ++i;
        });
        interval = interval > 50 ? interval - 10 : interval;
        count++;
        lastTime = currentTime;
      }

      intervalRef.current = requestAnimationFrame(step);

      if (count > LIMIT) {
        cancelAnimationFrame(intervalRef.current as number);
        // setIsFinished(true);
      }
    };

    intervalRef.current = requestAnimationFrame(step);
  });

  useUnmount(() => {
    cancelAnimationFrame(intervalRef.current as number);
  });

  return (
    <Animated.View
      exiting={FadeOut.duration(1200)}
      entering={FadeIn.duration(800).withCallback(isFinished => {
        if (isFinished) {
          runOnJS(startAnimation)();
        }
      })}
      style={{
        position: 'absolute',
        backgroundColor: 'white',
        // borderWidth: 1,
        overflow: 'hidden',
        zIndex: 1000,
        ...dimension
      }}
    >
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {displayList.map((textInfo, idx) => (
          <BorderText
            text={textInfo.text}
            key={idx}
            borderWidth={2}
            fontSize={fontsize}
            containerStyle={{
              position: 'absolute',
              opacity: visibleIdx > idx ? 1 : 0,
              left: '50%',
              top: '50%',
              transform: [
                {
                  translateX:
                    textInfo.transform.translateX -
                    (textDimension?.width ?? 0) / 2
                },
                {
                  translateY:
                    textInfo.transform.translateY -
                    (textDimension?.height ?? 0) / 2
                },
                { rotate: `${textInfo.transform.rotate}deg` },
                { scale: textInfo.transform.scale }
              ]
            }}
          ></BorderText>
        ))}
      </View>
      <View
        style={{
          position: 'absolute',
          opacity: 0,
          zIndex: 1000,
          left: '50%',
          top: '50%',
          alignItems: 'center',
          transform: [
            { translateX: -(textDimension?.width ?? 0) / 2 },
            { translateY: -(textDimension?.height ?? 0) / 2 },
            { scale: 1.2 }
          ]
        }}
        onLayout={e => {
          const { width, height } = e.nativeEvent.layout;
          setTextDimension({ width, height });
        }}
      >
        <BorderText
          text={displayText}
          borderWidth={2}
          fontSize={fontsize}
          fontStyle={{
            fontSize: fontsize
          }}
        />
      </View>
    </Animated.View>
  );
}
