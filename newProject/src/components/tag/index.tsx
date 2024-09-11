import { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { CommonColor } from '@/src/theme/colors/common';

const DEFULT_TEXT_WIDTH = 30;
export function Tag({
  text,
  onPress,
  style,
  visible
}: {
  text: string;
  onPress?: () => void;
  style?: ViewStyle;
  visible?: boolean;
}) {
  const [textWidth, setTextWidth] = useState(DEFULT_TEXT_WIDTH);
  const [innerVisible, setInnerVisible] = useState(false);

  const tagWidth = useSharedValue(textWidth);
  const tagOpacity = useSharedValue(0);
  const pointScale = useSharedValue(1);

  const $animatedStyles = useAnimatedStyle(() => ({
    opacity: tagOpacity.value
  }));

  const $pointAnimatedStyles = useAnimatedStyle(() => ({
    transformOrigin: 'center',
    transform: [{ scale: pointScale.value }]
  }));

  const $tagStyles = useAnimatedStyle(() => {
    return {
      width: tagWidth.value + 32 + 2,
      opacity: tagOpacity.value
    };
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  useEffect(() => {
    pointScale.value = withRepeat(
      withTiming(0.8, {
        duration: 800
      }),
      -1,
      true
    );

    return () => {
      cancelAnimation(pointScale);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setInnerVisible(true);
    } else {
      tagWidth.value = withTiming(
        DEFULT_TEXT_WIDTH,
        {
          duration: 400
        },
        () => runOnJS(setInnerVisible)(false)
      );
      tagOpacity.value = withTiming(0, {
        duration: 400
      });
    }
  }, [visible]);

  useEffect(() => {
    if (innerVisible) {
      tagWidth.value = withTiming(textWidth, {
        duration: 400
      });
      tagOpacity.value = withTiming(1, {
        duration: 400
      });
    }
  }, [innerVisible, textWidth]);

  return visible || innerVisible ? (
    <View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        },
        style
      ]}
    >
      <Animated.View style={[$animatedStyles]}>
        <View
          style={{
            width: 12,
            height: 12,
            flex: 0
          }}
        >
          <Animated.View style={[$pointAnimatedStyles, $tagPointBack]} />
          <View style={$tagPointCenter}></View>
        </View>
      </Animated.View>

      {/* 用于计算tag宽度 */}
      <View onLayout={onLayout} style={$tagShadow}>
        <Text
          style={{
            color: 'transparent'
          }}
        >
          #{text}
        </Text>
      </View>
      <Pressable
        onPress={onPress}
        style={{
          flex: 1
        }}
      >
        <Animated.View style={[$tagTextContainer, $tagStyles]}>
          <Text
            style={{
              color: CommonColor.white
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            #{text}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  ) : null;
}

const $tagPointCenter: ViewStyle = {
  position: 'absolute',
  top: 3,
  left: 3,
  width: 6,
  height: 6,
  borderRadius: 6,
  backgroundColor: CommonColor.white
};

const $tagPointBack: ViewStyle = {
  top: 0,
  left: 0,
  width: 12,
  height: 12,
  position: 'absolute',
  borderRadius: 12,
  backgroundColor: CommonColor.white1
};

const $tagTextContainer: ViewStyle = {
  paddingVertical: 7,
  paddingHorizontal: 16,
  borderColor: CommonColor.white,
  backgroundColor: CommonColor.white1,
  borderWidth: 1,
  borderRadius: 50,
  maxWidth: '100%'
};

const $tagShadow: ViewStyle = {
  position: 'absolute',
  pointerEvents: 'none'
};
