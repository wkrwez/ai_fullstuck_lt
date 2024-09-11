import React, { useEffect, useRef, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { $flexHCenter } from '@/src/theme/variable';

export const NumLoop = ({
  targetNumber,
  delay,
  textStyle: $textStyle = {},
  interval = 80,
  onEnd
}: {
  targetNumber: number;
  delay: number;
  textStyle?: StyleProp<TextStyle>;
  interval?: number;
  onEnd?: () => void;
}) => {
  // 展示用的时间
  const [count, setCount] = useState(targetNumber);

  // 停止的数字
  const stopAt = useRef<number>();
  // 计数器
  const frameRef = useRef<number>();

  // 在delay时间后停止
  useEffect(() => {
    if (targetNumber >= 0) {
      setTimeout(() => {
        // setStopAt(targetNumber);
        stopAt.current = targetNumber;
      }, delay);

      if (onEnd) {
        setTimeout(() => {
          onEnd();
        }, delay * 2);
      }
    }
  }, [targetNumber]);

  // 循环计数
  useEffect(() => {
    if (count < 0) setCount(Math.floor(Math.random() * 10));

    let lastTime = performance.now();

    const step = (currentTime: number) => {
      frameRef.current = requestAnimationFrame(step);

      if (currentTime - lastTime >= interval) {
        lastTime = currentTime;

        setCount(count => {
          if (count === stopAt.current && frameRef.current) {
            // clearInterval(counterRef.current);
            cancelAnimationFrame(frameRef.current as number);
            return count;
          } else if (count >= 9) {
            return 0;
          } else {
            return count + 1;
          }
        });
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameRef.current as number);
    };
  }, []);

  return <Text style={[$textStyle]}>{count}</Text>;
};

const Countdown = ({
  targetNum = -1,
  digits,
  style: $style,
  textStyle: $textStyle = {},
  gap = 300, // 数字停止的时间间隔
  onEnd
}: {
  targetNum: number;
  digits: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gap?: number;
  onEnd?: () => void;
}) => {
  const [countList, setCountList] = useState(Array(digits).fill(-1));

  useEffect(() => {
    if (targetNum > 0) {
      const numArr = targetNum.toString().split('').map(Number);
      setCountList(numArr);
    }
  }, [targetNum]);

  return (
    <View style={[styles.container, $style]}>
      {countList.map((num, idx) => (
        <NumLoop
          targetNumber={num}
          key={idx}
          delay={idx * gap}
          textStyle={$textStyle}
          onEnd={idx === countList.length - 1 ? onEnd : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...$flexHCenter
  }
});

export default Countdown;
