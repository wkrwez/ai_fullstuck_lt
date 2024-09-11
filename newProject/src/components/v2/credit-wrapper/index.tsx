import { Text, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { typography } from '@/src/theme';
import { $Z_INDEXES, $flex, $flexCenter } from '@/src/theme/variable';

interface ICreditWrapperProps {
  buttonContainer: React.ReactElement;
  cornerText?: string;
  cornerSize?: number;
  $cornerTextStyle?: TextStyle;
}

export default function CreditWrapper({
  buttonContainer,
  cornerText,
  cornerSize = 24,
  $cornerTextStyle
}: ICreditWrapperProps) {
  return (
    <View style={$wrapper}>
      {cornerText ? (
        <View style={[$flex, $flexCenter, $corner]}>
          <LinearGradient
            colors={['#FFC19C', '#FFE3CB']}
            start={{ x: 1, y: 0 }} // 起始点
            end={{ x: 0, y: 0 }} // 结束点
            style={$gradient}
          >
            <Text style={[$cornerText, $cornerTextStyle]}>{cornerText}</Text>
          </LinearGradient>
        </View>
      ) : null}
      {buttonContainer}
      <View
        style={[
          $creditWrapper,
          {
            transform: [
              {
                translateY: cornerSize + 12
              }
            ]
          }
        ]}
      ></View>
    </View>
  );
}

const $wrapper: ViewStyle = {
  width: 'auto',
  height: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
};

const $creditWrapper: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  alignItems: 'center'
};

const $corner: ViewStyle = {
  position: 'absolute',
  top: -12,
  right: 0,
  zIndex: $Z_INDEXES.z5
};

const $gradient: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 6,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 16,
  borderBottomRightRadius: 16,
  borderBottomLeftRadius: 4
};

const $cornerText: TextStyle = {
  fontFamily: typography.fonts.wishcard,
  color: '#543016',
  fontSize: 12,
  fontWeight: '400',
  lineHeight: 18,
  height: 21
};
