import { useEffect, useMemo, useState } from 'react';
import { Dimensions, StyleProp, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useAppStore } from '@/src/store/app';
import { typography } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { UserProfile } from '@/src/types';
import { StyleSheet } from '@/src/utils';
import {
  BOTTOM_BAR_HEIGHT,
  BUTTON_HEIGHT,
  parallelWorldColors
} from '../../_constants';
import Timeline, { TimelineProps } from '../timelineV2';
import colors from '../timelineV2/colors';
import SectionNode from '../timelineV2/section-node';
import { TimelinePlot } from '@/proto-registry/src/web/raccoon/world/world_pb';
import { useShallow } from 'zustand/react/shallow';
import { BottomBar, BottomBarProps } from './index';

const AnimatedBottomBar = Animated.createAnimatedComponent(BottomBar);

const { width: screenW } = Dimensions.get('window');

type TimelineBottomProps = {
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
} & Omit<
  TimelineProps<TimelinePlot>,
  'renderItem' | 'color' | 'avatarVisibleIndexList'
> &
  Pick<BottomBarProps, 'barRight'>;

export default function TimelineBottom({
  style: $style = {},
  barRight,
  visible = true,
  ...timelineProps
}: TimelineBottomProps) {
  const $isTimelineExpanded = useSharedValue(true);

  const avatarVisibleIndexList = useMemo(() => {
    const list = [0];
    const timeline = timelineProps?.sections;
    const timelineLength = timelineProps?.sections.length;

    for (let i = 1; i < timelineLength; i++) {
      console.log(timeline[i].author?.uid, timeline[i - 1].author?.uid);

      if (timeline[i].author?.uid !== timeline[i - 1].author?.uid) list.push(i);
    }

    return list;
  }, [timelineProps?.sections]);

  // const textColor = useMemo(() => {
  //   return (
  //     avatarVisibleIndexList.includes(timelineProps?.active) &&
  //     colors[timelineProps?.active % colors.length]
  //   );
  // }, [avatarVisibleIndexList, timelineProps?.active]);

  // console.log('textColor------', textColor);
  const $titleTextStyle_A = useAnimatedStyle(() => ({
    color: withTiming(
      $isTimelineExpanded.value
        ? // ? textColor || parallelWorldColors.fontGlow
          parallelWorldColors.fontGlow
        : StyleSheet.currentColors.white
    ),
    opacity: withTiming($isTimelineExpanded.value ? 1 : 0.6),
    height: withTiming($isTimelineExpanded.value ? 60 : 16)
  }));

  const $titleContainerStyle_A = useAnimatedStyle(() => ({
    width: withTiming($isTimelineExpanded.value ? screenW : screenW - 140),
    zIndex: $isTimelineExpanded.value ? 1 : 0
  }));

  const $btnOpacity = useAnimatedStyle(() => ({
    opacity: withTiming($isTimelineExpanded.value ? 0.1 : 1)
  }));

  const $opacity = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 1 : 0.1),
    zIndex: visible ? 100 : 0
  }));

  const renderChoice = () => {
    return (
      timelineProps.sections[timelineProps?.active] &&
      ((timelineProps?.active === 0
        ? `【序章】`
        : `第${timelineProps?.active + 1}章 `) +
        timelineProps.sections[timelineProps?.active]?.choice ??
        '')
    );
  };

  return (
    <View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: '100%',
            bottom: 90,
            paddingHorizontal: 18
          },
          $opacity
        ]}
      >
        {timelineProps.sections.length > 0 && (
          <Timeline
            {...timelineProps}
            onCollapse={() => {
              $isTimelineExpanded.value = false;
            }}
            onExpand={() => {
              $isTimelineExpanded.value = true;
            }}
            avatarVisibleIndexList={avatarVisibleIndexList}
            renderItem={({
              section,
              index,
              active,
              isExpanded,
              style,
              totalLen,
              color
            }) => (
              <SectionNode
                totalLen={totalLen}
                index={index}
                style={style}
                key={section?.plotId}
                activeIndex={active}
                hasAvatar={avatarVisibleIndexList.includes(index)}
                isExpanded={isExpanded}
                color={color}
                // isAvatarVisible={
                //   isExpanded && avatarVisibleIndexList.includes(index)
                // }
                avatarUrl={section?.author?.avatar ?? ''}
              />
            )}
          />
        )}
      </Animated.View>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: '60%',
            height: BOTTOM_BAR_HEIGHT,
            paddingTop: 12,
            position: 'absolute',
            bottom: 0,
            paddingHorizontal: 32
          },
          $titleContainerStyle_A,
          $opacity
        ]}
      >
        <View
          style={{
            ...$flexHCenter,
            maxHeight: 60,
            borderColor: 'red',
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Animated.Text
            allowFontScaling={false}
            style={[
              {
                fontSize: 16,
                minHeight: 24,
                borderColor: 'red',
                fontWeight: '400',
                letterSpacing: 0,
                fontFamily: typography.fonts.world
              },
              $titleTextStyle_A
            ]}
            numberOfLines={3}
          >
            {renderChoice()}
          </Animated.Text>
        </View>
      </Animated.View>
      <AnimatedBottomBar
        style={[{ position: 'relative', zIndex: 1 }, $btnOpacity]}
        barRight={barRight}
      />
    </View>
  );
}
