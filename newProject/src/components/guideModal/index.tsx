import * as FileSystem from 'expo-file-system';
import {
  FC,
  LegacyRef,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { captureRef } from 'react-native-view-shot';
import { DEFAULT_MODAL_ZINDEX, DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { useScreenSize } from '@/src/hooks';
import { colorsUI } from '@/src/theme';
import { catchErrorLog } from '@/src/utils/error-log';
import { Image } from '@Components/image';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { Portal } from '@gorhom/portal';

const DEFAULT_FADE_DURATION = 150;

export interface IGuideModalProps {
  eleRef: RefObject<View>;
  // render?: (ref: RefObject<View>, bound) => ReactNode;
  visible: boolean;
  onChangeVisible: (visible: boolean) => void;
}

export interface IGuideProviderProps {}
export const GuideSingleton = {
  showGuide: (ref: IGuideModalProps['eleRef']) => {},
  hideGuide: () => {}
};

export const showGuide = (ref: IGuideModalProps['eleRef']) =>
  GuideSingleton.showGuide(ref);
export const hideGuide = () => GuideSingleton.hideGuide();

export const Guide: FC<IGuideModalProps> = props => {
  const { visible, onChangeVisible = () => {} } = props;
  const [image, setImage] = useState('');
  const eleWidth = useSharedValue(0);
  const eleHeight = useSharedValue(0);
  const eleX = useSharedValue(0);
  const eleY = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;
    updateImage();
  }, [visible, props.eleRef]);

  const $animateElementStyle = useAnimatedStyle(() => ({
    width: eleWidth.value,
    height: eleHeight.value,
    top: eleY.value,
    left: eleX.value
  }));

  return (
    <Portal>
      <Animated.View
        entering={FadeIn.duration(DEFAULT_FADE_DURATION)}
        exiting={FadeOut.duration(DEFAULT_FADE_DURATION)}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: DEFAULT_SHEET_ZINDEX + 100,
            backgroundColor: 'rgba(0,0,0,0.7)'
          }
        ]}
      >
        <Animated.View style={[StyleSheet.absoluteFill, $animateElementStyle]}>
          <Image
            style={{
              width: '100%',
              height: '100%'
            }}
            source={image}
          ></Image>
        </Animated.View>
      </Animated.View>
    </Portal>
  );

  async function updateImage() {
    try {
      const { height, width, x, y } = await measureRef(props.eleRef);
      eleWidth.value = width;
      eleHeight.value = height;
      eleX.value = x;
      eleY.value = y;
      const uri = await captureRef(props.eleRef, {
        height,
        quality: 1
      });
      setImage(uri);
    } catch (e) {
      catchErrorLog('guide_image_error', e);
    }
  }

  function measureRef(
    ref: RefObject<View>
  ): Promise<{ x: number; y: number; width: number; height: number }> {
    return new Promise((resolve, reject) => {
      if (!ref.current) {
        catchErrorLog('guide_measure_error', { reason: '元素不存在' });
        return reject({ code: 1, reason: '元素不存在' });
      }
      ref.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          if (!width || !height) {
            catchErrorLog('guide_measure_error', {
              reason: '元素宽高获取不对'
            });
            return reject({ code: 1, reason: '元素宽高获取不对' });
          }
          resolve({
            x: pageX,
            y: pageY,
            width,
            height
          });
        }
      );
    });
  }
};

export const GuideModalGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(1000);
  const [ref, setRef] = useState<IGuideModalProps['eleRef']>();
  useEffect(() => {
    const registerGuide = () => {
      GuideSingleton.showGuide = content => {
        // if (content) {
        setVisible(true);
        setDuration(duration || 1000);
        console.log(111, content);
        setRef(content);
        // }
      };
      GuideSingleton.hideGuide = () => {
        setVisible(false);
        setRef(undefined);
      };
    };
    registerGuide();
  }, []);
  if (!ref) return;
  return <Guide eleRef={ref} visible={visible} onChangeVisible={setVisible} />;
};
