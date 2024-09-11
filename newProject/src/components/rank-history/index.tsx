import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ImageStyle,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pointsClient } from '@/src/api/points';
import { useScreenSize } from '@/src/hooks';
import { useCreditStore } from '@/src/store/credit';
import { typography } from '@/src/theme';
import { $Z_INDEXES, $flex, $flexCenter } from '@/src/theme/variable';
import { dp2px } from '@/src/utils';
import { Image } from '@Components/image';
import RecordTab from './record-tab';
import TaskTab from './task-tab';

const TRAPEZOID = require('@Assets/image/credit/trapezoid.png');
const ACTIVE = require('@Assets/image/credit/active.png');
const CREDIT_MASK = require('@Assets/image/credit/credit-mask.png');

enum ECreditHeaderTab {
  CREDIT_RECORD = 'record',
  CREDIT_TASK = 'task'
}

export default function RankHistory() {
  const headerTabs = [
    {
      key: ECreditHeaderTab.CREDIT_TASK,
      title: '马上充电'
    },
    {
      key: ECreditHeaderTab.CREDIT_RECORD,
      title: '电池记录'
    }
  ];

  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    useCreditStore.getState().syncCredits();
  }, []);

  const halfWidth = dp2px(171);
  let initOffset = dp2px(-36);

  const [tabWidth, setTabWidth] = useState(halfWidth);

  const { top, bottom } = useSafeAreaInsets();
  const screenHeight = useScreenSize('screen').height;

  const maxListHeight = screenHeight - top - (bottom || 30) - dp2px(190);

  const zoidOffsetXValue = useSharedValue(0);
  const zoidLeftRadiusValue = useSharedValue(0);
  const zoidRightRadiusValue = useSharedValue(0);

  const changeTab = (tabIndex: number) => {
    const offset = tabIndex ? initOffset : initOffset;
    setCurrentTab(tabIndex);
    zoidOffsetXValue.value = withTiming(
      tabIndex * (tabWidth + dp2px(18)) + offset,
      {
        duration: 300
      }
    );
    zoidLeftRadiusValue.value = withTiming(tabIndex ? 10 : 0, {
      duration: 300
    });
    zoidRightRadiusValue.value = withTiming(tabIndex ? 0 : 10, {
      duration: 300
    });
  };

  useEffect(() => {
    changeTab(0);
  }, []);

  const $zoidAnimateStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: zoidOffsetXValue.value
      }
    ]
  }));

  const $zoidRadiusAnimateStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: zoidLeftRadiusValue.value,
    borderTopRightRadius: zoidRightRadiusValue.value
  }));

  const renderTabScene = (tabIndex: number) => {
    switch (headerTabs[tabIndex].key) {
      case ECreditHeaderTab.CREDIT_RECORD: {
        return (
          <RecordTab currentTab={tabIndex} maxListHeight={maxListHeight} />
        );
      }
      case ECreditHeaderTab.CREDIT_TASK: {
        return <TaskTab currentTab={tabIndex} maxListHeight={maxListHeight} />;
      }
    }
  };

  return (
    <View
      style={[
        $recordList,
        {
          minHeight: maxListHeight
        }
      ]}
    >
      <LinearGradient
        colors={['#424242', '#222']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={$gradient}
      >
        <View style={$innerWrapper}>
          <View style={$head}>
            <View style={$headTabs}>
              {headerTabs.map((ht, htIndex) => {
                const isActive = currentTab === htIndex;
                return (
                  <TouchableOpacity
                    style={[$tab]}
                    onPress={() => changeTab(htIndex)}
                    activeOpacity={1}
                  >
                    <View
                      style={[
                        $flexCenter,
                        {
                          width: '100%',
                          height: '100%'
                        }
                      ]}
                      key={htIndex}
                    >
                      <Text
                        style={[
                          $tabName,
                          {
                            color: isActive ? '#fff' : '#ffffff4d'
                          }
                        ]}
                      >
                        {ht.title}
                      </Text>
                      <Image
                        style={isActive ? $activeBar : $bar}
                        source={ACTIVE}
                        contentFit="fill"
                      ></Image>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Animated.View
              style={[$headTrapezoid, $zoidAnimateStyle]}
              key={'zoid'}
            >
              <Image
                style={[$flex as ImageStyle]}
                source={TRAPEZOID}
                contentFit="fill"
              ></Image>
            </Animated.View>
          </View>
          <Animated.View
            style={[
              $list,
              {
                transform: [
                  {
                    translateY: -3
                  }
                ],
                marginBottom: -3,
                height: maxListHeight
              },
              $zoidRadiusAnimateStyle
            ]}
          >
            <LinearGradient
              colors={['#34343400', '#222']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={$gradientList}
            >
              <Image
                style={{
                  position: 'absolute',
                  top: 0,
                  height: 24,
                  width: '100%',
                  zIndex: $Z_INDEXES.z10
                }}
                contentFit="fill"
                source={CREDIT_MASK}
              ></Image>

              {currentTab === 0 && (
                <View style={$taskFooter}>
                  <Text style={$taskFooterText}>
                    充电奖励每日刷新，刷新后任务进度和狸电池上限都会重置哦～
                  </Text>
                </View>
              )}
              {renderTabScene(currentTab)}
            </LinearGradient>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const $recordList: ViewStyle = {
  width: '100%',
  position: 'relative',
  borderRadius: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#34343400'
};

const $gradient: ViewStyle = {
  width: '100%',
  flex: 1,
  borderColor: 'rgba(255, 255, 255, 0.10)',
  borderLeftWidth: 1,
  borderRightWidth: 1,
  borderBottomWidth: 1,
  borderRadius: 10,
  borderTopWidth: 2,
  overflow: 'hidden'
};

const $innerWrapper: ViewStyle = {
  flex: 1,
  margin: 0,
  marginBottom: -1,
  marginTop: -1,
  overflow: 'hidden',
  borderRadius: 10
};

const $gradientList: ViewStyle = {
  flex: 1,
  borderRadius: 10,
  position: 'relative'
};

const $headTabs: ViewStyle = {
  flex: 1,
  zIndex: $Z_INDEXES.z100,
  flexDirection: 'row'
};

const $tab: ViewStyle = {
  width: '50%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
};

const $tabName: TextStyle = {
  color: '#FFF',
  fontFamily: typography.fonts.baba.heavy,
  fontSize: 16,
  lineHeight: 24
};

const $activeBar: ImageStyle = {
  position: 'absolute',
  bottom: dp2px(-12),
  zIndex: $Z_INDEXES.zm1,
  width: dp2px(43),
  height: dp2px(31),
  opacity: 1
};

const $bar: ImageStyle = {
  position: 'absolute',
  bottom: dp2px(-12),
  zIndex: $Z_INDEXES.zm1,
  width: dp2px(46),
  height: dp2px(31),
  opacity: 0
};

const $head: ViewStyle = {
  height: dp2px(42),
  width: '100%',
  zIndex: $Z_INDEXES.z100,
  position: 'relative'
};

const $headTrapezoid: ImageStyle = {
  width: dp2px(236),
  height: dp2px(42),
  position: 'absolute',
  top: dp2px(-2),
  left: dp2px(1),
  transform: [
    {
      translateX: dp2px(-36)
    }
  ]
};

const $list: ViewStyle = {
  backgroundColor: '#343434',
  borderTopWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.10)',
  position: 'relative',
  zIndex: $Z_INDEXES.z1
};

const $taskFooter: TextStyle = {
  position: 'absolute',
  bottom: 54,
  height: 20,
  width: '100%',
  zIndex: $Z_INDEXES.z10
};

const $taskFooterText: TextStyle = {
  color: 'rgba(255, 255, 255, 0.24)',
  fontFamily: typography.fonts.pingfangSC.normal,
  fontSize: 11,
  fontWeight: '400',
  lineHeight: 20,
  textAlign: 'center',
  marginTop: 3
};
