import Animated, { Easing } from 'react-native-reanimated';
import { ANIMATE_TIME } from '../constant';

const animateEffect = Easing.out(Easing.ease);
export const easeEffect = {
  duration: ANIMATE_TIME,
  easing: animateEffect
};
