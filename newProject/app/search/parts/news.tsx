import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Easing,
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
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { ESearchResourceType, getQuerySourceByType } from '@/src/api/search';
import { Icon, IconProps, IconTypes } from '@/src/components';
import Badge from '@/src/components/v2/badge';
import { INewsItem, useSearchStore } from '@/src/store/search';
import { typography } from '@/src/theme';
import {
  $SEARCH_COLORS,
  $USE_FONT,
  $Z_INDEXES,
  $flex,
  $flexCenter,
  $flexHCenter,
  $flexHStart,
  $flexRow
} from '@/src/theme/variable';
import { logWarn } from '@/src/utils/error-log';
import { reportClick, reportDiy, reportExpo } from '@/src/utils/report';
import MaskedView from '@step.ai/masked-view';
import { useShallow } from 'zustand/react/shallow';

enum ENewsSearchSubIcon {
  UNKNOW = 0,
  HOT = 1,
  NEW = 2
}

interface INewsProps {
  hidden: boolean;
}

export default function News({ hidden = true }: INewsProps) {
  const TOP3 = ['search_top1', 'search_top2', 'search_top3'];
  const TOP3_COLORS = [
    ['rgba(255, 194, 78, 0.12)', 'rgba(255, 194, 78, 0.02)'],
    ['rgba(199, 202, 215, 0.24)', 'rgba(199, 202, 215, 0.02)'],
    ['rgba(231, 179, 161, 0.15)', 'rgba(231, 179, 161, 0.02)']
  ];
  const { newsList } = useSearchStore(
    useShallow(state => ({
      newsList: state.initRanks
    }))
  );

  useEffect(() => {
    reportDiy('search', 'begin_hotsearch-expo');
  }, []);

  useEffect(() => {
    if (hidden) {
      newsOpacity.value = withTiming(0, {
        duration: 0
      });
    } else {
      newsOpacity.value = withTiming(1, {
        duration: 300
      });
      newsTop.value = withSpring(0, {
        damping: 15,
        stiffness: 250,
        mass: 1,
        velocity: 300
      });
    }
  }, [hidden]);

  const SearchSubIcon = {
    [ENewsSearchSubIcon.HOT]: 'search_hot_icon',
    [ENewsSearchSubIcon.NEW]: 'search_new_icon'
  };

  const enterNews = (ns: INewsItem, nsKey: number) => {
    Haptics.impactAsync();

    reportClick('begin_hotsearch', {
      words: ns.keyword,
      order: nsKey
    });
    router.push({
      pathname: '/search/result',
      params: {
        keywords: ns.keyword
      }
    });
  };

  const newsOpacity = useSharedValue(0);
  const newsTop = useSharedValue(-50);
  const $opacityAnimateShow = useAnimatedStyle(() => ({
    opacity: newsOpacity.value,
    transform: [
      {
        translateX: newsTop.value
      }
    ]
  }));

  return (
    <View style={$news}>
      <Animated.View style={$opacityAnimateShow}>
        <View style={[$slogan, $flexRow, $flexHStart]}>
          <Icon size={20} icon={'search_hot'}></Icon>
          <MaskedView
            style={[
              {
                width: 128,
                height: 20,
                marginLeft: 4
              }
            ]}
            maskElement={
              <View
                style={[
                  {
                    width: 128,
                    height: 20
                  },
                  $maskView
                ]}
              >
                <Text style={$maskText}>狸谱八卦新闻热榜</Text>
              </View>
            }
          >
            <LinearGradient
              colors={['#FE5855', '#FF6A3B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                $flex,
                {
                  height: '100%'
                }
              ]}
            ></LinearGradient>
          </MaskedView>
        </View>
        <View style={$list}>
          {newsList?.map((ns, nsKey) => {
            return (
              <View style={$outer}>
                <Badge
                  linearColors={TOP3_COLORS[nsKey]}
                  onPress={e => enterNews(ns, nsKey)}
                  medal={
                    <View style={$rank}>
                      <Text
                        style={[
                          $rankText,
                          {
                            color:
                              nsKey < 3
                                ? $SEARCH_COLORS.white
                                : $SEARCH_COLORS.black_40,
                            textShadowColor:
                              nsKey === 0
                                ? $SEARCH_COLORS.top1
                                : $SEARCH_COLORS.black_25,
                            fontSize: nsKey < 3 ? 11 : 15
                          }
                        ]}
                      >
                        {nsKey + 1}
                      </Text>
                      {nsKey < 3 && (
                        <View style={$medalBg}>
                          <Icon
                            size={20}
                            icon={TOP3[nsKey] as IconTypes}
                          ></Icon>
                        </View>
                      )}
                    </View>
                  }
                  title={
                    <View style={$flexHCenter}>
                      <Text style={$title}>{ns.keyword}</Text>
                      {ns.subIcon ? (
                        <Icon
                          size={16}
                          icon={SearchSubIcon[ns.subIcon] as IconTypes}
                          style={{ marginLeft: 6 }}
                        ></Icon>
                      ) : (
                        <></>
                      )}
                    </View>
                  }
                  // tail={<Text style={$hotNum}>{ns.hotNum}</Text>}
                  key={nsKey}
                ></Badge>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

const $news: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
  minHeight: 526,
  width: '100%',
  marginTop: 24
};

const $slogan: ViewStyle = {
  height: 20
};

const $maskView: ViewStyle = {
  // Transparent background because mask is based off alpha channel.
  backgroundColor: 'transparent'
};

const $maskText: TextStyle = {
  ...$USE_FONT('#000', typography.fonts.feed, 16, 'normal', '400', 20)
};

const $list: ViewStyle = {
  marginTop: 6
};

const $outer: ViewStyle = {
  marginVertical: 5,
  height: 40
};

const $rank: ViewStyle = {
  width: 20,
  height: 20,
  position: 'relative',
  ...$flexCenter
};

const $medalBg: ViewStyle = {
  width: 20,
  height: 20,
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: $Z_INDEXES.zm1
};

const $rankText: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.white,
    typography.fonts.feed,
    11,
    'normal',
    '900',
    undefined
  ),
  textShadowOffset: { width: 0.7, height: 0.7 },
  textShadowRadius: 0
};

const $title: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black_87,
    typography.fonts.pingfangSC.normal,
    14,
    'normal',
    '400',
    undefined
  )
};

const $hotNum: TextStyle = {
  ...$USE_FONT(
    $SEARCH_COLORS.black_40,
    typography.fonts.pingfangSC.normal,
    12,
    'normal',
    '400',
    undefined
  )
};
