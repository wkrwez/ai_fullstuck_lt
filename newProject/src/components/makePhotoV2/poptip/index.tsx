import { useMemo } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown
} from 'react-native-reanimated';
import { StyleSheet } from '@/src/utils';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { $potStyle } from '../pannel/PotStyle';

const bg1 = require('@Assets/makephoto/popdown_bg.png');
const bg2 = require('@Assets/makephoto/popup_bg_lg.png');
const bg3 = require('@Assets/makephoto/popup_bg.png');

const $poptipStyle: TextStyle = {
  color: StyleSheet.currentColors.subset.blue.text3,
  fontSize: 10,
  fontWeight: '500',
  textAlign: 'center'
};

const $topStyle: ViewStyle = {
  position: 'absolute',
  width: 79,
  height: 27
  //   left: ($potStyle.width || 0) / 2
};

const $bottomStyle: ViewStyle = {
  position: 'absolute',
  width: 100,
  height: 27
};

export enum PoptipType {
  top = 'top',
  bottom = 'bottom'
}

const getCurrentStyle = (type: PoptipType) => {
  switch (type) {
    case PoptipType.top:
      return {
        ...$topStyle,
        left: ($potStyle.width || 0) / 2 - 40,
        top: ($potStyle.width || 0) * 0.3
      };
    case PoptipType.bottom:
      return {
        ...$bottomStyle,
        left: ($potStyle.width || 0) * 0.6 - 50,
        top: ($potStyle.height || 0) * 0.9
      };
  }
};

const currentBg = {
  [PoptipType.top]: bg1,
  [PoptipType.bottom]: bg3
};

interface PoptipProps {
  visible: boolean;
  type: PoptipType;
  text: string;
}
export function Poptip(props: PoptipProps) {
  const $currentStyle = useMemo(() => {
    return getCurrentStyle(props.type);
  }, [props.type]);

  const $currentTextStyle = useMemo(() => {
    return props.type !== PoptipType.top ? { paddingTop: 5 } : null;
  }, [props.type]);
  return (
    props.visible && (
      <Animated.View
        entering={FadeInDown.duration(500).easing(Easing.ease)}
        exiting={FadeOutDown.duration(500).easing(Easing.ease)}
        style={$currentStyle}
        pointerEvents={'none'}
      >
        <Image
          source={currentBg[props.type]}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        <Text style={[$poptipStyle, $currentTextStyle]}>{props.text}</Text>
      </Animated.View>
    )
  );
}
