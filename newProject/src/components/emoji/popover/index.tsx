import React, { ReactElement, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import {
  SceneColor,
  darkSceneColor,
  lightSceneColor
} from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { createStyle } from '@/src/utils';

const POP_PADDING = 5;
const POINTER_HEIGHT = 10;
const POINTER_WIDTH = 10;

export default function Popover({
  visible = true,
  content,
  theme = Theme.LIGHT,
  children,
  containerStyle = {
    padding: POP_PADDING
  },
  bottomDistance = 0
}: {
  visible?: boolean;
  content: ReactElement;
  theme?: Theme;
  children: ReactElement;
  containerStyle: ViewStyle;
  bottomDistance?: number;
}) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>();
  const [popDimensions, setPopDimensions] = useState<{
    width: number;
    height: number;
  }>();

  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;

  const styles = getThemeStyles(themeConfig);

  const popStyle = useMemo<StyleProp<ViewStyle>>(() => {
    if (dimensions?.width && popDimensions?.width) {
      return {
        left: (dimensions.width - popDimensions.width) / 2,
        top:
          -popDimensions?.height -
          POINTER_HEIGHT -
          bottomDistance -
          ((containerStyle?.padding as number) ?? 0)
      };
    }
  }, [dimensions?.width, popDimensions?.width]);

  return (
    <View
      style={{ position: 'relative', backgroundColor: 'black' }}
      onLayout={e => {
        const { width, height } = e.nativeEvent.layout;
        setDimensions({ width, height });
      }}
    >
      {children}
      {visible && dimensions && (
        <View
          style={[
            styles.$popover,
            {
              ...((popStyle as object) || {}),
              opacity: popStyle ? 1 : 0
            }
          ]}
        >
          <View style={{ position: 'relative' }}>
            <View
              style={[
                {
                  borderRadius: 5,
                  overflow: 'hidden'
                },
                containerStyle
              ]}
              onLayout={e => {
                const { width, height } = e.nativeEvent.layout;
                setTimeout(() => {
                  setPopDimensions({ width, height });
                });
              }}
            >
              {content}
            </View>
            <View style={[styles.$triangle]} />
          </View>
        </View>
      )}
    </View>
  );
}

export function AbsolutePopover({
  visible = false,
  theme = Theme.LIGHT,
  content,
  popStyle = {},
  containerStyle = {}
}: {
  visible?: boolean;
  theme?: Theme;
  content: ReactElement;
  popStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}) {
  const themeConfig = theme === Theme.LIGHT ? lightSceneColor : darkSceneColor;

  const styles = getThemeStyles(themeConfig);

  return (
    visible && (
      <View style={[styles.$popover, popStyle]}>
        <View style={{ position: 'relative' }}>
          <View
            style={[
              {
                borderRadius: 5,
                padding: POP_PADDING,
                overflow: 'hidden'
              },
              containerStyle
            ]}
          >
            {content}
          </View>
          <View style={[styles.$triangle]} />
        </View>
      </View>
    )
  );
}

const getThemeStyles = (sceneColor: SceneColor) => {
  return createStyle({
    $popover: {
      width: 'auto',
      backgroundColor: sceneColor.eleBgFill,
      borderRadius: 10,
      marginVertical: 5,
      position: 'absolute',
      zIndex: 1000
    },
    $triangle: {
      position: 'absolute',
      bottom: -POINTER_HEIGHT,
      left: '50%',
      marginLeft: -POINTER_WIDTH,
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderTopWidth: POINTER_WIDTH,
      borderTopColor: sceneColor.eleBgFill,
      borderLeftWidth: POINTER_WIDTH,
      borderLeftColor: 'transparent',
      borderRightWidth: POINTER_WIDTH,
      borderRightColor: 'transparent'
    }
  });
};
