import { MutableRefObject, forwardRef } from 'react';
import {
  Image,
  ImageBackground,
  ImageStyle,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, showToast } from '@/src/components';
import { colors, typography } from '@/src/theme';
import { $flexHCenter } from '@/src/theme/variable';
import { isIos } from '@/src/utils';
import { StyleSheet, createStyle } from '@Utils/StyleSheet';
import { parallelWorldColors } from '../../_constants';
import InfoCard from '../info-card';
import LinearGradientCard from '../others/linear-gradient-card';
import ParallelWorldButton from '../others/parallel-world-button';

const MAX_INPUT_LENGTH = 500;

interface GenDescModalProps {
  isVisible: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
}

const DescTag = ({ text }: { text: string }) => {
  return (
    <View style={tagStyles.$tag}>
      <Icon icon="icon_edit_pw_grey" size={12} />
      <Text style={tagStyles.$tagText}>{text}</Text>
    </View>
  );
};

const ImgGenDescModal = forwardRef(
  (
    {
      isVisible,
      onClose,
      value,
      onFocus,
      onChange,
      onSubmit
    }: GenDescModalProps,
    inputRef
  ) => {
    return (
      <Modal visible={isVisible} onRequestClose={onClose} transparent>
        <KeyboardAvoidingView
          behavior={isIos ? 'height' : undefined}
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: 100
            }
          ]}
        >
          <View style={modalStyle.$modal}>
            <View onTouchStart={onClose} style={modalStyle.$placeholder}></View>
            <View style={modalStyle.$inputWrap}>
              <LinearGradientCard style={{ marginBottom: 50 }}>
                <View
                  style={{
                    height: 205,
                    paddingHorizontal: 15,
                    paddingVertical: 12,
                    gap: 24
                  }}
                >
                  <View style={{ alignItems: 'center' }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: colors.white
                      }}
                    >
                      生图描述
                    </Text>
                  </View>
                  <TextInput
                    allowFontScaling={false}
                    ref={inputRef as MutableRefObject<TextInput>}
                    returnKeyType="send"
                    placeholder="小狸在等你们说点什么呢~"
                    style={modalStyle.$input}
                    selectionColor={parallelWorldColors.fontGlow}
                    placeholderTextColor="rgba(127, 217, 255, 0.6)"
                    value={value}
                    onLayout={onFocus}
                    onChangeText={onChange}
                    onSubmitEditing={() => {
                      onSubmit();
                    }}
                    returnKeyLabel="发送"
                    multiline
                    enablesReturnKeyAutomatically
                    maxLength={500}
                    onKeyPress={({ nativeEvent: { key } }) => {
                      if (
                        key !== 'Backspace' &&
                        value.length >= MAX_INPUT_LENGTH
                      ) {
                        showToast('评论文字已达到上限500字');
                      }
                    }}
                  />
                  <View style={{ ...$flexHCenter, gap: 12 }}>
                    <ParallelWorldButton
                      onPress={onClose}
                      title="取消"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: parallelWorldColors.fontGlow,
                        borderWidth: 1,
                        width: 134
                      }}
                    />
                    <ParallelWorldButton
                      title="保存并重新生图"
                      disabled={!value}
                      onPress={onSubmit}
                      style={{
                        flex: 1,
                        backgroundColor: 'rgba(127, 217, 255, 1)',
                        width: 134,
                        paddingHorizontal: 0
                      }}
                    />
                  </View>
                </View>
              </LinearGradientCard>
            </View>
            {/* <View
              style={{
                ...$flexHCenter,
                height: 48,
                backgroundColor: colors.white,
                paddingHorizontal: 8,
                gap: 8
              }}
            >
              <DescTag text="sss" />
              <DescTag text="sss" />
            </View> */}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default ImgGenDescModal;

const modalStyle = createStyle({
  $modal: {
    width: '100%',
    height: '100%',
    zIndex: 100,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  $placeholder: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    height: '100%'
  },

  $inputWrap: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    padding: 24
  },
  $input: {
    fontSize: 18,
    color: parallelWorldColors.fontGlow,
    fontFamily: typography.fonts.world,
    fontWeight: '400',
    flex: 1
  }
});

const tagStyles = createStyle({
  $tag: {
    ...$flexHCenter,
    borderRadius: 16,
    borderWidth: 1,
    padding: 10,
    borderColor: 'rgba(211, 224, 232, 0.18)',
    backgroundColor: '#FDFDFD',
    gap: 4
  },
  $tagText: {
    fontSize: 12,
    color: '#565F68',
    fontWeight: '500'
  }
});
