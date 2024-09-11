import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showToast } from '@/src/components';
import Tabs, {
  ETabHeaderArrange,
  IIinitialStateItemType
} from '@/src/components/v2/tabs';
import SearchBar from '@/src/gums/search/search-bar';
import { useScreenSize } from '@/src/hooks';
import { useSearchStore } from '@/src/store/search';
import { $SEARCH_COLORS, $flex } from '@/src/theme/variable';
import { dp2px, isIos } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { GameType } from '@/proto-registry/src/web/raccoon/common/types_pb';
import { useRoute } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import SearchWaterFall from './search-waterfall';

const UNDER_NODE = require('@Assets/image/search/search-tab-underline.png');

export default function SearchResult() {
  const route = useRoute();

  const [keywords, setKeywords] = useState('');
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  useEffect(() => {
    setKeywords((route.params as any)?.keywords);
  }, [route.params]);

  const { resourseTabs } = useSearchStore(
    useShallow(state => ({
      resourseTabs: state.initTags
    }))
  );

  const activeTabKey = useMemo(() => {
    const reportType =
      resourseTabs[activeTabIndex]?.feature || GameType.UNKNOWN + '';
    reportClick('result_tab', {
      type: reportType
    });
    return reportType;
  }, [activeTabIndex]);

  const renderWaterFall = (feature: GameType) => {
    return (
      <SearchWaterFall
        feature={feature}
        keywords={keywords}
        isCurrentTab={activeTabKey === feature + ''}
      ></SearchWaterFall>
    );
  };

  const renderTabScene = (item: IIinitialStateItemType) => {
    return renderWaterFall(item.key as GameType);
  };

  const clearWord = () => {
    setKeywords('');
    router.push({
      pathname: '/search/prefer' as RelativePathString,
      params: {
        keywords: ''
      }
    });
  };

  const focusWord = () => {
    router.push({
      pathname: '/search/prefer' as RelativePathString,
      params: {
        result: keywords
      }
    });
  };

  const tabOpacity = useSharedValue(0);

  const $tabOpacity = useAnimatedStyle(() => ({
    opacity: tabOpacity.value
  }));

  useEffect(() => {
    tabOpacity.value = withTiming(1, {
      duration: 600
    });
    if (resourseTabs.length === 0) {
      showToast('哎呀，小狸走丢了');
    }
  }, [resourseTabs]);

  return (
    <Animated.View style={[$tabOpacity, { flex: 1 }]}>
      <SafeAreaView
        style={[$flex, { backgroundColor: $SEARCH_COLORS.white }]}
        edges={['top']}
      >
        <KeyboardAvoidingView behavior={isIos ? 'height' : undefined}>
          <SearchBar
            value={keywords}
            hiddenRight
            clearWord={clearWord}
            onParentFocus={focusWord}
            canbeEdit={false}
            autoFocus={false}
            ellipseMode={true}
            ellipseWidth={dp2px(275)}
          ></SearchBar>
        </KeyboardAvoidingView>
        <Tabs
          activeIndex={activeTabIndex}
          tabNames={resourseTabs.map(s => {
            return {
              title: s.name,
              key: s.feature
            };
          })}
          tabHeaderArrange={ETabHeaderArrange.LEFT}
          renderScene={renderTabScene}
          onIndexChange={(index: number) => {
            if (activeTabIndex !== index) {
              setActiveTabIndex(index);
            }
          }}
          gap={30}
          underNodeWidth={24}
          underNodeHeight={2}
          underNode={UNDER_NODE}
          $underNodeStyle={{
            width: 24,
            height: 2,
            bottom: 4,
            left: 0
          }}
        ></Tabs>
      </SafeAreaView>
    </Animated.View>
  );
}
