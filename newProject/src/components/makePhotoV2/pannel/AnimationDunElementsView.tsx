import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { StyleSheet } from '@/src/utils';
import { Image } from '@Components/image';
import { PromptType, config } from '@Components/makePhotoV2/constant';
import { Text } from '@Components/text';
import { useShallow } from 'zustand/react/shallow';
import { $pannelStyle } from './PannelBg';
import { $potStyle } from './PotStyle';

type SharedValueItemType = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  rot: SharedValue<number>;
};
type ShareValueType = {
  [key in PromptType]: SharedValueItemType;
};

const SINGLE_TARGET_POS = {
  top: -180,
  left: ($pannelStyle.left || 0) + ($potStyle.width || 0) / 2
};

const arr = [
  PromptType.expression,
  PromptType.cloth,
  PromptType.action,
  PromptType.scene
];

const presetPosition = arr.map((key, index) => {
  return {
    top: 55 + 72 * index,
    left: ($pannelStyle.left || 0) + ($pannelStyle.width || 0) - 75
  };
});

const getDefaultSharedValue = () => {
  return {
    rot: useSharedValue(0),
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
};

const targetPosition = presetPosition.map(item => ({
  ...item,
  deltaX: SINGLE_TARGET_POS.left - item.left + (Math.random() - 0.5) * 100,
  deltaY: SINGLE_TARGET_POS.top - item.top + (Math.random() - 0.5) * 100,
  rot: Math.random() * 360
}));

export function AnimationDunElementsView() {
  const { pageState, currentPresetPrompts, currentAdditionPrompts } =
    useMakePhotoStoreV2(
      useShallow(state => ({
        pageState: state.pageState,
        currentPresetPrompts:
          state.selectedRoleIndex === 0
            ? state.presetPrompts
            : state.presetPrompts2,
        currentAdditionPrompts: state.additionPrompts.concat(
          state.additionPrompts2
        )
      }))
    );

  console.log(111111, currentPresetPrompts);

  const shareValues: ShareValueType = {
    expression: getDefaultSharedValue(),
    action: getDefaultSharedValue(),
    cloth: getDefaultSharedValue(),
    scene: getDefaultSharedValue(),
    addition: getDefaultSharedValue()
  };

  const addiShareValues: SharedValueItemType[] = currentAdditionPrompts.map(
    (item, index) => getDefaultSharedValue()
  );

  const getAnimatedStyle = (key: PromptType) => {
    return useAnimatedStyle(() => ({
      transform: [
        {
          translateX: shareValues[key].x.value
        },
        {
          translateY: shareValues[key].y.value
        },
        {
          rotate: `${shareValues[key].rot.value}deg`
        }
      ]
    }));
  };

  const getAddiAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [
        {
          translateX: addiShareValues[index].x.value
        },
        {
          translateY: addiShareValues[index].y.value
        },
        {
          rotate: `${addiShareValues[index].rot.value}deg`
        }
      ]
    }));
  };

  const $animateStyles = arr.map(key => getAnimatedStyle(key));
  const $additionStyles = currentAdditionPrompts.map((_, index) => {
    return getAddiAnimatedStyle(index);
  });

  useEffect(() => {
    arr.forEach((key, index) => {
      setTarget(key, index);
    });
    currentAdditionPrompts.forEach((key, index) => {
      setAddiTarget(index);
    });
  }, []);

  const PresetNodes = useCallback(() => {
    console.log(12345, currentPresetPrompts);
    return arr.map((key, index) => {
      const item = currentPresetPrompts[key]
        ? // @ts-ignore
          findPromptItem(currentPresetPrompts[key].text)
        : null;
      return (
        <Animated.View
          key={key + index}
          style={[
            {
              position: 'absolute',
              top: presetPosition[index].top,
              left: presetPosition[index].left,
              width: 30,
              height: 30,
              ...StyleSheet.centerStyle
            },
            $animateStyles[index]
          ]}
        >
          {item && (
            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
              source={item.icon}
            />
          )}
        </Animated.View>
      );
      // return <Image source={config.expression.id} />;
    });
  }, [currentPresetPrompts]);

  return (
    <View>
      {<PresetNodes />}
      {currentAdditionPrompts.map((text, index) => (
        <Animated.View
          key={index}
          style={[
            $additionStyles[index],
            {
              position: 'absolute',
              top: 0,
              left: $pannelStyle.left,
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
            {text}
          </Text>
        </Animated.View>
      ))}
    </View>
  );

  function setTarget(type: PromptType, index: number) {
    shareValues[type].rot.value = withSpring(targetPosition[index].rot, {
      duration: 1000
    });
    shareValues[type].x.value = withSpring(targetPosition[index].deltaX, {
      duration: 1000
    });
    shareValues[type].y.value = withSpring(targetPosition[index].deltaY, {
      duration: 1000
    });
  }

  function setAddiTarget(index: number) {
    addiShareValues[index].rot.value = withSpring(Math.random() * 360, {
      duration: 1000
    });
    addiShareValues[index].x.value = withSpring(
      SINGLE_TARGET_POS.left + (Math.random() - 0.5) * 100,
      {
        duration: 1000
      }
    );
    addiShareValues[index].y.value = withSpring(
      SINGLE_TARGET_POS.top + 45 + (Math.random() - 0.5) * 100,
      {
        duration: 1000
      }
    );
  }
}

function findPromptItem(text: string) {
  return Object.values(config).find(item => item.text === text);
}
