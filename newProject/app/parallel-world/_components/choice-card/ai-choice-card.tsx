import React, { useEffect, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Icon } from '@/src/components';
import { Image } from '@/src/components';
import { AnimatedImage } from '@/src/components/animatedImage';
import { typography } from '@/src/theme';
import { StyleSheet, createStyle } from '@/src/utils';
import { createCircleStyle } from '../../../../src/theme/variable';
import { AVATAR_SIZE, parallelWorldColors } from '../../_constants';
import AiGenTextarea from '../others/ai-gen-textarea';
import { PlotChoice } from '@/proto-registry/src/web/raccoon/world/world_pb';

const LI_AVATAR = require('@Assets/image/parallel-world/li-avatar.png');
const L3_IMG = require('@Assets/apng/l3.png');

export const AiChoiceCard = ({
  choice,
  onEnter,
  containerStyle: $containerStyle = {},
  outlineStyle: $outlineStyle = {}
}: {
  choice: PlotChoice;
  onEnter: (choice: PlotChoice) => void;
  containerStyle?: StyleProp<ViewStyle>;
  outlineStyle?: StyleProp<ViewStyle>;
}) => {
  const [pressIn, setPressIn] = useState(false);
  return (
    <AiGenTextarea
      containerStyle={[$containerStyle]}
      outlineStyle={[
        {
          marginHorizontal: 8
        },
        $outlineStyle
      ]}
    >
      <Pressable
        onPress={() => {
          setPressIn(true);
        }}
        style={{ overflow: 'hidden' }}
        // onPress={() => onEnter(choice)}
      >
        {pressIn && (
          <Animated.View
            entering={FadeIn.duration(1000)}
            style={aiTextStyles.$hightlight}
          ></Animated.View>
        )}
        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 24,
            paddingBottom: 8,
            gap: 6
          }}
        >
          <Text style={aiTextStyles.$genText}>{choice.choice}</Text>
          <View style={aiTextStyles.$lipu}>
            <Text style={aiTextStyles.$lipuText}>小狸脑洞</Text>
            <Image source={LI_AVATAR} style={aiTextStyles.$lipuAvatar} />
          </View>
        </View>
      </Pressable>
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
    </AiGenTextarea>
  );
};

const aiTextStyles = createStyle({
  $container: {
    marginTop: -20,
    paddingTop: 28,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  $wireframe: {
    position: 'relative',
    padding: 8,
    borderRadius: 6,
    margin: 8,
    paddingHorizontal: 14,
    paddingTop: 24,
    paddingBottom: 10,
    marginTop: 0,
    borderWidth: 1,
    borderColor: 'rgba(127, 217, 255, 1)',
    gap: 6
  },
  $aiLabel: { position: 'absolute', top: -29, left: -15 },
  $genText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: typography.fonts.world
  },
  $lipu: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4
  },
  $lipuText: {
    color: parallelWorldColors.fontGlow,
    fontFamily: typography.fonts.world,
    fontWeight: '500',
    fontSize: 12
  },
  $lipuAvatar: {
    ...createCircleStyle(24),
    borderWidth: 1,
    borderColor: parallelWorldColors.fontGlow
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
