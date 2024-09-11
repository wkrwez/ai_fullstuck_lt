import { useThrottleFn } from 'ahooks';
import { BlurView } from 'expo-blur';
import { useEffect, useMemo, useState } from 'react';
import {
  ImageStyle,
  Pressable,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SubscribeBrandClient } from '@/src/api/subscribe';
import { Image, showToast } from '@/src/components';
import Notification from '@/src/components/v2/notification';
import useNotification from '@/src/components/v2/notification/hook';
import { IP_IMAGE_FRONT, LOGIN_SCENE } from '@/src/constants';
import { useAuthState } from '@/src/hooks';
import { EnotiType } from '@/src/store/storage';
import { typography } from '@/src/theme';
import { $Z_INDEXES, $flex } from '@/src/theme/variable';
import { PublishDate } from '@/src/types';
import { lightenIPReserveColor } from '@/src/utils/color';
import { Text } from '@Components/text';
import { usePanGestureStore } from '@/app/feed/states';
import { BrandState } from '@/proto-registry/src/web/raccoon/common/state_pb';

interface ICardProps {
  cardText: string;
  bgColor: string;
  isHot: boolean;
  isReserve?: boolean;
  hasTime?: PublishDate;
  ipStatus?: BrandState;
  brandId?: number;
  isNew?: boolean;
  url: string;
  isSpecial?: boolean;
  size: number;
  onPress?: () => void;
  reserveSuccessCb?: () => void;
}

interface ConfigType {
  width: number;
  imgWidth: number;
  imgHeight: number;
}

const FontZhenHuanIcon = require('@Assets/image/feed/font_zhenhuan.png');

export default function IPCard({
  size,
  cardText,
  bgColor,
  url,
  isHot,
  isReserve,
  hasTime,
  ipStatus,
  brandId,
  isNew,
  isSpecial,
  onPress,
  reserveSuccessCb
}: ICardProps) {
  const radioWdithValue = useSharedValue(size);

  const imgWidth = size - 24;

  const ratioConfig: ConfigType = useMemo(() => {
    return {
      width: size,
      imgWidth,
      imgHeight: imgWidth
    };
  }, []);

  const slideTop = usePanGestureStore(state => state.slideTop);

  const opacityValue = useSharedValue(0);
  const reserveOpacityValue = useSharedValue(1);
  const miniScaleHeightValue1 = useSharedValue(radioWdithValue.value);
  const miniScaleHeightValue2 = useSharedValue(ratioConfig.imgHeight);
  const miniScaleWidthValue1 = useSharedValue(ratioConfig.imgWidth);

  //   const frontColor = lightenColor(bgColor || '#19321C', 0.3);

  /** 预约 IP */
  const { notificationVisible, setNotificationVisible, setInitLock } =
    useNotification({
      expire: 7,
      signal: EnotiType.notiReachDatedBySubscribe,
      lock: true
    });

  const onCloseNotification = () => {
    setInitLock(true);
    setNotificationVisible(false);
  };

  const easeEffect = {
    duration: 250
  };

  const easeReserveEffect = {
    duration: 800,
    easing: Easing.ease
  };

  useEffect(() => {
    if (slideTop) {
      // miniScaleHeightValue1.value = withTiming(
      //   ratioConfig.width - 6,
      //   easeEffect
      // );
      miniScaleHeightValue2.value = withTiming(
        ratioConfig.imgHeight + 12,
        easeEffect
      );
      miniScaleWidthValue1.value = withTiming(
        ratioConfig.imgWidth + 12,
        easeEffect
      );
    } else {
      miniScaleHeightValue1.value = withTiming(ratioConfig.width, easeEffect);
      miniScaleHeightValue2.value = withTiming(
        ratioConfig.imgHeight,
        easeEffect
      );
      miniScaleWidthValue1.value = withTiming(ratioConfig.imgWidth, easeEffect);
    }
  }, [slideTop]);

  useEffect(() => {
    if (slideTop) {
      opacityValue.value = withTiming(0, easeEffect);
    } else {
      opacityValue.value = withTiming(1, easeEffect);
    }
  }, [slideTop]);

  const scaleAnimateStyle = useAnimatedStyle(() => {
    return {
      width: radioWdithValue.value,
      height: miniScaleHeightValue1.value
    };
  });

  const scaleImgAnimateStyle = useAnimatedStyle(() => {
    return {
      width: miniScaleWidthValue1.value,
      height: miniScaleHeightValue2.value
    };
  });

  const opacityAnimateStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityValue.value,
      height: 18 * opacityValue.value
    };
  });

  const reserveAnimateStyle = useAnimatedStyle(() => {
    return {
      opacity: reserveOpacityValue.value
    };
  });

  const font = typography.fonts.ip;
  const wishFont = typography.fonts.wishcard;

  const [hasClickReserved, setHasClickReserved] = useState(false);
  const { loginIntercept } = useAuthState();

  const clickReserve = async () => {
    // TODO: 点击预约动画 && isLogin check
    loginIntercept(
      async () => {
        // 强通知逻辑
        setInitLock(false);

        showToast('预约成功');
        setHasClickReserved(true);
        setTimeout(() => {
          reserveOpacityValue.value = withTiming(0, easeReserveEffect);
        }, 500);

        try {
          const brandRes = await SubscribeBrandClient.subscribeBrand({
            brand: brandId
          });
          // update 预约信息
          reserveSuccessCb?.();
        } catch (error) {
          console.log(error, 'get brand error ===');
        }
      },
      { scene: LOGIN_SCENE.RESERVE }
    );
  };

  const { run: throttleFn } = useThrottleFn(clickReserve, {
    wait: 500
  });

  return (
    <Pressable
      onPress={onPress}
      style={[
        $flex,
        {
          height: 92
        }
      ]}
    >
      <Image
        source={IP_IMAGE_FRONT}
        transition={0}
        tintColor={
          ipStatus === BrandState.PENDING && !(isReserve || hasClickReserved)
            ? lightenIPReserveColor(bgColor)
            : bgColor
        }
        style={[
          $trapezoid as ImageStyle,
          {
            zIndex: -1,
            width: ratioConfig.width,
            height: ratioConfig.width * 0.81
          }
        ]}
      />
      <Animated.View style={[$ipcard, scaleAnimateStyle]}>
        {ipStatus === BrandState.PENDING ? (
          <View
            style={
              isReserve || hasClickReserved
                ? [$isReserve, $hasReserve]
                : [$isReserve]
            }
          >
            <Text
              style={[
                $reserveText,
                {
                  fontFamily: wishFont
                }
              ]}
            >
              {hasTime
                ? `${hasTime.month + '.' + hasTime.day}上线`
                : '敬请期待'}
            </Text>
          </View>
        ) : null}
        {isHot || isNew ? (
          <View style={$hotOrNew}>
            <Text
              style={[
                $hotOrNewText,
                {
                  fontFamily: wishFont
                }
              ]}
            >
              {isHot ? `Hot` : 'New'}
            </Text>
          </View>
        ) : null}
        <Animated.View style={scaleImgAnimateStyle}>
          <Image
            transition={0}
            source={url}
            tosSize="size4"
            contentFit="fill"
            style={{
              flex: 1
            }}
          ></Image>
        </Animated.View>
        {!slideTop && ipStatus === BrandState.PENDING ? (
          <Animated.View
            style={[
              $reserverBtnStyle,
              reserveAnimateStyle,
              {
                borderWidth: isReserve ? 0 : 0.5
              }
            ]}
          >
            {!isReserve ? (
              <Pressable onTouchStart={throttleFn}>
                <BlurView
                  style={[
                    $blurStyle,
                    {
                      backgroundColor: hasClickReserved
                        ? 'rgba(255, 255, 255, .25)'
                        : 'rgba(0, 0 ,0 ,.25)'
                    }
                  ]}
                  intensity={hasClickReserved ? 10 : 30}
                >
                  <Text style={$blurTextStyle}>
                    {!hasClickReserved ? '预约' : '已预约'}
                  </Text>
                </BlurView>
              </Pressable>
            ) : null}
          </Animated.View>
        ) : null}
        <Animated.View style={opacityAnimateStyle}>
          {isSpecial ? (
            <Image
              transition={0}
              source={FontZhenHuanIcon}
              style={$ipTextIcon}
            ></Image>
          ) : (
            <Text style={[$ipText, { fontFamily: font }]}>{cardText}</Text>
          )}
        </Animated.View>
      </Animated.View>
      <Notification
        visible={notificationVisible}
        onClose={onCloseNotification}
        slogan={'开启 App 通知，小狸会及时通知你作品上新'}
        signal={EnotiType.notiReachDatedBySubscribe}
      />
    </Pressable>
  );
}

const $ipcard: ViewStyle = {
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  justifyContent: 'flex-end',
  marginBottom: 8,
  zIndex: $Z_INDEXES.z10
};

const $isReserve: ViewStyle = {
  position: 'absolute',
  minWidth: 30,
  right: 0,
  top: 12,
  zIndex: 2,
  backgroundColor: '#BCC4CB',
  borderTopLeftRadius: 6,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 8,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 2,
  paddingHorizontal: 6
};

const $hotOrNew: ViewStyle = {
  position: 'absolute',
  minWidth: 30,
  right: 0,
  top: 12,
  zIndex: 2,
  backgroundColor: '#FF5732',
  borderTopLeftRadius: 6,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 8,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 2,
  paddingHorizontal: 6
};

const $hasReserve: ViewStyle = {
  backgroundColor: '#329DFF'
};

const $hotOrNewText: TextStyle = {
  fontSize: 10,
  color: '#fff',
  letterSpacing: 0.5,
  lineHeight: 12
};

const $reserveText: TextStyle = {
  fontSize: 10,
  color: '#fff',
  letterSpacing: 0.5,
  lineHeight: 12
};

const $trapezoid: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: -1
};

const $ipText: TextStyle = {
  fontSize: 13,
  lineHeight: 19,
  marginTop: 2,
  color: '#fff'
};

const $ipTextIcon: ImageStyle = {
  marginTop: 3,
  height: 14,
  width: 42
};

const $reserverBtnStyle: ViewStyle = {
  position: 'absolute',
  flex: 1,
  width: 56,
  borderWidth: 0.5,
  borderColor: 'rgba(255, 255, 255, 0.4)',
  overflow: 'hidden',
  borderRadius: 100,
  transform: [
    {
      translateY: -16
    }
  ]
};

const $blurStyle: ViewStyle = {
  flex: 1,
  paddingHorizontal: 6,
  paddingVertical: 4
};

const $blurTextStyle: TextStyle = {
  fontSize: 10,
  color: '#fff',
  textAlign: 'center',
  fontWeight: '600',
  fontFamily: typography.fonts.pingfangSC.normal
};
