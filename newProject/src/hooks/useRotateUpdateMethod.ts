import { useMemo, useRef } from 'react';
import { Animated } from 'react-native';
// todo 依赖要改
import { createStyleList } from '../components/turn/createStyleList';
import { findClosestNumber } from '../components/turn/utils';

interface RotateUpdateProps {
  radius: number;
  rot: number;
}
export function useRotateUpdateMethod(props: RotateUpdateProps) {
  const rotateDeg = useRef(new Animated.Value(0)).current;
  const lastRotateDeg = useRef(0);
  const rotateList = useMemo(() => {
    return createStyleList(props.radius, props.rot);
  }, [props.radius]);

  // todo 惯性
  const updateRot = (number: number) => {
    const newDeg = lastRotateDeg.current + number / 3;
    rotateDeg.setValue(newDeg);
    lastRotateDeg.current = newDeg;
  };

  const gotoNest = (min: number, max: number) => {
    const nest = findClosestNumber(
      rotateList.map(i => i.rotate),
      lastRotateDeg.current,
      min,
      max
    );
    Animated.timing(rotateDeg, {
      toValue: nest,
      duration: 1000,
      useNativeDriver: true
    }).start();
    lastRotateDeg.current = nest;
  };

  const goto = (num: number) => {
    if (!num) return;
    const nest = rotateList[num].rotate;
    Animated.timing(rotateDeg, {
      toValue: nest,
      duration: 500,
      useNativeDriver: true
    }).start();
    lastRotateDeg.current = nest;
  };

  return {
    rotateDeg,
    updateRot,
    gotoNest,
    goto,
    radius: props.radius,
    rotateList
  };
}
