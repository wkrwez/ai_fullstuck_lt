import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export const SentenceStreamer = ({
  text,
  speed
}: {
  text: string;
  speed: number;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const sentences = text.split('。'); // 以句号分割句子

  useEffect(() => {
    let index = 0;
    const showNextSentence = () => {
      let timer;
      setDisplayedText(prev => prev + sentences[index] + '。');
      index++;
      if (index < sentences.length) {
        timer = setTimeout(showNextSentence, speed);
      }
      return timer;
    };

    const timer = showNextSentence();

    // 清理函数（可选）
    return () => clearTimeout(timer);
  }, [text, speed]);

  return (
    <View style={{ borderWidth: 1, borderColor: 'red' }}>
      <Text style={{ color: 'white' }}>{displayedText}</Text>
    </View>
  );
};
