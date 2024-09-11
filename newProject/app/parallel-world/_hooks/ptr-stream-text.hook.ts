import { useEffect, useRef, useState } from 'react';

export const usePtrStreamText = ({
  text,
  isStreamFinished,
  interval = 1000,
  onFinish
}: {
  text: string;
  isStreamFinished: boolean;
  interval?: number;
  onFinish?: () => void;
}) => {
  const ptrRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const textBuffer = useRef<string>('');

  const [streamText, setStreamText] = useState('');

  textBuffer.current = text;

  useEffect(() => {
    if (intervalRef.current) {
      return;
    }
    intervalRef.current = setInterval(() => {
      const char = textBuffer.current[ptrRef.current];
      if (char) {
        setStreamText(t => t + textBuffer.current[ptrRef.current]);
        ptrRef.current++;
      } else {
        if (isStreamFinished) {
          clearInterval(intervalRef.current);
          onFinish && onFinish();
        }
      }
    }, interval);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return { streamText };
};
