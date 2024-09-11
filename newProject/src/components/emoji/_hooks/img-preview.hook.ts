import { useState } from 'react';
import { FadeIn, FadeOut } from 'react-native-reanimated';

export const useImgPreview = () => {
  const entering = FadeIn.duration(500);
  const exiting = FadeOut.duration(500);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return { entering, exiting, isImgLoaded, setIsImgLoaded };
};
