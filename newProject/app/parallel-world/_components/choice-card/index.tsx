import { ImageBackground } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { IconContinue } from '@/src/components';
import { colors, typography } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { AnimatedImage } from '@Components/animatedImage';
import { parallelWorldColors } from '../../_constants';
import UserDisplay from '../others/user-display';
import { PlotChoice } from '@/proto-registry/src/web/raccoon/world/world_pb';

const SPOT_BG_IMG = require('@Assets/image/parallel-world/spot2.png');

const L3_IMG = require('@Assets/apng/l3.png');

export default function ChoiceCard({
  choice,
  enterColor = parallelWorldColors.fontBlue,
  onEnter
}: {
  choice: PlotChoice;
  enterColor?: string;
  onEnter: (choice: PlotChoice) => void;
}) {
  const [pressIn, setPressIn] = useState(false);
  return (
    <Pressable
      onPress={() => {
        setPressIn(true);
      }}
    >
      <ImageBackground
        source={SPOT_BG_IMG}
        contentFit="contain"
        style={styles.$container}
      >
        <View style={styles.$header}>
          <UserDisplay
            text={choice.author?.name}
            uri={choice.author?.avatar ?? ''}
          />
          <Pressable
            style={styles.$headerSubSection}
            // onEnter(choice)
            onPress={() => {
              setPressIn(true);
            }}
          >
            <Text style={[styles.$enterText, { color: enterColor }]}>
              进入TA的世界线
            </Text>
            <IconContinue fill={enterColor} size={16} />
          </Pressable>
        </View>
        {/* TODO:层级有问题，暂时先不加 */}
        {/* {pressIn && (
        <Animated.View
          entering={FadeIn.duration(1000)}
          style={styles.$hightlight}
        ></Animated.View>
      )} */}
        <View style={styles.$relatedTextArea}>
          <Text style={styles.$relatedText}>{choice.choice}</Text>
        </View>
        {pressIn && (
          <AnimatedImage
            source={L3_IMG}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            duration={700}
            halfTime={400}
            onHalf={() => {
              onEnter(choice);
            }}
            onFinish={() => {
              setPressIn(false);
            }}
          />
        )}
      </ImageBackground>
    </Pressable>
  );
}

const styles = createStyle({
  $container: {
    padding: 8,
    minHeight: 110,
    borderRadius: 10,
    backgroundColor: 'rgba(28, 38, 49, 0.80)'
  },
  $header: {
    display: 'flex',
    flexDirection: 'row',
    height: 28,
    paddingHorizontal: 6,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  $headerSubSection: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  $userName: {
    color: colors.white,
    opacity: 0.8,
    fontSize: 14,
    fontWeight: '400'
  },
  $enterText: {
    opacity: 0.8,
    fontSize: 14,
    fontWeight: '500'
  },
  $relatedTextArea: {
    backgroundColor: 'rgba(67, 95, 124, 0.2)',
    paddingVertical: 22,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10
  },
  $relatedText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
    fontFamily: typography.fonts.world
  },
  $hightlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#516d82',
    borderRadius: 5
  }
});
