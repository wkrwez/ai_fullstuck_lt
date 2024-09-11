import { router } from 'expo-router';
import { useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useSafeAreaInsetsStyle,
  useSafeBottomArea,
  useScreenSize
} from '@/src/hooks';
import { CommonColor } from '@/src/theme/colors/common';
import { reportClick } from '@/src/utils/report';
import { Button, IconPosition } from '../../button';
import { RootWorldResponse } from '@/proto-registry/src/web/raccoon/query/query_pb';

export function WorldTopicLink({ info }: { info?: RootWorldResponse }) {
  const $bottom = useSafeBottomArea();
  const windowWidth = useScreenSize('screen').width;
  const [btnWidth, setBtnSize] = useState(150);

  const cardId = info?.world?.cardId;

  const onClick = () => {
    reportClick('script_card', {});
    router.push(`/parallel-world/${info?.world?.cardId}`);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setBtnSize(width);
  };

  return cardId ? (
    <Button
      onLayout={onLayout}
      preset="middle"
      iconText="goto_icon"
      iconPosition={IconPosition.RIGHT}
      style={{
        position: 'absolute',
        left: windowWidth / 2 - btnWidth / 2,
        bottom: $bottom,
        backgroundColor: CommonColor.brand1
      }}
      onPress={onClick}
      textStyle={{
        lineHeight: 20
      }}
    >
      开启我的宇宙
    </Button>
  ) : null;
}
