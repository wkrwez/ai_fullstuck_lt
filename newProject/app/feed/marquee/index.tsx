import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ImageStyle,
  PanResponder,
  Pressable,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { feedClient } from '@/src/api';
import { showToast } from '@/src/components';
import { Image } from '@/src/components';
import { usePanGestureStore } from '@/src/components/waterfall/states';
import IPCard from '@/src/gums/feed/ipcard';
import { useScreenSize } from '@/src/hooks';
import { useBrandStore } from '@/src/store/brand';
import { $flex, $flexCenter, $flexRow } from '@/src/theme/variable';
import { BrandInfo } from '@/src/types';
import { getMarqueeIPColor } from '@/src/utils/color';
import { reportClick } from '@/src/utils/report';
import { XUYUAN_CARD } from '../operate';
import { BrandState } from '@/proto-registry/src/web/raccoon/common/state_pb';
import { useIsFocused } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

interface IMarqueeProps {
  autoPlay?: boolean;
  duration?: number;
  miniScale?: boolean;
  size: number;
  onPress: (mini: boolean) => void;
}

const GAP = 8;

export default function Marquee({
  autoPlay = false,
  duration = 5000,
  size = 84,
  miniScale = false,
  onPress
}: IMarqueeProps) {
  // console.log("render Marquee")
  const isFocused = useIsFocused();
  const windowWidth = useScreenSize('screen').width;
  const singleCardWidth = size;
  const marqueeTimer = useRef<NodeJS.Timeout>();
  const maxLimit = 4;
  const [marqueeIndex, setMarqueeIndex] = useState(0);
  // 动画偏移值
  const offsetX = useSharedValue(0);
  // 最大 page 页

  // 余数 [补全 一页的数量，为了防止空档]
  const { brandInfos } = useBrandStore(
    useShallow(state => ({
      brandInfos: state.brandInfos
    }))
  );
  const maxPage = Math.ceil((brandInfos.length + 1) / maxLimit) || 1;

  useEffect(() => {
    if (!isFocused || miniScale) {
      setMarqueeIndex(0);
      marqueeTimer.current && clearInterval(marqueeTimer.current);
      marqueeTimer.current = undefined;
    } else {
      stopLoop();
    }
  }, [isFocused, miniScale]);

  useEffect(() => {
    // 自动翻页
    if (autoPlay && !miniScale && !marqueeTimer.current) {
      marqueeTimer.current = setInterval(() => {
        next(1);
      }, duration);
    }
    return () => stopLoop();
  }, [autoPlay, miniScale]);

  // 真实偏移 [兼容屏幕]
  const cardMargin = GAP;

  // 动画翻页的偏移
  useEffect(() => {
    if (marqueeIndex >= 0) {
      const shouldLeftOffset = -(windowWidth - cardMargin) * marqueeIndex;
      offsetX.value = withTiming(shouldLeftOffset);
    }
  }, [marqueeIndex]);

  const easeEffect = {
    duration: 250
  };
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (miniScale) {
      opacityValue.value = withTiming(0, easeEffect);
    } else {
      opacityValue.value = withTiming(1, easeEffect);
    }
  }, [miniScale]);

  const $marqueeAnimateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetX.value
        }
      ],
      opacity: opacityValue.value
    };
  });

  const [lastTouchTime, setLastTouchTime] = useState(Date.now());
  const gapTime = 3000;

  const next = (step: number = 1) => {
    setMarqueeIndex(marqueeIndex => {
      return (marqueeIndex + step + maxPage) % maxPage;
    });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return false;
    },
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      if (miniScale) return false;
      const threshold = 1; // Minimum swipe distance

      if (Math.abs(gestureState.dx) > threshold) {
        const step = gestureState.dx > 0 ? -1 : 1;
        if (step === 1 && marqueeIndex === maxPage - 1) return false;
        if (step === -1 && marqueeIndex === 0) return false;
        stopLoop();
        next(gestureState.dx > 0 ? -1 : 1);
        return true;
      } else {
        return false;
      }
    }
  });

  /**
   * 多长时间可以重新 loop
   * @returns
   */
  const stopLoop = () => {
    console.log('[marquee]stop loop', marqueeTimer.current);
    setLastTouchTime(Date.now());
    clearInterval(marqueeTimer.current);
    marqueeTimer.current = undefined;
    if (!marqueeTimer.current) {
      marqueeTimer.current = setInterval(() => {
        if (Date.now() - lastTouchTime > gapTime) {
          // 超过 gaptime 可以重新轮播
          next(1);
        }
      }, duration);
      return;
    }
  };
  const renderItems = miniScale ? brandInfos.slice(0, 4) : brandInfos;

  const enterDiffBrand = (brandInfo: BrandInfo) => {
    if (!miniScale) {
      if (brandInfo.state === BrandState.PENDING) {
        // 非预约态不 toast
        if (!brandInfo.reserved) return;
        if (brandInfo.publishDate) {
          showToast(brandInfo.displayName + '未上线');
        } else {
          showToast(brandInfo.displayName + '敬请期待');
        }
        return;
      }
      reportClick('ip_entry', {
        IPname: brandInfo.displayName
      });
      router.push(`/ip/${brandInfo.brand}`);
    } else onPress(false);
  };

  const enterWishBrand = () => {
    return router.push('/wishcard/');
  };

  const updateBrandInfo = () => {
    useBrandStore.getState().syncBrandInfos();
  };

  return (
    <View
      style={[$flex, { marginLeft: cardMargin }]}
      {...panResponder.panHandlers}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        <Animated.View
          id="marquee"
          style={[
            $marqueeLayer,
            { height: singleCardWidth },
            $marqueeAnimateStyle
          ]}
        >
          <View style={[$flex, $flexRow, { alignItems: 'flex-end' }]}>
            {renderItems.map((brandInfo, mIndex) => {
              const isHot = brandInfo.hot; // 是否热门
              const isReserve = brandInfo.reserved; // 是否预约
              const hasTime = brandInfo.publishDate; // 日期
              const ipStatus = brandInfo.state; // IP 状态
              const isNew = brandInfo.isNew; // 是否上新
              const bgColor = getMarqueeIPColor(brandInfo.bgColor || '#19321C');
              const brandId = brandInfo.brand;
              //   const bgColor = brandInfo.bgColor || '#19321C';
              return (
                <Animated.View
                  key={mIndex}
                  style={{
                    width: singleCardWidth,
                    marginRight: cardMargin
                  }}
                >
                  <IPCard
                    onPress={() => enterDiffBrand(brandInfo)}
                    reserveSuccessCb={() => updateBrandInfo()}
                    size={singleCardWidth}
                    cardText={brandInfo.displayName}
                    bgColor={bgColor}
                    url={brandInfo.iconUrl}
                    isHot={isHot}
                    isReserve={isReserve}
                    hasTime={hasTime}
                    ipStatus={ipStatus}
                    brandId={brandId}
                    isNew={isNew}
                    // TODO， FIXIT
                    isSpecial={brandInfo.displayName === '甄嬛传'}
                  ></IPCard>
                </Animated.View>
              );
            })}
            {/* IP CARD 直接写死 */}
            <Pressable onPress={() => enterWishBrand()} style={[$flex]}>
              <Image
                transition={0}
                source={XUYUAN_CARD.iconUrl}
                tosSize="size4"
                contentFit="fill"
                style={[
                  { height: singleCardWidth / 1.04, width: singleCardWidth }
                ]}
              ></Image>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const $marqueeLayer: ViewStyle = {
  overflow: 'hidden'
};
