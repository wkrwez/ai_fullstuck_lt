import LottieView from 'lottie-react-native';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { IconLoading } from '@Components/icons';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { Portal } from '@gorhom/portal';

const DEFAULT_FADE_DURATION = 150;

export const LOTTIE_LOADING = require('@Assets/lottie/loading.json');

export interface ILoadingModalProps {
  visible: boolean;
  onChangeVisible: (visible: boolean) => void;
  content: string | ReactNode;
}

export interface ILoadingProviderProps {}
export const LoadingSingleton = {
  showLoading: (text: ILoadingModalProps['content']) => {},
  hideLoading: () => {}
};

export const showLoading = (text: ILoadingModalProps['content'] = '') =>
  LoadingSingleton.showLoading(text);
export const hideLoading = () => LoadingSingleton.hideLoading();

export const Loading: FC<ILoadingModalProps> = props => {
  const { visible, content, onChangeVisible = () => {} } = props;

  const opacity = useSharedValue(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const LottiteRef = useRef<LottieView>(null);

  useEffect(() => {
    // visible 切换触发副作用时 LottiteRef 还未绑定
    setTimeout(() => {
      if (!visible) {
        LottiteRef.current?.pause();
      } else {
        LottiteRef.current?.play();
      }
    });
  }, [visible]);

  const $animateStyle = useAnimatedStyle(() => ({
    display: opacity.value === 0 ? 'none' : 'flex',
    opacity: opacity.value
  }));

  if (!visible) return null;

  return (
    <Portal>
      <View
        // entering={FadeOut.duration(300)}
        // exiting={FadeOut.duration(300)}
        style={[
          StyleSheet.absoluteFill,
          { zIndex: DEFAULT_SHEET_ZINDEX + 10 },
          $animateContainer
        ]}
      >
        <View style={$loadingContainer}>
          <LottieView
            ref={LottiteRef}
            loop={true}
            style={{ width: 50, height: 50 }}
            source={LOTTIE_LOADING}
          />
          {/* <IconLoading /> */}
          {/* <Text
          style={{
            fontSize: 12,
            marginLeft: 5,
            color: StyleSheet.currentColors.white
          }}
        >
          {content || ''}
        </Text> */}
        </View>
      </View>
    </Portal>
  );
};

export const LoadingGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<ILoadingModalProps['content']>('');
  useEffect(() => {
    const registerLoading = () => {
      LoadingSingleton.showLoading = text => {
        if (text) {
          setContent(text);
        } else {
          setContent('');
        }
        setVisible(true);
      };
      LoadingSingleton.hideLoading = () => {
        setVisible(false);
      };
    };
    registerLoading();
  }, []);
  return (
    <Loading content={content} visible={visible} onChangeVisible={setVisible} />
  );
};

const $loadingContainer = {
  ...StyleSheet.rowStyle
  // backgroundColor: StyleSheet.hex('#121212', 0.85),
  // borderRadius: 500,
  // paddingVertical: 8,
  // paddingHorizontal: 8
};

const $animateContainer: ViewStyle = {
  zIndex: DEFAULT_SHEET_ZINDEX + 10,
  // backgroundColor:'red',
  justifyContent: 'center',
  pointerEvents: 'none',
  alignItems: 'center'
};
