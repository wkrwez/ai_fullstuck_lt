import  {ComponentType } from 'react';
import { 
    Pressable, 
    PressableProps, 
    PressableStateCallbackType,
    StyleProp,
    TextStyle,
    View,
    ViewStyle 
} from 'react-native';
import { Icon, IconTypes } from '@/src/components';
import { Text, TextProps} from '../../text'
import { colors, colorsUI, spacing, typography } from '../../../theme'

export type Presets = keyof typeof $viewPresets;
export type Size = keyof typeof $sizePresets;

export interface ButtonAccessoryProps {
    style: StyleProp<ViewStyle>;
    pressableState: PressableStateCallbackType;
  }


export interface ButtonProps extends PressableProps {
    /**
     * preset: 预置样式
     * text: 文本
     * icon: 图标(大小，位置)
     * pressedStyle 按下态
     * textStyle: 文本样式
     * style: 自定义按钮容器样式
     * size: 按钮大小
     * target: 跳转链接
     * shape: 形状
     * children
     * onPress 回调函数
     */
    loading?: boolean;
    style?:StyleProp<ViewStyle>,
    disabledStyle?: StyleProp<ViewStyle>;
    preset :Presets;
    pressedStyle?: StyleProp<ViewStyle>;
    text ?: TextProps['text'];
    textStyle?: StyleProp<TextStyle>;
    pressedTextStyle?: StyleProp<TextStyle>;
    disabledTextStyle?: StyleProp<TextStyle>;
    icon ?: IconTypes;
    iconsize?: number;
    // shape ?:Presets;
    size : Size;
    children ?: React.ReactNode,
    onPress?:()=>void

    RightAccessory?: ComponentType<ButtonAccessoryProps>;
    LeftAccessory?: ComponentType<ButtonAccessoryProps>;


}

export function BaseButton(props: ButtonProps){
    const {
        style:$viewStyleOverride,
        pressedStyle: $pressedViewStyleOverride,
        text,
        textStyle: $textStyleOverride,
        disabledStyle: $disabledViewStyleOverride,
        disabledTextStyle: $disabledTextStyleOverride,
        children,
        icon,
        iconsize,
        disabled,
        loading,
        ...rest
    } = props

    const preset: Presets = (props.preset || 'default') as Presets
    const size: Size = (props.size || 'small') as Size
    // const shape: Presets = (props.shape || 'default') as Presets
    

    // 容器样式方法
    function $viewStyle({pressed}:{pressed:boolean}) {
        return [
            [...$viewPresets[preset],...$sizePresets[size]],
            // $viewPresets[shape],
            disabled || loading // 禁用和loading态
            ? [$disabledViewStyle, $disabledViewStyleOverride]
            : {},
            $viewStyleOverride,
            !!pressed && [{ opacity: 0.75 }, $pressedViewStyleOverride] 
        ]
    }

    // 文本样式方法
    function $textStyle({pressed}: {pressed:boolean}) {
        return [
            $textPresets[preset] || $baseTextStyle,
            disabled || loading ? $disabledTextStyleOverride : {},
            pressed ? $textStyleOverride : $textStyleOverride //pressed 占位脏代码
        ]
    }

    const renderInner = (state: PressableStateCallbackType) => {
        const content = text || children;
        return (
            <>
                {typeof content === 'string' ? (
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',}}>
                        {icon ? <Icon icon={icon} size={iconsize || 16} style={{marginRight:6}}></Icon>: ''}
                        <Text style={$textStyle(state)}>
                        {children}
                    </Text>
                    </View>
                    
                    ) : (
                    children
                )}
            </>
        )
    }

    return (
        <Pressable 
            style={$viewStyle}
            accessibilityRole="button"
            disabled = {disabled || loading}
            {...rest}
        >
            {state => renderInner(state)}
        </Pressable>
    )

}

const $baseViewStyle: ViewStyle = {
    // paddingVertical: spacing.sm,
    // paddingHorizontal: spacing.lg,
    // borderRadius: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
};

// 预置容器样式
const $viewPresets = {
    default: [
        // $baseViewStyle,
        {
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: colors.backgroundGray
        }
    ],
    lightTheme: [$baseViewStyle,{backgroundColor:colors.lightTheme}],
    theme: [$baseViewStyle,{backgroundColor:colors.themeGround}],
    gray: [$baseViewStyle,{backgroundColor:colors.backgroundGray}],
    chooseLike: []

}

const $sizePresets = {
    // size
    large:[{height:44}],

    middle: [{borderRadius:18,height:36,lineHeight:36,paddingHorizontal: spacing.lg, fontSize:14}],

    small: [{borderRadius:13,height:26,lineHeight:26,paddingHorizontal: spacing.xs, fontSize:12}]
}

// 预置文本样式
const $textPresets: Partial<Record<Presets, StyleProp<TextProps>>> = {
    default: {}
}

const $baseTextStyle: TextStyle = {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: typography.primary.medium,
    fontWeight: '500',
    textAlign: 'center',
    color: '#fff'
  };

  const $disabledViewStyle: ViewStyle = {
    opacity: 0.3
  };