import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
  ViewStyle
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Image as OptimizeImage } from '@/src/components';
import { Icon, IconContinue } from '@/src/components';
import { $maskStyle } from '@/src/components/sheet/style';
import { Tag } from '@/src/components/tag';
import { selectState } from '@/src/store/_utils';
import {
  FOLD_STATUS_ENUM,
  PARALLEL_WORLD_PAGES_ENUM,
  useParallelWorldStore
} from '@/src/store/parallel-world';
import { useParallelWorldFeedStore } from '@/src/store/parallel-world-feed';
import { useParallelWorldMainStore } from '@/src/store/parallel-world-main';
import { colors, typography } from '@/src/theme';
import { $flexHCenter, createCircleStyle } from '@/src/theme/variable';
import { createStyle } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { dp2px } from '@Utils/dp2px';
import { AVATAR_SIZE, parallelWorldColors } from '../../_constants';
import Danmaku from '../danmaku';
import InfoCard from '../info-card';
import UserDisplay from '../others/user-display';
import { useShallow } from 'zustand/react/shallow';
import Title from './title';

const PARALLEL_WORLD_ENTRY = require('@Assets/image/parallel-world/parallel-world-entry.png');
const ORIGIN_WORLD_LABEL = require('@Assets/image/parallel-world/origin-world-label.png');
const TO_BE_CONTINUE = require('@Assets/image/parallel-world/to-be-continue.png');
const ENTER = require('@Assets/image/parallel-world/enter.png');

const { width: screenW } = Dimensions.get('window');

const danmakuHeight = screenW + 30;

const DANMAKU_FOLD_DURATION = 400;
const INFO_OPACITY_DURATION = 300;

export default function ParallelWorldGuideModal({}: { visible: boolean }) {
  const { pushWorldRouteStack, switchPageFoldStatus } = useParallelWorldStore(
    useShallow(state =>
      selectState(state, ['pushWorldRouteStack', 'switchPageFoldStatus'])
    )
  );
  const [tagVisible, setTagVisible] = useState(false);

  const {
    topic,
    timeline,
    activeTimelineSectionIdx,
    closeParallelWordGuide,
    getParallelWorldPlot,
    changePlayList,
    changePlayedList,
    changeActiveTimelineSectionIdx,
    changeActIndex,
    worldInfo,
    isParallelWordGuideOpenByBack
  } = useParallelWorldMainStore(
    useShallow(state =>
      selectState(state, [
        'topic',
        'timeline',
        'activeTimelineSectionIdx',
        'closeParallelWordGuide',
        'getParallelWorldPlot',
        'changePlayList',
        'changePlayedList',
        'changeActiveTimelineSectionIdx',
        'changeActIndex',
        'worldInfo',
        'isParallelWordGuideOpenByBack'
      ])
    )
  );

  const { plotChoices } = useParallelWorldFeedStore(
    useShallow(state => selectState(state, ['plotChoices']))
  );

  const $foldRatio = useSharedValue(Number(isParallelWordGuideOpenByBack));
  const $opacity = useSharedValue(0);

  const nextPlot = useMemo(
    () =>
      activeTimelineSectionIdx < timeline.length - 1
        ? timeline[activeTimelineSectionIdx + 1]
        : null,
    [activeTimelineSectionIdx, timeline]
  );

  const closeAnimate = (callback: () => void) => {
    setTagVisible(false);
    $foldRatio.value = withTiming(0, { duration: DANMAKU_FOLD_DURATION });
    $opacity.value = withDelay(
      DANMAKU_FOLD_DURATION,
      withTiming(0, { duration: INFO_OPACITY_DURATION }, finished => {
        if (finished) {
          runOnJS(callback)();
        }
      })
    );
  };

  const continueFn = async () => {
    if (!nextPlot) return;

    reportClick('world_choice', {
      world_choice_button: 2,
      contentid: worldInfo.cardId,
      plotId: nextPlot?.plotId
    });
    changePlayList([0]);
    changePlayedList([]);
    changeActIndex(0);
    await getParallelWorldPlot({ plotId: nextPlot?.plotId });
    changeActiveTimelineSectionIdx(activeTimelineSectionIdx + 1);
    closeParallelWordGuide();
  };

  const handleContinue = () => {
    closeAnimate(continueFn);
  };

  const feedFn = () => {
    // switchParallelWorldPage(PARALLEL_WORLD_PAGES_ENUM.FEED);
    pushWorldRouteStack({
      route: PARALLEL_WORLD_PAGES_ENUM.FEED,
      cardId: worldInfo?.cardId ?? '',
      plotId: timeline[activeTimelineSectionIdx]?.plotId ?? ''
    });
    switchPageFoldStatus(FOLD_STATUS_ENUM.FOLD_2_UNFOLD);
    closeParallelWordGuide();
  };

  const handleFeed = () => {
    closeAnimate(feedFn);
    reportClick('world_choice', {
      world_choice_button: 1,
      contentid: worldInfo?.cardId ?? '',
      plotId: timeline[activeTimelineSectionIdx]?.plotId ?? ''
    });
  };

  const closeFn = () => {
    closeParallelWordGuide();
  };

  const handleClose = () => {
    closeAnimate(closeFn);
  };

  const handlePressTag = () => {
    reportClick('world_topic', {
      contentid: worldInfo.originalCardId
    });
    router.push(`/topic/world/${worldInfo.originalCardId}`);
  };

  const handleShowTag = () => {
    setTimeout(() => {
      setTagVisible(true);
      reportExpo('world_topic', {
        contentid: worldInfo.originalCardId
      });
    }, 800);
  };

  const $danmakuContainerStyle_A = useAnimatedStyle(() => ({
    height: $foldRatio.value * danmakuHeight
  }));

  const $continueInfoStyle_A = useAnimatedStyle(() => ({
    opacity: $opacity.value
  }));

  useEffect(() => {
    $opacity.value = withTiming(1, { duration: INFO_OPACITY_DURATION }, () =>
      runOnJS(handleShowTag)()
    );
  }, []);

  useEffect(() => {
    // if (!isPlotChoicesLoading) {
    if (!isParallelWordGuideOpenByBack) {
      $foldRatio.value = withDelay(
        1000,
        withTiming(1, { duration: DANMAKU_FOLD_DURATION })
      );
    }
    reportExpo('world_choice');
    // }
  }, []);

  return (
    <View
      style={[
        $maskStyle,
        {
          bottom: 60,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }
      ]}
    >
      <Animated.View
        style={[$danmakuContainerStyle_A, danmakuStyles.$container]}
      >
        <ImageBackground
          source={PARALLEL_WORLD_ENTRY}
          resizeMode="contain"
          style={danmakuStyles.$imgBg}
        >
          <Title />
          <View
            style={{
              ...$flexHCenter,
              flexDirection: 'row-reverse',
              width: '100%',
              position: 'absolute',
              top: 22,
              paddingHorizontal: 44
            }}
          >
            <Pressable onPress={handleClose}>
              <Icon size={26} icon="close_pw" />
            </Pressable>
          </View>
          <Danmaku
            list={plotChoices}
            renderItem={choice => (
              <Pressable
                onPress={handleFeed}
                style={[
                  danmakuItemStyle.$box,
                  choice.isAi ? danmakuItemStyle.$ai : danmakuItemStyle.$normal
                ]}
              >
                <UserDisplay
                  text=""
                  avatarStyle={{ borderColor: colors.black }}
                />
                {choice.isAi && <Icon icon="ai_dark" size={20} />}
                <Text
                  style={[
                    danmakuItemStyle.$text,
                    choice.isAi
                      ? danmakuItemStyle.$aiText
                      : danmakuItemStyle.$normalText
                  ]}
                  numberOfLines={1}
                >
                  {choice.choice ?? ''}
                </Text>
              </Pressable>
            )}
          />
          <Pressable onPress={handleFeed} style={danmakuStyles.$enter}>
            <Image
              source={ENTER}
              style={danmakuStyles.$enterImg}
              resizeMode="contain"
            />
          </Pressable>
        </ImageBackground>
      </Animated.View>
      <View style={$gapBlock}>
        {topic ? (
          <Tag
            visible={tagVisible}
            style={{ position: 'absolute', bottom: 10, left: '50%', right: 10 }}
            text={topic}
            onPress={handlePressTag}
          />
        ) : null}
      </View>
      {nextPlot ? (
        <Animated.View style={$continueInfoStyle_A}>
          <Pressable onPress={handleContinue}>
            <InfoCard cardStyle={cardStyles.$card}>
              <Image
                source={ORIGIN_WORLD_LABEL}
                resizeMode="contain"
                style={cardStyles.$originWorldLabel}
              />
              <View style={cardStyles.$infoCardContent}>
                <View style={cardStyles.$infoCardSideArea}>
                  <OptimizeImage
                    source={{ uri: nextPlot.author?.avatar }}
                    style={cardStyles.$avatar}
                  />
                </View>
                <View style={cardStyles.$infoCardTextBox}>
                  <Text style={cardStyles.$infoCardText} numberOfLines={3}>
                    {nextPlot.choice}
                  </Text>
                </View>
                <View style={cardStyles.$infoCardSideArea}>
                  <Pressable
                    onPress={handleContinue}
                    style={{
                      padding: 10,
                      marginHorizontal: -10
                    }}
                  >
                    <IconContinue fill="#000" size={20} />
                  </Pressable>
                </View>
              </View>
            </InfoCard>
          </Pressable>
        </Animated.View>
      ) : (
        <Animated.View
          style={[{ width: '100%', height: 80 }, $continueInfoStyle_A]}
        >
          <Image
            source={TO_BE_CONTINUE}
            resizeMode="contain"
            style={{ width: '100%', height: 80 }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const danmakuStyles = createStyle({
  $container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  $imgBg: {
    height: danmakuHeight,
    paddingLeft: 10,
    width: screenW,
    alignItems: 'center',
    position: 'relative'
  },
  $enter: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -45 }]
  },
  $enterImg: {
    height: 90,
    width: 90
  }
});

const cardStyles = createStyle({
  $card: { width: screenW - 36, backgroundColor: 'white' },
  $avatar: {
    ...createCircleStyle(AVATAR_SIZE),
    borderWidth: 1,
    borderColor: colors.black
  },
  $originWorldLabel: {
    width: 89,
    height: 39,
    position: 'absolute',
    top: -42,
    left: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  $infoCardContent: {
    // height: 58,
    paddingVertical: 8,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative'
  },
  $infoCardTextBox: { flex: 1, alignItems: 'center' },
  $infoCardText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: typography.fonts.world
  },
  $infoCardSideArea: {
    paddingHorizontal: 12
  }
});

const danmakuItemStyle = createStyle({
  $box: {
    ...$flexHCenter,
    borderWidth: 1,
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 2
  },
  $normal: {
    borderColor: 'rgba(34, 34, 34, 1)',
    backgroundColor: 'rgba(38, 54, 70, 1)'
  },
  $ai: {
    borderColor: parallelWorldColors.fontGlow,
    backgroundColor: 'rgba(38, 54, 70, 0.3)'
  },
  $text: {
    marginHorizontal: 6,
    maxWidth: 240,
    fontFamily: typography.fonts.world
  },
  $normalText: {
    color: colors.white
  },
  $aiText: {
    color: parallelWorldColors.fontGlow
  }
});
const $gapBlock: ViewStyle = {
  height: 70,
  width: '100%'
};
