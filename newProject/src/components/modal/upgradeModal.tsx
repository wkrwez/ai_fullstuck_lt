import { ImageBackground, TextStyle, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Image, ImageStyle } from '@/src/components/image';
import { useAppUpdateInfoModal } from '@/src/hooks/useCheckUpdate';
import { colors, colorsUI, spacing, typography } from '@/src/theme';
import { dp2px } from '@/src/utils';
import { Button } from '@Components/button';
import { Text } from '@Components/text';
import { UpdateStatus } from '@/proto-registry/src/web/raccoon/appinfo/common_pb';
import { BaseModal } from './index';

export const UPDATE_MODAL_IMAGE = require('@Assets/image/lipu-selfie.png');
export const UPDATE_MODAL_BG = require('@Assets/image/lipu-modal-bg.png');

export const UpgradeModal = () => {
  const {
    goToUpdate,
    onClose,
    isVisible,
    versionNumText,
    releaseNotes,
    updateInfo
  } = useAppUpdateInfoModal();

  const isForceUpdate = updateInfo?.forceUpdate === UpdateStatus.FORCE;

  const renderUpdateTip = () => {
    if (isForceUpdate) {
      return (
        <Text style={$TipTextStyle}>
          小狸发现你版本过低，为了更优的体验，请先更新!
        </Text>
      );
    } else if (releaseNotes.length) {
      return (
        <ScrollView style={$TipListStyle} showsVerticalScrollIndicator={false}>
          {releaseNotes.map(text => (
            <View style={$listItemStyle}>
              <View style={$listDotStyle}></View>
              <View style={$listTextWrapperStyle}>
                <Text style={$listTextStyle}>{text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return (
        <Text style={$TipTextStyle}>
          小狸进行了一波升级，为你带来更好的使用体验
        </Text>
      );
    }
  };

  return (
    <BaseModal
      isVisible={isVisible}
      showMask={true}
      containerStyle={$containerStyle}
    >
      <ImageBackground
        source={UPDATE_MODAL_BG}
        style={$modalBodyStyle}
        imageStyle={$modalBodyBgStyle}
      >
        <Image source={UPDATE_MODAL_IMAGE} style={$logoImageStyle} />
        <Text style={$titleStyle}>
          {isForceUpdate ? '小狸发现新版本' : '小狸发现新版本，快来更新！'}
        </Text>
        <View style={$versionStyle}>
          <Text style={$versionTextStyle}>{versionNumText}</Text>
        </View>
        <View style={$listContainerStyle}>{renderUpdateTip()}</View>
        <Button
          preset="middle"
          style={$bottomBtn}
          textStyle={{
            color: '#FFF',
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 20
          }}
          onPress={goToUpdate}
        >
          立即更新
        </Button>
        {!isForceUpdate ? (
          <Button
            preset="text"
            style={$bottomTextBtn}
            textStyle={{
              color: colorsUI.Text.default.subtle,
              fontSize: 13,
              fontWeight: '400',
              lineHeight: 20
            }}
            onPress={onClose}
          >
            稍后更新
          </Button>
        ) : null}
      </ImageBackground>
    </BaseModal>
  );
};

const $containerStyle: ViewStyle = {
  padding: 0,
  paddingBottom: 0,
  minHeight: 0
};

const $modalBodyStyle: ViewStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 10,
  backgroundColor: '#FFFFFD',
  padding: 20,
  position: 'relative'
};

const $modalBodyBgStyle: ImageStyle = {
  resizeMode: 'contain',
  height: dp2px(84),
  width: dp2px(245),
  position: 'absolute',
  top: 'auto'
};

const $titleStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: colorsUI.Text.default.title,
  marginTop: spacing.xs,
  textAlign: 'center'
};

const $versionStyle: ViewStyle = {
  borderRadius: 10,
  backgroundColor: colorsUI.Background.orange.default,
  paddingHorizontal: 8,
  paddingVertical: 3,
  marginTop: spacing.xs
};

const $versionTextStyle: TextStyle = {
  fontFamily: typography.fonts.campton,
  fontWeight: '700',
  lineHeight: 17,
  fontSize: 12,
  color: colors.themeGround
};

const $logoImageStyle: ImageStyle = {
  position: 'relative',
  bottom: 64,
  width: 88,
  height: 83,
  marginBottom: -64
};

const $listContainerStyle: ViewStyle = {
  marginTop: spacing.md,
  width: '100%'
};

const commonTipStyle: TextStyle = {
  color: colorsUI.Text.default.subtle,
  fontSize: 12,
  fontWeight: '500',
  lineHeight: 20
};

const $listItemStyle: TextStyle = {
  paddingHorizontal: spacing.xs,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start'
};

const $listDotStyle: ViewStyle = {
  width: 4,
  height: 4,
  borderRadius: 8,
  backgroundColor: colorsUI.Text.default.subtle,
  marginTop: 8
};

const $listTextWrapperStyle: TextStyle = {
  marginLeft: 8
};

const $listTextStyle: TextStyle = {
  ...commonTipStyle
};

const $TipTextStyle: TextStyle = {
  ...commonTipStyle,
  textAlign: 'center'
};

const $TipListStyle: TextStyle = {
  width: '100%',
  maxHeight: 160
};

const $bottomBtn: ViewStyle = {
  marginTop: spacing.lg,
  width: '100%',
  height: 36,
  borderRadius: 36
};

const $bottomTextBtn: ViewStyle = {
  paddingVertical: 0,
  height: 'auto',
  marginTop: spacing.xxs,
  marginBottom: -3
};
