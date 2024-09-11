import { useEffect, useRef, useState } from 'react';

// 展示静态的流式文字
export const useStaticStreamText = ({
  text,
  interval = 100,
  start = true,
  skip = false,
  onFinish
}: {
  text: string;
  interval?: number;
  skip?: boolean;
  start?: boolean;
  onFinish?: (text: string) => void;
}) => {
  const [streamText, setStreamText] = useState('');

  // const intervalRef = useRef<NodeJS.Timeout>();
  const frameRef = useRef<number>();

  const currentIndex = useRef(0);

  useEffect(() => {
    if (skip) {
      // clearInterval(intervalRef.current);
      cancelAnimationFrame(frameRef.current as number);
      setStreamText(text);
      onFinish && onFinish(text);
    } else {
      // clearInterval(intervalRef.current);
      if (text && start && currentIndex.current < text.length) {
        let lastTime = performance.now();

        const step = (currentTime: number) => {
          frameRef.current = requestAnimationFrame(step);
          if (currentTime - lastTime >= interval) {
            lastTime = currentTime;
            setStreamText(prev => prev + text[currentIndex.current]);
            currentIndex.current++;

            if (currentIndex.current === text.length) {
              console.log('Finish!!!!!!!');

              cancelAnimationFrame(frameRef.current as number);
              onFinish && onFinish(streamText);
            }
          }
        };

        frameRef.current = requestAnimationFrame(step);
      }
    }

    return () => {
      cancelAnimationFrame(frameRef.current as number);
    };
  }, [start, skip]);

  return { streamText };
};
