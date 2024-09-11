/**
 * 抽取点赞按钮样式方面的设计
 * 将业务相关逻辑抽至上一层，方便不同场景的复用
 */
import { useRef } from 'react';
import {
  Animated,
  ColorValue,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { CommonColor } from '@/src/theme/colors/common';
import { reportClick } from '@/src/utils/report';
import { formatNumber } from '@/src/utils/transNum';
import { OutlinedLike, SolidLike } from '@/assets/image/svg';

export enum LikeStyle {
  LINEAR = 'linear',
  SOLID = 'solid'
}

export enum LikeAlign {
  ROW = 'row',
  COLUMN = 'column'
}

export interface LikeIconProps {
  // 点赞状态
  liked: boolean;
  // 按钮点击回调
  onLike?: (isLike: boolean) => void;
  // 排布方式
  align?: LikeAlign;
  // icon size
  size?: number;
  // icon 主题
  likeIconStyle?: LikeStyle;
  // active 文字颜色
  activeColor?: ColorValue;
  // inactive 文字 + icon 颜色
  inactiveColor?: ColorValue;
  // icon 颜色
  inactiveIconColor?: ColorValue;
  // container style
  style?: ViewStyle;
  // font style
  fontStyle?: TextStyle;
  // 点赞数
  likeCount?: number;
  // 空态文案
  emptyText?: string;
  // 自定义文案，将忽略 likeCount 和 emptyText
  renderText?: (likeCount?: number) => React.ReactNode;
}

export function LikeIcon(props: LikeIconProps) {
  const {
    liked,
    onLike,
    align = LikeAlign.ROW,
    size = 24,
    likeIconStyle = LikeStyle.SOLID,
    activeColor = CommonColor.titleGray,
    inactiveColor = CommonColor.titleGray,
    inactiveIconColor = inactiveColor,
    style,
    fontStyle,
    likeCount,
    emptyText,
    renderText
  } = props;

  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = async () => {
    Animated.timing(scale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = async () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true
    }).start();
  };

  const displayText = likeCount
    ? String(formatNumber(likeCount))
    : emptyText || '';

  return (
    <Pressable
      hitSlop={12}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onLike?.(!liked)}
    >
      <Animated.View
        style={[
          $iconContaier,
          {
            flexDirection: align === LikeAlign.ROW ? 'row' : 'column',
            transform: [{ scale }]
          },
          style
        ]}
      >
        {liked ? (
          <SolidLike color={CommonColor.brand1} width={size} height={size} />
        ) : likeIconStyle === LikeStyle.LINEAR ? (
          <OutlinedLike width={size} height={size} color={inactiveIconColor} />
        ) : (
          <SolidLike color={inactiveIconColor} width={size} height={size} />
        )}

        {renderText ? (
          renderText(likeCount)
        ) : (
          <Text
            style={[
              $iconCount,
              align === LikeAlign.ROW ? $iconCountLeft : $iconCountBottom,
              {
                height: size,
                lineHeight: size,
                color: liked ? activeColor : inactiveColor
              },
              fontStyle
            ]}
          >
            {displayText}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const $iconContaier: ViewStyle = {
  display: 'flex',
  alignItems: 'center'
};

const $iconCount: TextStyle = {
  fontSize: 14,
  fontWeight: '600'
};

const $iconCountLeft: TextStyle = {
  marginLeft: 3
};

const $iconCountBottom: TextStyle = {
  marginTop: 2
};
