import { ImageStyle, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from '@/src/utils';
import { Icon } from '@Components/icons';
import { PrimaryButton, PrimaryButtonProps } from '@Components/primaryButton';
import { Text } from '@Components/text';

const BUTTON_HEIGHT = 36;
const BUTTON_WIDTH = 114;

export function TakePhotoButton(props: PrimaryButtonProps) {
  return (
    <PrimaryButton
      useDp2px={false}
      {...props}
      style={{ ...st.$wrap, ...props.style }}
      width={Number(props.style?.width) || BUTTON_WIDTH}
      height={Number(props.style?.height) || BUTTON_HEIGHT}
    >
      <View
        style={[
          st.$buttonContent,
          { width: props.style?.width, height: props.style?.height }
        ]}
      >
        <Icon icon="takephoto"></Icon>
        <Text style={st.$text}>拍同款</Text>
      </View>
    </PrimaryButton>
  );
}

const st: Record<string, ViewStyle | TextStyle | ImageStyle> = {
  $wrap: {
    backgroundColor: StyleSheet.currentColors.brand2,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    ...StyleSheet.circleStyle
  },
  $buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3
  },
  $buttonTextWrap: {
    ...StyleSheet.rowStyle,
    position: 'absolute',
    top: 1,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7E20'
  },
  $text: {
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 14,
    color: StyleSheet.currentColors.white
  }
};
