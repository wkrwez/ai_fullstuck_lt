import { useState } from 'react';
import {
  Alert,
  LayoutChangeEvent,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '@/src/theme';
import { $Z_INDEXES, $flex, $flexCenter } from '@/src/theme/variable';
import { Icon } from '../icons';

interface ICreditCasProps {
  size?: number;
  text?: string;
  extraText?: string;
  theme: CREDIT_TYPE;
  $customTextStyle?: TextStyle;
  $customExtraTextStyle?: TextStyle;
  borderColors?: string[];
  insetsColors?: string[];
  hasPad?: boolean;
  isLinear?: boolean;
  pureBorderColor?: string;
}

export const PLUS_BORDER_THEME1 = ['#11BB2C1A', '#11BB2C4D']; // 规则色
export const PLUS_BORDER_THEME2 = ['transparent', 'transparent']; // 玩法色

export const PURE_BORDER_PLUS2 = '#0F8C2366'; // 边框色
export const PURE_BORDER_MINUS2 = '#FF673B59'; // 边框色

export const MINUS_BORDER_THEME1 = ['#FF6A3B14', '#FF6A3B4D'];
export const MINUS_BORDER_THEME2 = ['transparent', 'transparent'];

export const PLUS_THEME1 = ['#000000', '#032508']; // 规则色
export const PLUS_THEME2 = ['#0F8C2333', '#0F8C2333']; // 玩法色
export const MINUS_THEME1 = ['#000000', '#2F0C01'];
export const MINUS_THEME2 = ['#FF6A3B33', '#FF6A3B33'];

export const PLUS_COLOR = '#11BB2C';
export const MINUS_COLOR = '#FE6F34';

export const CREDIT_LIMIT = 60;
export const CREDIT_FULL_LIMIT = 300;

export enum CREDIT_TYPE {
  PLUS = 'plus',
  MINUS = 'minus'
}

export default function CreditCas({
  size = 24,
  text,
  extraText,
  hasPad = false,
  theme,
  $customTextStyle,
  $customExtraTextStyle,
  borderColors = ['#fff', '#000'],
  insetsColors = ['#fff', '#000'],
  isLinear = true,
  pureBorderColor = 'transparent'
}: ICreditCasProps) {
  const [extraLineWidth, setExtraLineWidth] = useState(0);

  return (
    <View>
      <LinearGradient
        colors={borderColors}
        start={{ x: 0.37, y: 0 }} // Approximate normalized values for 283 degrees
        end={{ x: 0.63, y: 1 }}
        style={[
          $gradient,
          {
            height: size + 6
          }
        ]}
      >
        <View
          style={[
            $cas,
            {
              borderColor: pureBorderColor,
              margin: !isLinear ? 1 : 0,
              borderWidth: isLinear ? 1 : 0
            }
          ]}
        >
          <LinearGradient
            colors={insetsColors}
            start={{ x: 0.37, y: 0 }} // Approximate normalized values for 283 degrees
            end={{ x: 0.63, y: 1 }}
            style={[
              $innerGradient,
              {
                paddingLeft: hasPad ? 2 : 0,
                paddingRight: hasPad ? 8 : 0
              }
            ]}
          >
            {theme === 'minus' ? (
              <Icon icon="credit_minus" size={size}></Icon>
            ) : null}
            {theme === 'plus' ? (
              <Icon icon="credit_plus" size={size}></Icon>
            ) : null}
            <Text style={[$change, $customTextStyle]}>{text}</Text>
            {extraText !== text && extraText && (
              <View style={[$flexCenter]}>
                <Text
                  style={[$change, $changeExtra, $customExtraTextStyle]}
                  onLayout={(e: LayoutChangeEvent) => {
                    setExtraLineWidth(e.nativeEvent.layout.width);
                  }}
                >
                  {extraText}
                </Text>
                <View
                  style={[
                    {
                      position: 'absolute',
                      width: extraLineWidth,
                      height: 1,
                      backgroundColor:
                        $customExtraTextStyle?.color ||
                        'rgba(255, 255, 255, 0.50)'
                    }
                  ]}
                ></View>
              </View>
            )}
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
}

const $gradient: ViewStyle = {
  borderRadius: 100
};

const $cas: ViewStyle = {
  borderRadius: 100,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
};

const $innerGradient: ViewStyle = {
  flex: 1,
  borderRadius: 95,
  alignItems: 'center',
  flexDirection: 'row',
  zIndex: $Z_INDEXES.z20
};

const $change: TextStyle = {
  fontFamily: typography.fonts.baba.bold,
  fontSize: 16,
  fontWeight: '800',
  lineHeight: 22,
  marginLeft: 4,
  color: '#fff'
};

const $changeExtra: TextStyle = {
  fontFamily: typography.fonts.baba.bold,
  fontSize: 16,
  fontWeight: '800',
  lineHeight: 22,
  marginLeft: 4,
  color: 'rgba(255, 255, 255, 0.50)',
  textDecorationColor: 'rgba(255, 255, 255, 0.50)'
};
