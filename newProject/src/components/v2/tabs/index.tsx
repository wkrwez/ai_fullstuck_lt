import { router } from 'expo-router';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageStyle,
  LayoutChangeEvent,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  TouchableOpacity
} from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';
import Animated, {
  GestureHandlerEvent,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { useScreenSize } from '@/src/hooks';
import { typography } from '@/src/theme';
import {
  $SEARCH_COLORS,
  $USE_FONT,
  $Z_INDEXES,
  $flex,
  $flexCenter,
  $flexRow,
  $relative
} from '@/src/theme/variable';
import { getScreenSize } from '@/src/utils';
import { Image } from '@Components/image/index';

// const HighlightIcon = require('@Assets/image/search/search-tab-underline.png');
const HighlightIcon = require('@Assets/image/feed/tab_highlight.png');

export interface IIinitialStateItemType {
  key: string | number;
  title: string;
}

interface ITabProps {
  activeIndex: number;
  tabNames: IIinitialStateItemType[];
  renderScene: (item: IIinitialStateItemType) => ReactNode;
  renderExtraView?: ReactNode;
  onIndexChange: (index: number) => void;
  tabHeaderArrange?: ETabHeaderArrange;
  $tabActiveTextStyle?: TextStyle;
  $tabNormalTextStyle?: TextStyle;
  gap?: number;
  underNode?: ReactNode;
  underNodeWidth: number; // 计算高亮 icon 居中使用
  underNodeHeight: number;
  $underNodeStyle?: ImageStyle;
}

export enum ETabHeaderArrange {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right'
}

const TabHeaderArrange = {
  [ETabHeaderArrange.LEFT]: 'flex-start',
  [ETabHeaderArrange.CENTER]: 'center',
  [ETabHeaderArrange.RIGHT]: 'flex-end'
};

const defaultWindowWidth = getScreenSize('width');

export default function Tabs({
  activeIndex,
  tabNames,
  renderScene,
  renderExtraView = <></>,
  onIndexChange,
  tabHeaderArrange = ETabHeaderArrange.CENTER,
  $tabActiveTextStyle = {},
  $tabNormalTextStyle = {},
  gap = 30,
  underNode,
  underNodeWidth = 46,
  underNodeHeight = 33,
  $underNodeStyle = {}
}: ITabProps) {
  // tab switch params
  const translateX = useSharedValue(0);

  const $animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  useEffect(() => {
    // click tab switch
    translateX.value = withTiming(-activeIndex * defaultWindowWidth, {
      duration: 200
    });
  }, [activeIndex]);

  const [tabMeasures, setTabMeasures] = useState<Record<string, number>>({});

  const computeCumulativeValues = (
    obj: Record<string, number>,
    activeIndex: number
  ) => {
    let cumulative = 0;

    for (let i = 0; i <= activeIndex; i++) {
      if (obj.hasOwnProperty(i)) {
        cumulative += obj[i];
      }
    }

    return cumulative;
  };

  const getRenderWidth = (e: LayoutChangeEvent, index: number) => {
    const width = e.nativeEvent.layout.width;
    setTabMeasures(m => {
      return {
        ...m,
        [index]: width
      };
    });
  };

  const indicatorOffsetX = useSharedValue(0);

  useEffect(() => {
    const extraOffset =
      tabMeasures[activeIndex] >= underNodeWidth
        ? (tabMeasures[activeIndex] - underNodeWidth) / 2
        : 0;
    indicatorOffsetX.value = withTiming(
      activeIndex * gap +
        extraOffset +
        computeCumulativeValues(tabMeasures, activeIndex - 1),
      {
        duration: 300
      }
    );
  }, [activeIndex]);

  const $indicatorOffsetX = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: indicatorOffsetX.value
      }
    ]
  }));

  const pageRef = useRef<PagerView>(null);

  const { width: screenWidth, height: screenHeight } = useScreenSize('window');
  const [touchOffsetX, setTouchOffsetX] = useState(screenWidth);
  const [isBack, setIsBack] = useState(false);

  const pageScroll = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      if (e.nativeEvent.position < 0 && touchOffsetX < 100) {
        setIsBack(true);
      }
    },
    [touchOffsetX]
  );

  useEffect(() => {
    isBack && router.back();
  }, [isBack]);

  return (
    <View style={[$flex, $relative]}>
      <View
        style={[
          $flexRow,
          $flexCenter,
          {
            height: 40
          },
          {
            justifyContent: TabHeaderArrange[tabHeaderArrange]
          } as ViewStyle,
          {
            marginVertical: 0,
            marginHorizontal: 20,
            zIndex: $Z_INDEXES.z1
          }
        ]}
      >
        {tabNames.map((item: IIinitialStateItemType, i: number) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={i}
            onPress={() => {
              pageRef.current?.setPage(i);
              onIndexChange(i);
            }}
            style={$tab}
          >
            <Text
              numberOfLines={1}
              onLayout={e => getRenderWidth(e, i)}
              style={[
                $tabText,
                activeIndex === i
                  ? { ...$activeTabText, ...$tabActiveTextStyle }
                  : { ...$inactiveTabText, ...$tabNormalTextStyle }
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={[
            $indicatorOffsetX,
            {
              width: '100%',
              height: underNodeHeight,
              position: 'absolute',
              zIndex: $Z_INDEXES.zm1,
              bottom: 0,
              left: 0
            }
          ]}
        >
          <Image
            source={underNode ? underNode : HighlightIcon}
            style={[
              $flex as ImageStyle,
              $indicator as ImageStyle,
              $underNodeStyle
            ]}
            contentFit="fill"
          ></Image>
        </Animated.View>
      </View>
      <PagerView
        style={[$contentContainer]}
        ref={pageRef}
        onPageSelected={e => {
          onIndexChange(e.nativeEvent.position);
        }}
        overdrag
        onTouchStart={e => {
          setTouchOffsetX(e.nativeEvent.pageX);
        }}
        onPageScroll={pageScroll}
      >
        {tabNames.map((item: IIinitialStateItemType, i: number) => (
          <View key={i} style={[$scene]}>
            {renderScene(item)}
            {renderExtraView}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const $tab: ViewStyle = {
  ...$flexRow,
  ...$flexCenter,
  marginRight: 30,
  height: 50
};

const $tabText: TextStyle = {
  fontSize: 16,
  textAlign: 'center'
};

const $activeTabText: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black,
    typography.fonts.pingfangSC.normal,
    15,
    'normal',
    '500',
    22
  )
};

const $inactiveTabText: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black_54,
    typography.fonts.pingfangSC.normal,
    15,
    'normal',
    '400',
    22
  )
};

const $indicator: TextStyle = {
  bottom: -20,
  left: -8,
  height: 33,
  width: 46,
  zIndex: $Z_INDEXES.zm1
};

const $contentContainer: TextStyle = {
  flex: 1,
  flexDirection: 'row',
  zIndex: $Z_INDEXES.z1
};

const $scene: TextStyle = {
  flex: 1,
  marginTop: 6,
  flexBasis: '100%'
};
