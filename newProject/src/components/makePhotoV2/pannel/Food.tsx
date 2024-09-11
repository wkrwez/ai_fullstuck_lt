import { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import {
  PresetPromptsItemType,
  PresetPromptsType,
  useMakePhotoStoreV2
} from '@/src/store/makePhotoV2';
import { getScreenSize } from '@/src/utils';
import { Image } from '@Components/image';
import { PromptType, config } from '@Components/makePhotoV2/constant';
import { Text } from '@Components/text';
import { useShallow } from 'zustand/react/shallow';

const DURATION = 1000;
// 锅里的食材散列
interface FoodProps {
  //   items: [];
  textItems: string[];
  imageItems: (number | undefined)[];
  width: number;
  height: number;
  scale: number;
}

// 文本食物
interface FoodTextItemProps {
  item: string;
  style: StyleType;
  scale: number;
}

type StyleType = {
  x: number;
  y: number;
  rotate: number;
  deltaX: number;
  deltaY: number;
};
export function FoodTextItem(props: FoodTextItemProps) {
  const translateX = useSharedValue(props.style.x);
  const translateY = useSharedValue(props.style.y);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(0, {
      duration: DURATION
    });
    translateY.value = withSpring(0, {
      duration: DURATION
    });
    rotate.value = withSpring(props.style.rotate, {
      duration: DURATION
    });
  }, []);
  const $animateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value
      },
      {
        translateX: translateY.value
      },
      {
        rotate: `${rotate.value}deg`
      },
      {
        scale: props.scale
      }
    ]
  }));
  return (
    <Animated.View
      style={[
        $animateStyle,
        {
          position: 'absolute',
          top: props.style.y,
          left: props.style.x,
          display: 'flex',
          flexDirection: 'row'
        }
      ]}
    >
      <Text
        ellipsizeMode="tail"
        style={{
          position: 'absolute',
          fontSize: 10,
          fontWeight: '500',
          color: '#FFE9D5',
          maxWidth: 60
        }}
      >
        {props.item}
      </Text>
    </Animated.View>
  );
}

// 图片食物
interface FoodImageItemProps {
  item: number;
  style: StyleType;
  scale: number;
}
export function FoodImageItem(props: FoodImageItemProps) {
  const translateX = useSharedValue(props.style.x);
  const translateY = useSharedValue(props.style.y);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(0, {
      duration: DURATION
    });
    translateY.value = withSpring(0, {
      duration: DURATION
    });
    rotate.value = withSpring(props.style.rotate, {
      duration: DURATION
    });
  }, []);
  const $animateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value
      },
      {
        translateX: translateY.value
      },
      {
        rotate: `${rotate.value}deg`
      },
      {
        scale: props.scale
      }
    ]
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: props.style.y,
          left: props.style.x,
          width: 30,
          height: 30
        },
        $animateStyle
      ]}
    >
      <Image
        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
        source={props.item}
      />
    </Animated.View>
  );
}

export function Food(props: FoodProps) {
  const textStyleList = useMemo(() => {
    return getStyleList(props.textItems, props.width, props.height);
  }, []);

  const imagesStyleList = useMemo(() => {
    return getStyleList(props.imageItems, props.width, props.height);
  }, []);
  return (
    <>
      {props.textItems.map((item, index) => (
        <FoodTextItem
          key={index}
          item={item}
          style={textStyleList[index]}
          scale={props.scale}
        />
      ))}
      {props.imageItems.map(
        (item, index) =>
          item && (
            <FoodImageItem
              key={index + item}
              item={item}
              scale={props.scale}
              style={imagesStyleList[index]}
            />
          )
      )}
    </>
  );
}

export enum FoodType {
  full = 'full',
  left = 'left',
  right = 'right'
}

interface FoodWithStateProps {
  width: number;
  height: number;
  type: FoodType;
}

export function FoodWithState(props: FoodWithStateProps) {
  const textItems = useMemo(() => {
    const { additionPrompts, additionPrompts2, presetPrompts, presetPrompts2 } =
      useMakePhotoStoreV2.getState();
    switch (props.type) {
      case FoodType.full:
        return getTexts(additionPrompts, presetPrompts);
      case FoodType.left:
        return getTexts(additionPrompts, presetPrompts);
      case FoodType.right:
        return getTexts(additionPrompts2, presetPrompts2);
      default:
        return getTexts(additionPrompts, presetPrompts);
    }
  }, []);

  const imageItems = useMemo(() => {
    const { presetPrompts, presetPrompts2 } = useMakePhotoStoreV2.getState();
    switch (props.type) {
      case FoodType.full:
        return getImages(presetPrompts);
      case FoodType.left:
        return getImages(presetPrompts);
      case FoodType.right:
        return getImages(presetPrompts2);
      default:
        return getImages(presetPrompts);
    }
  }, []);

  return (
    <Food
      width={props.width}
      height={props.height}
      textItems={textItems}
      imageItems={imageItems}
      scale={props.type === FoodType.full ? 1 : 0.8}
    />
  );
}

function getTexts(additionPrompts: string[], presetPrompts: PresetPromptsType) {
  return additionPrompts.concat(
    Object.values(presetPrompts)
      .filter(i => i && i.type === 'custom')
      .map(i => i.text)
  );
}

function getImages(presetPrompts: PresetPromptsType) {
  return Object.values(presetPrompts)
    .filter(i => i && i.type !== 'custom')
    .map(i => {
      return findPromptItem(i.text)?.icon;
    });
}

function getStyleList(items: unknown[], width: number, height: number) {
  const screenWidth = getScreenSize('width');
  return items.map(i => {
    const x = width / 2 + ((Math.random() - 0.5) * width) / 3;
    const y = height / 2 + ((Math.random() - 0.5) * height) / 3;
    const rotate = Math.random() * 360;
    const deltaX = (Math.random() - 0.5) * screenWidth;
    const deltaY = 0 - (Math.random() - 0.5) * screenWidth;
    return {
      x,
      y,
      rotate,
      deltaX,
      deltaY
    };
  });
}

function findPromptItem(text: string) {
  return Object.values(config).find(item => item.text === text);
}
