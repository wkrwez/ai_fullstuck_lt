import { ReactNode, useRef } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { limit } from '@Utils/number';

interface TouchScrollListProps {
  children: ReactNode;
  max?: number;
  min?: number;
}
export function TouchScrollList(props: TouchScrollListProps) {
  const scrollX = useSharedValue(0);
  const lastRef = useRef(0);

  const pan = Gesture.Pan();
  pan
    .enabled(true)
    .onStart(e => {
      lastRef.current = e.absoluteX;
    })
    .onUpdate(e => {
      const delta = e.absoluteX - lastRef.current;
      scrollX.value += delta;
      lastRef.current = e.absoluteX;
    })
    .onEnd(e => {
      scrollX.value = limit(scrollX.value, props.min || 0, props.max || 0);
      lastRef.current = e.absoluteX;
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: scrollX
            }
          ]
        }}
      >
        {props.children}
      </Animated.View>
    </GestureDetector>
  );
}
