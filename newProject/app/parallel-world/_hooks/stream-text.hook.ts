import { useEffect, useRef, useState } from 'react';

export const useStreamText = ({
  text,
  isStreamFinished,
  interval = 100,
  onFinish
}: {
  text: string;
  isStreamFinished: boolean;
  interval?: number;
  onFinish?: () => void;
}) => {
  const [textBuffer, setTextBuffer] = useState('');
  const [streamText, setStreamText] = useState('');
  const [index, setIndex] = useState<number>(0);

  const lastTime = useRef<number>(0);
  const bufferInterval = useRef<NodeJS.Timeout>();
  const finishTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isStreamFinished) {
      setTextBuffer(text);
    } else {
      if (index < text.length) {
        bufferInterval.current = setInterval(() => {
          setTextBuffer(b => (b += ' '));
        }, interval / 2);
      }
    }
    return () => {
      clearInterval(bufferInterval.current);
    };
  }, [text, isStreamFinished]);

  useEffect(() => {
    const now = Date.now();
    if (now - lastTime.current >= interval) {
      if (text[0] !== streamText[0]) {
        setStreamText(textBuffer);
        setIndex(text.length);
      } else {
        if (index < text.length) {
          lastTime.current = now;
          setStreamText(prev => prev + textBuffer[index]);
          setIndex(index => index + 1);
        } else {
          clearInterval(bufferInterval.current);

          if (!finishTimeout.current) {
            finishTimeout.current = setTimeout(() => {
              onFinish && onFinish();
            }, 2000);
          }
        }
      }
    }
    return () => {
      clearTimeout(finishTimeout.current);
    };
  }, [textBuffer]);

  return { streamText };
};
