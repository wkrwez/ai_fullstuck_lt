import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  NativeEventEmitter,
  Pressable,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Text } from '@Components/text';

const st = StyleSheet.create({
  $wrap: {
    ...StyleSheet.columnStyle,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    width: '100%',
    padding: StyleSheet.spacing.md
  },
  $colBtn: {
    position: 'absolute',
    right: 0,
    height: 22,
    gap: 2
  },
  $colText: {
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.24),
    fontSize: 12,
    lineHeight: 22,
    fontWeight: '500'
  }
});

interface CollapseProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  colBtnSyle?: StyleProp<ViewStyle>;
  colText?: string;
  expandHeight: number; // todo 组件内部动态计算有问题，暂时先外部传入
  header: ReactNode | string;
  body: ReactNode | string;
}

interface BodyProps extends CollapseProps {
  onChangeHeight?: (v: number) => void;
}

function renderHeader(
  props: CollapseProps & {
    expand: boolean;
    onPress: (expand: boolean) => void;
  }
) {
  const rotValue = useSharedValue(0);

  const rotateStyles = useAnimatedStyle(() => {
    const rotateKeyframes = interpolate(rotValue.value, [0, 1], [0, 180]);

    return {
      transform: [{ rotate: `${rotateKeyframes}deg` }]
    };
  });

  useEffect(() => {
    if (props.expand) {
      rotValue.value = withTiming(1, { duration: 300 });
    } else {
      rotValue.value = withTiming(0, { duration: 300 });
    }
  }, [props.expand]);

  return (
    <View>
      {typeof props.body === 'string' ? (
        <Text>{props.header}</Text>
      ) : (
        props.header
      )}
      <Pressable
        style={[StyleSheet.rowStyle, st.$colBtn, props.colBtnSyle]}
        onPress={() => props.onPress?.(!props.expand)}
      >
        <Text style={st.$colText}>
          {props.expand ? '收起' : props.title || '展开'}
        </Text>
        <Animated.View style={rotateStyles}>
          <Icon size={12} icon="drop" />
        </Animated.View>
      </Pressable>
    </View>
  );
}
function renderBody(props: CollapseProps & BodyProps) {
  const bodyRef = useRef<View>(null);
  useEffect(() => {
    if (!bodyRef.current) return;
    bodyRef.current.measure(height => {
      props.onChangeHeight && props.onChangeHeight(height);
    });
  }, []);
  return (
    <View ref={bodyRef}>
      {typeof props.body === 'string' ? <Text>{props.body}</Text> : props.body}
    </View>
  );
}
export function Collapse(props: CollapseProps) {
  const [expand, setExpand] = useState(false);
  const heightValue = useSharedValue(0);
  const opacityValue = useSharedValue(1);

  const $listStyles = useAnimatedStyle(() => {
    return {
      height: heightValue.value
      // opacity: opacityValue.value
    };
  });

  useEffect(() => {
    if (expand) {
      heightValue.value = withTiming(props.expandHeight, { duration: 300 });
      opacityValue.value = withTiming(1, { duration: 300 });
    } else {
      heightValue.value = withTiming(0, { duration: 300 });
      opacityValue.value = withTiming(0, { duration: 300 });
    }
  }, [expand]);

  return (
    <View style={[st.$wrap, props.style]}>
      {renderHeader({
        ...props,
        expand,
        onPress: () => {
          setExpand(v => {
            return !v;
          });
        }
      })}

      <Animated.View
        style={[
          $listStyles,
          {
            overflow: 'hidden'
          }
        ]}
      >
        {renderBody({ ...props })}
      </Animated.View>
    </View>
  );
}
