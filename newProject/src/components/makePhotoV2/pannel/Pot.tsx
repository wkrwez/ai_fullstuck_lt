import LottieView from 'lottie-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { PageState, useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { dp2px, getScreenSize } from '@/src/utils';
import { Image, ImageStyle } from '@Components/image';
import { Poptip, PoptipType } from '@Components/makePhotoV2/poptip';
import { Text } from '@Components/text';
import { LottieMannager, PlayStatus } from '@Utils/LottieManager';
import { PositionStyle, StyleSheet } from '@Utils/StyleSheet';
import { checkNullObj } from '@Utils/checkEmptyObj';
import { ANIMATE_TIME, PAGE_TOP, PANNEL_TOP } from '../constant';
import { useShallow } from 'zustand/react/shallow';
import { FoodType, FoodWithState } from './Food';
import { $potStyle } from './PotStyle';
import { easeEffect } from './animate';

const SHADOW_IMAGE = require('@Assets/makephoto/pot/shadow.png');
const POT_IMAGE = require('@Assets/makephoto/pot/single.png');
const POT_RED_IMAGE = require('@Assets/makephoto/pot/single_red.png');
const POT_YUANYANG = require('@Assets/makephoto/pot/yuanyang.png');
const MASK_LEFT = require('@Assets/makephoto/pot/mask_left.png');
const MASK_RIGHT = require('@Assets/makephoto/pot/mask_right.png');
const MASK_SINGLE = require('@Assets/makephoto/pot/mask_single.png');

const LOTTIE_BLINK = require('@Assets/lottie/makephoto_blink.json');
const LOTTIE_BLINK2 = require('@Assets/lottie/makephoto_blink2.json');
const LOTTIE_LOOKUP = require('@Assets/lottie/makephoto_lookup.json');
const LOTTIE_SURPRISE = require('@Assets/lottie/makephoto_surprise.json');
const LOTTIE_THINKING = require('@Assets/lottie/makephoto_thinking.json');

export enum ExpType {
  lookup = 'lookup',
  blink = 'blink',
  blink2 = 'blink2',
  surprise = 'surprise',
  thinking = 'thinking'
}

const DESIGN_WIDTH = 306; // 视觉稿锅的尺寸

const $pointStyle: ViewStyle = {
  position: 'absolute',
  width: 42,
  height: 42,
  borderRadius: 500,
  backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.7)
};

const $pointActive: ViewStyle = {
  width: 50,
  height: 50,
  borderWidth: 1,
  borderColor: StyleSheet.currentColors.white,
  backgroundColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.7)
};
const $pointStyle1: ViewStyle = {
  top: 0,
  left: 40
};

const $pointStyle2: ViewStyle = {
  top: 0,
  right: 40
};

const $pointTextStyle: TextStyle = {
  fontSize: 24,
  lineHeight: 42,
  textAlign: 'center',
  color: StyleSheet.currentColors.white
};

const $pointTextActiveStyle: TextStyle = {
  fontSize: 28,
  lineHeight: 50,
  textAlign: 'center',
  color: StyleSheet.currentColors.black
};

export function Pot() {
  const {
    pageState,
    promptLoading,
    selectedRoleIndex,
    additionPrompts,
    presetPrompts,
    role2
  } = useMakePhotoStoreV2(
    useShallow(state => ({
      additionPrompts:
        state.selectedRoleIndex === 0
          ? state.additionPrompts
          : state.additionPrompts2,
      presetPrompts:
        state.selectedRoleIndex === 0
          ? state.presetPrompts
          : state.presetPrompts2,
      pageState: state.pageState,
      promptLoading: state.promptLoading,
      role2: state.role2,
      selectedRoleIndex: state.selectedRoleIndex
    }))
  );

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const potOpacity = useSharedValue(0);
  const potTranslateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const width = getScreenSize('width');
  const lottieRef = useRef<LottieView | null>(null);
  const lottieManagerRef = useRef<LottieMannager>();
  const currentExp = useRef<ExpType>(); // 当前表情
  const startTimeRef = useRef(0);
  const [source, setSource] = useState(LOTTIE_BLINK);

  const [poptipVis, setPoptipVis] = useState(false);
  const [poptipText, setPoptipText] = useState('');
  const [poptipType, setPoptipType] = useState(PoptipType.top);

  const ratio = useMemo(() => {
    return ($potStyle.width || 0) / DESIGN_WIDTH;
  }, []);

  const $maskLeftStyle = useMemo(() => {
    return {
      width: ratio * 115,
      height: ratio * 156,
      top: ratio * 33,
      left: ratio * 47
    };
  }, [ratio]);

  const $maskRightStyle = useMemo(() => {
    return {
      width: ratio * 118,
      height: ratio * 151,
      top: ratio * 35,
      left: ratio * 140
    };
  }, [ratio]);

  const $maskSingleStyle = useMemo(() => {
    return {
      width: ratio * 231,
      height: ratio * 165,
      top: ratio * 26,
      left: ratio * 37
    };
  }, [ratio]);

  useEffect(() => {
    if (pageState === PageState.diy) {
      translateX.value = withTiming(0, easeEffect);
      translateY.value = withTiming(0, easeEffect);
      scale.value = withTiming(1, easeEffect);
      currentExp.current = ExpType.surprise;
      // setTimeout(() => {
      //   lottieManagerRef.current?.play('surprise');
      // });
      if (!additionPrompts?.length && checkNullObj(presetPrompts)) {
        showPoptip('今天炖什么', PoptipType.top);
      } else if (!additionPrompts?.length) {
        showPoptip('再加点料？', PoptipType.top);
      } else {
        showPoptip(
          Math.random() < 0.5 ? '迫不及待了~' : '准备柴火~',
          PoptipType.bottom
        );
      }
    }

    if (pageState === PageState.promptselect) {
      translateY.value = withTiming(
        0 - 0.25 * ($potStyle.height || 0),
        easeEffect
      );
      translateX.value = withTiming(
        0 - 0.25 * ($potStyle.width || 0),
        easeEffect
      );
      scale.value = withTiming(0.7, easeEffect);
      currentExp.current = ExpType.lookup;

      if (checkNullObj(presetPrompts)) {
        showPoptip('加麻加辣', PoptipType.top);
      }
      // setTimeout(() => {
      //   lottieManagerRef.current?.play('lookup');
      // });
      return;
    }
    if (pageState === PageState.styleselect) {
      translateX.value = withTiming(
        (width - ($potStyle.width || 0)) / 2 - 0.18 * ($potStyle.width || 0),
        easeEffect
      );
      translateY.value = withTiming(
        0 - 0.35 * ($potStyle.height || 0),
        easeEffect
      );
      scale.value = withTiming(1.28, easeEffect);
      showPoptip(
        role2 ? '鸳鸯锅也能换料哦~' : '点我换料哦~',
        PoptipType.bottom
      );
    }
  }, [pageState]);

  useEffect(() => {
    if (pageState === PageState.styleselect) {
      showPoptip(
        role2 ? '鸳鸯锅也能换料哦~' : '点我换料哦~',
        PoptipType.bottom
      );
    }
  }, [role2]);

  useEffect(() => {
    if (promptLoading) {
      currentExp.current = ExpType.thinking;
      requestAnimationFrame(expAnimation);
      potOpacity.value = withSequence(
        withTiming(1, { duration: 2000 }),
        withDelay(2000, withTiming(0, { duration: 1000 }))
      );
      potTranslateY.value = withSequence(
        withTiming(-20, { duration: 500, easing: Easing.ease }),
        withDelay(2000, withTiming(0, { duration: 500, easing: Easing.ease }))
      );

      const { additionPromptKey, presetPromptsKey, selectedElementsKey } =
        useMakePhotoStoreV2.getState().getCurrentPrompts();
      useMakePhotoStoreV2.getState().setState({
        [additionPromptKey]: [],
        [selectedElementsKey]: {},
        [presetPromptsKey]: {}
      });
    }
  }, [promptLoading]);

  useEffect(() => {
    const lottieManager = new LottieMannager(
      lottieRef,
      {
        blink: LOTTIE_BLINK,
        blink2: LOTTIE_BLINK2,
        lookup: LOTTIE_LOOKUP,
        surprise: LOTTIE_SURPRISE,
        thinking: LOTTIE_THINKING
      },
      v => {
        setSource(v);
      }
    );
    lottieManagerRef.current = lottieManager;
    const aniId = requestAnimationFrame(expAnimation);

    return () => {
      cancelAnimationFrame(aniId);
    };
  }, []);

  useEffect(() => {
    if (additionPrompts?.length && !checkNullObj(presetPrompts)) {
      showPoptip(
        Math.random() < 0.5 ? '迫不及待了~' : '准备柴火~',
        PoptipType.bottom
      );
    }
  }, [additionPrompts, presetPrompts]);

  const $animateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value
      },
      {
        translateX: translateX.value
      },
      {
        translateY: translateY.value + potTranslateY.value
      }
    ]
  }));

  const $potAniStyle = useAnimatedStyle(() => ({
    opacity: potOpacity.value
  }));

  const useDoublePot = useMemo(() => {
    return role2 && pageState === PageState.styleselect;
  }, [role2, pageState]);

  const useSinglePot = useMemo(() => {
    return !role2 && pageState === PageState.styleselect;
  }, [role2, pageState]);

  if (pageState === PageState.roleselect) {
    return null;
  }
  return (
    <Animated.View
      entering={FadeIn.duration(ANIMATE_TIME).delay(ANIMATE_TIME)}
      style={[{ position: 'absolute' }, $potStyle, $animateStyle]}
      // pointerEvents={pageState === PageState.styleselect ? 'auto' : 'none'}
    >
      <View>
        <Image
          source={SHADOW_IMAGE}
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            },
            pageState === PageState.styleselect && { tintColor: '#161e28' }
          ]}
        />
        <Image source={POT_IMAGE} style={{ width: '100%', height: '100%' }} />
        <Animated.View
          style={[
            { position: 'absolute', width: '100%', height: '100%' },
            $potAniStyle
          ]}
        >
          <Image
            source={POT_RED_IMAGE}
            style={{ width: '100%', height: '100%' }}
          />
        </Animated.View>

        <Poptip type={poptipType} visible={poptipVis} text={poptipText} />
        {useSinglePot ? (
          <Pressable
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              bottom: 0,
              zIndex: 999
            }}
            onPress={onPress}
          ></Pressable>
        ) : null}

        {useDoublePot ? (
          <>
            <Image
              source={POT_YUANYANG}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />

            <View style={[{ position: 'absolute' }, $maskLeftStyle]}>
              <FoodWithState
                width={$maskLeftStyle.width}
                height={$maskLeftStyle.height}
                type={FoodType.left}
              />
              {selectedRoleIndex === 0 && (
                <Image
                  source={MASK_LEFT}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </View>

            <View style={[{ position: 'absolute' }, $maskRightStyle]}>
              <FoodWithState
                width={$maskRightStyle.width}
                height={$maskRightStyle.height}
                type={FoodType.right}
              />
              {selectedRoleIndex === 1 && (
                <Image
                  source={MASK_RIGHT}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </View>

            <Pressable
              style={{
                width: '50%',
                height: '100%',
                position: 'absolute',
                bottom: 0,
                left: 0,
                zIndex: 999
              }}
              onPress={() => onSelectRole(0)}
            ></Pressable>

            <Pressable
              style={{
                width: '50%',
                height: '100%',
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: 999
              }}
              onPress={() => onSelectRole(1)}
            ></Pressable>
            {/* <Pressable
              onPress={() => onSelectRole(0)}
              style={[
                $pointStyle,
                selectedRoleIndex === 0 && $pointActive,
                $pointStyle1,
                { zIndex: 9999 }
              ]}
            >
              <Text
                style={[
                  $pointTextStyle,
                  selectedRoleIndex === 0 && $pointTextActiveStyle
                ]}
              >
                1
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onSelectRole(1)}
              style={[
                $pointStyle,
                selectedRoleIndex === 1 && $pointActive,
                $pointStyle2,
                { zIndex: 9999 }
              ]}
            >
              <Text
                style={[
                  $pointTextStyle,
                  selectedRoleIndex === 1 && $pointTextActiveStyle
                ]}
              >
                2
              </Text>
            </Pressable> */}
          </>
        ) : null}

        {useSinglePot ? (
          <View style={[{ position: 'absolute' }, $maskSingleStyle]}>
            {/* <Image
              source={MASK_SINGLE}
              style={{ width: '100%', height: '100%' }}
            /> */}
            <FoodWithState
              width={$maskSingleStyle.width}
              height={$maskSingleStyle.height}
              type={FoodType.full}
            />
          </View>
        ) : null}

        <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <LottieView
            source={source}
            ref={lottieRef}
            loop={false}
            onAnimationFinish={() => {
              lottieManagerRef.current?.changePlayStatus(PlayStatus.init);
              if (
                currentExp.current &&
                [ExpType.lookup, ExpType.surprise, ExpType.thinking].includes(
                  currentExp.current
                )
              ) {
                currentExp.current = undefined;
                requestAnimationFrame(expAnimation);
              }
            }}
          />
        </View>
      </View>
    </Animated.View>
  );

  function onPress() {
    useMakePhotoStoreV2.getState().changePageState(PageState.diy);
  }

  function expAnimation(timestamp: number) {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = timestamp;
    }
    const elapsed = timestamp - startTimeRef.current;

    if (
      currentExp.current &&
      [ExpType.surprise, ExpType.lookup, ExpType.thinking].includes(
        currentExp.current
      )
    ) {
      lottieManagerRef.current?.play(currentExp.current);
      currentExp.current = undefined;
      window.requestAnimationFrame(expAnimation);
    }
    if (elapsed < 5000) {
      window.requestAnimationFrame(expAnimation);
    } else {
      startTimeRef.current = timestamp;

      lottieManagerRef.current?.play(
        Math.random() < 0.5 ? ExpType.blink : ExpType.blink2
      );
      window.requestAnimationFrame(expAnimation);
    }
  }

  function showPoptip(text: string, type: PoptipType) {
    setPoptipText(text);
    setPoptipType(type);
    setPoptipVis(true);
  }

  function hidePoptip() {
    setPoptipVis(false);
  }

  function onSelectRole(type: number) {
    useMakePhotoStoreV2.getState().setRoleType(type);
    setTimeout(() => {
      useMakePhotoStoreV2.getState().changePageState(PageState.diy);
    }, 300);
  }
}
