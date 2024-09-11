import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

export function usePageFocused() {
  const [focused, setFocused] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      setFocused(true);
    });
    const unsubscribe2 = navigation.addListener('blur', () => {
      setFocused(false);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return focused;
}
