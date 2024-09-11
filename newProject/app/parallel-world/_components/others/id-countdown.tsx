import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { $flexHCenter } from '@/src/theme/variable';
import { NumLoop } from './countdown';

export interface IDCountdownRef {
  manualSetTarget: (countList: number[]) => void;
}

interface IDCountdownProps {
  targetId: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onLoaded?: () => void; // 获取到id时执行
  onEnd?: () => void; // 动画执行完毕时执行
}

const IDCountdown = forwardRef<IDCountdownRef | undefined, IDCountdownProps>(
  (
    {
      targetId = '',
      style: $style,
      textStyle: $textStyle = {},
      onLoaded,
      onEnd
    },
    ref
  ) => {
    const [countList, setCountList] = useState<number[]>([]);

    useEffect(() => {
      if (targetId) {
        if (onLoaded) onLoaded();
        const numArr = targetId.split('').map(Number);
        setCountList(numArr);
      }
    }, [targetId]);

    // 手动触发停止
    useImperativeHandle(ref, () => ({
      manualSetTarget: (countList: number[]) => {
        setCountList(countList);
      }
    }));

    return (
      <View style={[styles.container, $style]}>
        {countList?.length > 0 &&
          countList.map((num, idx) => (
            <NumLoop
              targetNumber={num}
              key={idx}
              delay={idx * 300}
              textStyle={$textStyle}
              onEnd={idx === countList.length - 1 ? onEnd : undefined}
            />
          ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...$flexHCenter
  }
});

export default IDCountdown;
