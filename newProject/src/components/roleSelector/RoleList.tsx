import { useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { RoleItemType } from '@/src/types';
import { StyleSheet } from '@Utils/StyleSheet';
import { RoleItem } from './RoleItem';

interface RoleListProps {
  list: RoleItemType[];
  value: RoleItemType | null;
  selectedRole?: RoleItemType | null;
  onChange: (v: RoleItemType) => void;
}

const theme = StyleSheet.currentColors.subset.blue;

const maskColors = [StyleSheet.hex(theme.black, 0), theme.black];
const maskColors2 = [StyleSheet.hex('#282C35', 0), '#282C35'];
const st = StyleSheet.create({
  $rolelistWrap: {
    gap: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

const $maskStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: 100
};

const checkBottom = (a: number, b: number) => {
  if (Math.abs(a - b) < 10) {
    return true;
  }
  if (a > b) {
    return true;
  }
  return false;
};
export function RoleList(props: RoleListProps) {
  const scrollRef = useRef<ScrollView>(null);
  const opacityTopVal = useSharedValue(0);
  const opacityBottomVal = useSharedValue(1);

  const $topAnimationStyle = useAnimatedStyle(() => ({
    opacity: opacityTopVal.value
  }));
  const $bottmAnimationStyle = useAnimatedStyle(() => ({
    opacity: opacityBottomVal.value
  }));
  const inTop = useRef(true);
  const inBottom = useRef(false);
  const { width } = useScreenSize();
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[$maskStyle, { top: 0, zIndex: 1 }, $topAnimationStyle]}
        pointerEvents={'none'}
      >
        <LinearGradient
          pointerEvents="none"
          style={{ left: '-10%', width: '120%', height: '100%' }}
          colors={[maskColors[1], maskColors[0]]}
        />
      </Animated.View>

      {/* todo 要改成flatlist */}
      <ScrollView
        scrollEventThrottle={100}
        ref={scrollRef}
        style={{ height: '100%' }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        <View style={[st.$rolelistWrap]}>
          {props.list.map((item, index) => (
            <RoleItem
              {...item}
              key={item.key}
              checked={props.value ? props.value.id === item.id : false}
              selected={props?.selectedRole?.id === item.id}
              onChange={e => {
                props.onChange(e);
              }}
            />
          ))}
        </View>
      </ScrollView>

      <Animated.View
        style={[$maskStyle, { bottom: 0 }, $bottmAnimationStyle]}
        pointerEvents={'none'}
      >
        <LinearGradient
          pointerEvents="none"
          style={{ left: '-10%', width: '120%', height: '100%' }}
          colors={[maskColors2[0], maskColors2[1]]}
        />
      </Animated.View>
    </View>
  );

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const { nativeEvent } = event;
    const scrollPosition = nativeEvent.contentOffset.y;
    const scrollViewHeight = nativeEvent.layoutMeasurement.height;
    const contentHeight = nativeEvent.contentSize.height;

    // 判断是否滚动到底部
    if (checkBottom(scrollPosition + scrollViewHeight, contentHeight)) {
      if (inBottom.current) {
        // 已经在底部
        return;
      }
      inBottom.current = true;
      opacityBottomVal.value = withTiming(0, { duration: 300 });
    } else {
      if (inBottom.current) {
        inBottom.current = false;
        opacityBottomVal.value = withTiming(1, { duration: 300 });
      }
    }

    console.log(scrollPosition, inTop.current);
    if (scrollPosition <= 0) {
      if (inTop.current) return;
      inTop.current = true;
      opacityTopVal.value = withTiming(0, { duration: 300 });
    } else {
      if (inTop.current) {
        inTop.current = false;
        opacityTopVal.value = withTiming(1, { duration: 300 });
      }
    }
  }
}
