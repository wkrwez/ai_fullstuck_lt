import { $LIB_TAB_COLORS, $Z_INDEXES } from "@/src/theme/variable";
import { getScreenSize } from "@/src/utils";
import { useMemo } from "react";
import { View, ViewStyle, Text, TextStyle, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface IToastProps {
    text?: string | number
    customRender?: React.ReactNode,
    onPress?: (e: Event) => void,
    duration?: number,
    durationEnd?: () => void
    visiable?: boolean
    prefix?: React.ReactNode,
    position?: 'top' | 'bottom' | number[]
    cornorText?: string | number
}

const windowWidth = getScreenSize('width')


export default function Toast({text = '', customRender, onPress, duration = 3000, durationEnd, visiable = false, prefix, position = 'top', cornorText = '', ...props}: IToastProps) {
    const insets = useSafeAreaInsets()

    const isCustomPosition = useMemo(() => typeof position !== 'string', [position])
    const isCustomContent = useMemo(() => !!customRender, [customRender])

    return <Animated.View style={[StyleSheet.absoluteFill, $toast, {
        // top: !isCustomPosition ? insets.top + 30 : position[0] as number,
        // right: isCustomPosition ? 0 : position[1] as number,
        // bottom: !isCustomPosition ? undefined : position[2] as number,
        // left: !isCustomPosition ? 0 : position[3] as number,
        }]}>
        {
        isCustomContent
         ? customRender
          : <View style={$content}>
            {prefix}
            <Text style={$contentText}>{text}</Text>
            <View style={$cornerText}>{cornorText}</View>
          </View>
        }
    </Animated.View>
}

const $toast: ViewStyle = {
    height: 40,
    minWidth: 40,
    backgroundColor: $LIB_TAB_COLORS.tabBgColor,
    position: 'absolute',
    zIndex: $Z_INDEXES.z1000,
    borderRadius: 100,
    paddingHorizontal: 20,
}

const $content: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
}

const $contentText: TextStyle = {
    fontFamily: 'PingFang SC',
    color: '#FFFFFF',
    fontSize: 14
}

const $cornerText: TextStyle = {
    fontFamily: 'PingFang SC',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14
}