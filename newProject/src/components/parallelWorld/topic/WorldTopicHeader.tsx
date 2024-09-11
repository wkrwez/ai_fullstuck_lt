import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { typography } from '@/src/theme';
import { CommonColor } from '@/src/theme/colors/common';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { RootWorldResponse } from '@/proto-registry/src/web/raccoon/query/query_pb';

export function WorldTopicHeader({
  info,
  scrollOverHeader
}: {
  info?: RootWorldResponse;
  scrollOverHeader: boolean;
}) {
  const opacity = useSharedValue(0);
  const $containerStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value
    }),
    []
  );

  useEffect(() => {
    if (scrollOverHeader) {
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [scrollOverHeader]);

  return (
    <Animated.View
      style={[
        {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          flex: 1
        },
        $containerStyle
      ]}
    >
      {info?.topic?.cover ? (
        <Image
          source={info.topic.cover}
          style={{
            width: 27,
            height: 36,
            borderRadius: 4
          }}
          contentFit="cover"
        ></Image>
      ) : null}
      <View
        style={{
          flex: 1
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            fontSize: 14,
            lineHeight: 30,
            fontFamily: typography.fonts.baba.bold,
            color: CommonColor.white,
            width: '100%'
          }}
        >
          #{info?.topic?.name}
        </Text>
      </View>
    </Animated.View>
  );
}
