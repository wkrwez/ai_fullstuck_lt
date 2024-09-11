import { useEffect } from 'react';
import { useEmojiCreatorStore } from '@/src/store/emoji-creator';

export const useResetOnUnmount = () => {
  const { reset } = useEmojiCreatorStore(state => state);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);
};
