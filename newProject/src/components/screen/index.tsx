import { router } from 'expo-router';
import { StatusBar, StatusBarProps } from 'expo-status-bar';
import React, {
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactNode,
  RefAttributes,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ColorValue,
  ImageStyle,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import {
  ExtendedEdge,
  useSafeAreaInsetsStyle
} from '@/src/hooks/useSafeAreaInsetsStyle';
import { colors, spacing } from '@/src/theme';
import { EmptyPlaceHolder } from '@Components/Empty';
import { Icon, IconProps } from '@Components/icons';
import { Text } from '@Components/text';
import { SkeletonLoader } from '../SkeletonLoader';
import { ScrollViewRef } from '@/app/detail/[id]';

interface BaseScreenProps {
  /**
   * Children components.
   */
  children?: React.ReactNode;
  /**
   * Style for the outer content container useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  screenStyle?: StyleProp<ViewStyle>;
  title?: string;
  headerLeft?: () => ReactNode;
  headerRight?: () => ReactNode;
  headerTitle?: () => ReactNode;
  headerShown?: boolean;
  backButton?: boolean | ReactNode;
  loading?: boolean;
  /**
   * Style for the inner content container useful for padding & margin.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[];
  /**
   * Background color
   */
  backgroundView?: ReactNode;
  /**
   * By how much should we offset the keyboard? Defaults to 0.
   */
  keyboardOffset?: number;
  /**
   * Pass any additional props directly to the StatusBar component.
   */
  StatusBarProps?: StatusBarProps;
  /**
   * Pass any additional props directly to the KeyboardAvoidingView component.
   */
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps;

  onBack?: () => void;
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed';
}
interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll';
  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  /**
   * Pass any additional props directly to the ScrollView component.
   */
  ScrollViewProps?: ScrollViewProps;
  ScrollViewComp?: ForwardRefExoticComponent<
    ScrollViewProps & RefAttributes<ScrollView>
  >;
}

interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto';
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: { percent?: number; point?: number };
}

interface ThemeColors {
  textColor: ColorValue;
}

export type ScreenProps = (
  | ScrollScreenProps
  | FixedScreenProps
  | AutoScreenProps
) & {
  scrollViewRef?: MutableRefObject<ScrollViewRef>;
  theme?: 'light' | 'dark';
  titleStyle?: ViewStyle
};

const isIos = Platform.OS === 'ios';

function isNonScrolling(preset?: ScreenProps['preset']) {
  return !preset || preset === 'fixed';
}

function useAutoPreset(props: AutoScreenProps) {
  const { preset, scrollEnabledToggleThreshold } = props;
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {};

  const scrollViewHeight = useRef<number | null>(null);
  const scrollViewContentHeight = useRef<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  function updateScrollState() {
    if (
      scrollViewHeight.current === null ||
      scrollViewContentHeight.current === null
    )
      return;

    // check whether content fits the screen then toggle scroll state according to it
    const contentFitsScreen = (function () {
      if (point) {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current - point
        );
      } else {
        return (
          scrollViewContentHeight.current < scrollViewHeight.current * percent
        );
      }
    })();

    // content is less than the size of the screen, so we can disable scrolling
    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false);

    // content is greater than the size of the screen, so let's enable scrolling
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true);
  }

  function onContentSizeChange(w: number, h: number) {
    // update scroll-view content height
    scrollViewContentHeight.current = h;
    updateScrollState();
  }

  function onLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    // update scroll-view  height
    scrollViewHeight.current = height;
    updateScrollState();
  }

  // update scroll state on every render
  if (preset === 'auto') updateScrollState();

  return {
    scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout
  };
}

function ScreenWithoutScrolling(props: ScreenProps) {
  const { style, contentContainerStyle, children } = props;

  return (
    <View style={[$outerStyle, style]}>
      <View style={[$innerStyle, contentContainerStyle]}>{children}</View>
    </View>
  );
}

const ScreenWithScrolling = forwardRef(
  (props: ScreenProps, ref: React.ForwardedRef<ScrollViewRef>) => {
    const {
      children,
      keyboardShouldPersistTaps = 'handled',
      contentContainerStyle,
      ScrollViewProps,
      style,
      ScrollViewComp = ScrollView
    } = props as ScrollScreenProps;

    const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(
      props as AutoScreenProps
    );

    // const ref = useRef<ScrollView>(null);

    // // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
    // useScrollToTop(ref);
    const scrollViewRef = useRef<ScrollView>(null);
    useImperativeHandle(ref, () => ({
      get() {
        return scrollViewRef.current as ScrollView;
      }
    }));

    return (
      <ScrollViewComp
        ref={scrollViewRef}
        {...{ keyboardShouldPersistTaps, scrollEnabled }}
        {...ScrollViewProps}
        onLayout={e => {
          onLayout(e);
          ScrollViewProps?.onLayout?.(e);
        }}
        onContentSizeChange={(w: number, h: number) => {
          onContentSizeChange(w, h);
          ScrollViewProps?.onContentSizeChange?.(w, h);
        }}
        style={[$outerStyle, ScrollViewProps?.style, style]}
        contentContainerStyle={[
          $innerStyle,
          ScrollViewProps?.contentContainerStyle,
          contentContainerStyle
        ]}
      >
        {children}
      </ScrollViewComp>
    );
  }
);

export function Screen(props: ScreenProps) {
  const {
    KeyboardAvoidingViewProps,
    keyboardOffset = 0,
    safeAreaEdges = ['top', 'bottom'],
    StatusBarProps,
    headerShown = true,
    backgroundView,
    backButton = true,
    screenStyle: $screenStyleOverride,
    theme = 'light',
    headerStyle
  } = props;

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges);

  const themeColors = useMemo<ThemeColors>(() => {
    return theme === 'light'
      ? {
          textColor: colors.black
        }
      : {
          textColor: colors.white
        };
  }, [theme]);

  return (
    <>
      <View style={[$containerStyle]}>
        {backgroundView}
        <View
          style={[
            { position: 'relative', flex: 1, overflow: 'hidden' },
            $containerInsets,
            $screenStyleOverride
          ]}
        >
          <StatusBar
            style={theme === 'light' ? 'dark' : 'light'}
            {...StatusBarProps}
          />
          {headerShown ? <Header {...props} themeColors={themeColors} /> : null}

          <KeyboardAvoidingView
            behavior={isIos ? 'padding' : undefined}
            keyboardVerticalOffset={keyboardOffset}
            {...KeyboardAvoidingViewProps}
            style={[{ flex: 1 }, KeyboardAvoidingViewProps?.style]}
          >
            {renderBody(props)}
          </KeyboardAvoidingView>
        </View>
      </View>
    </>
  );
}

export const TabScreen = (props: ScreenProps) => {
  return Screen({
    // Tab默认移除返回按钮
    headerLeft: () => <></>,
    headerRight: () => <></>,
    safeAreaEdges: ['top'],
    ...props
  });
};

const renderBody = (props: ScreenProps) => {
  // 统一处理 Screen 级别 Loading
  //   if (props.loading)
  //     return (
  //       <View style={$loadingStyle}>
  //         <Image
  //           style={{ width: 132, resizeMode: 'contain', opacity: 0.5 }}
  //           source={require('@Assets/images/logo_text.png')}
  //         />
  //       </View>
  //     );
  return isNonScrolling(props.preset) ? (
    <ScreenWithoutScrolling {...props} />
  ) : (
    <ScreenWithScrolling {...props} ref={props.scrollViewRef} />
  );
};

export const IconBack = (props: Omit<IconProps, 'icon'>) => {
  return (
    <TouchableOpacity
      hitSlop={8}
      style={{ paddingRight: spacing.xs }}
      onPress={e => {
        if (props.onPress) {
          props.onPress(e);
        } else if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/feed/');
        }
      }}
    >
      <Icon icon="back" size={24} {...props} />
    </TouchableOpacity>
  );
};

export const Header = (props: ScreenProps & { themeColors: ThemeColors }) => {
  const {
    title,
    headerLeft,
    headerRight,
    headerTitle,
    backButton = true,
    themeColors,
    headerStyle: $headerStyleOverride,
    titleStyle: $titleContainer
  } = props;
  const hasHeaderLeft = !!(headerLeft || backButton);

  const renderBackBtn = () => {
    if (backButton === false) return <></>;
    if (backButton === true)
      return <IconBack color={themeColors.textColor} onPress={props.onBack} />;
    return backButton;
  };

  console.log(headerLeft, 'headerLeftheaderLeft');

  const renderHeaderLeft = () => {
    return headerLeft ? (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {renderBackBtn()}
        {headerLeft()}
      </View>
    ) : (
      renderBackBtn()
    );
  };

  const hasTitle = Boolean(title || headerTitle);

  // 检查 route.state 属性以确定所在的导航器类型
  return (
    // fix it : zIndex hardcode
    <View style={[$headerStyle, $headerStyleOverride]}>
      {hasHeaderLeft ? (
        <View style={[{ zIndex: 1, flex: 1, flexBasis: 0 }]}>
          {renderHeaderLeft()}
        </View>
      ) : (
        <View style={[{ width: 36, flex: 1, flexBasis: 0 }]} />
      )}
      {hasTitle ? (
        <View style={[$headerTitleStyle, { flex: 1, flexBasis: 0 }, $titleContainer]}>
          {headerTitle ? (
            headerTitle()
          ) : (
            <Text
              preset="bold"
              size="md"
              numberOfLines={1}
              style={{ color: themeColors.textColor }}
            >
              {title}
            </Text>
          )}
        </View>
      ) : null}
      {/* fix placeholder */}
      {headerRight || hasTitle ? (
        <View
          style={{
            flex: 1,
            flexBasis: 0,
            alignItems: 'flex-end'
          }}
        >
          {headerRight?.() || (
            <View
              style={{
                width: 36,
                height: '100%'
              }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
};

const $containerStyle: ViewStyle = {
  // backgroundColor: '#bbb',
  // backgroundColor: colors.white,
  flex: 1,
  height: '100%',
  overflow: 'hidden'
};

const $headerStyle: ViewStyle = {
  height: 54,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderBottomColor: 'rgba(210,210,210,1)',
  backgroundColor: 'transparent'
};

const $headerTitleStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center'
};

const $outerStyle: ViewStyle = {
  flex: 1,
  height: '100%',
  width: '100%'
};

const $innerStyle: ViewStyle = {
  width: '100%', // fix it later: hard coding
  height: '100%',
  alignItems: 'stretch'
};
