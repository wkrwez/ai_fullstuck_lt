import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, createStyle } from '@/src/utils';

const SPOT_BG_IMG = require('@Assets/image/parallel-world/spot2.png');

interface AiPressableInputProps {
  textNode: React.ReactNode;
  onInputPress?: () => void;
  labelNode?: React.ReactNode;
  outlineStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export default function AiPressableInput({
  labelNode,
  onInputPress, // 没有onInputPress展示普通节点
  textNode,
  outlineStyle: $outlineStyle = {},
  disabled = false
}: AiPressableInputProps) {
  return (
    <View
      style={[
        inputStyles.$container,
        glowLineStyle.$border,
        $outlineStyle,
        { opacity: disabled ? 0.6 : 1 }
      ]}
    >
      <LinearGradient
        colors={['#141C25', '#1E4256']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={inputStyles.$bg}
      >
        <ImageBackground
          source={SPOT_BG_IMG}
          resizeMode="contain"
          style={inputStyles.$imgBg}
        >
          {onInputPress ? (
            <>
              {labelNode || <View />}
              <Pressable
                style={inputStyles.$inputPress}
                onPress={onInputPress}
                disabled={disabled}
              >
                {textNode}
              </Pressable>
            </>
          ) : (
            textNode
          )}
        </ImageBackground>
      </LinearGradient>
    </View>
  );
}

export const glowLineStyle = createStyle({
  $border: {
    borderColor: 'rgba(127, 217, 255, 1)',
    shadowColor: 'rgba(127, 217, 255, 0.5)', // 光晕颜色
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10 // 安卓上的阴影效果
  }
});

const inputStyles = StyleSheet.create({
  $container: {
    borderWidth: 2,
    height: 55,
    borderRadius: 10,
    zIndex: 100
  },
  $bg: { borderRadius: 10, width: '100%', height: '100%' },
  $imgBg: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    gap: 12
  },
  $inputPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1
  }
});
