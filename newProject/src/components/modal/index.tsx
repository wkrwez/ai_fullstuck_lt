import { ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { DEFAULT_MODAL_ZINDEX } from '@/src/constants';
import { StyleSheet, dp2px } from '@/src/utils';
import { Text } from '@Components/text';
import { PrimaryButton } from '../primaryButton';
import { Portal } from '@gorhom/portal';

interface BaseModalProps {
  isVisible?: boolean;
  showMask?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  containerStyle?: ViewStyle;
  maskStyle?: ViewStyle;
  maskChildren?: ReactNode;
  zIndex?: number;
}

export function BaseModal({
  showMask = true,
  isVisible,
  onClose,
  children,
  containerStyle: $customContainerStyle,
  maskStyle: $customMaskStyle,
  maskChildren,
  zIndex
}: BaseModalProps) {
  const opacity = useSharedValue(0);
  const [innerVisible, setInnerVisible] = useState(false);
  const $maskStyleOverride = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, {
        duration: 300
      });
      setInnerVisible(true);
    } else {
      opacity.value = withTiming(
        0,
        {
          duration: 300
        },
        () => {
          console.log(11111);
          //   runOnJS(() => {
          //     setInnerVisible(false);
          //   })();
        }
      );
      const timer = setTimeout(() => {
        // todo
        setInnerVisible(false);
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible]);

  if (!innerVisible) {
    return null;
  }

  return (
    <Portal>
      <View
        style={[
          StyleSheet.absoluteFill,
          { zIndex: zIndex || DEFAULT_MODAL_ZINDEX },
          StyleSheet.centerStyle
        ]}
      >
        {showMask ? (
          <Pressable style={[StyleSheet.absoluteFill]} onPress={onClose}>
            <Animated.View
              style={[st.$maskStyle, $maskStyleOverride, $customMaskStyle]}
            >
              {maskChildren}
            </Animated.View>
          </Pressable>
        ) : null}
        <Animated.View
          style={[$maskStyleOverride, st.$wrap, $customContainerStyle]}
        >
          {children}
        </Animated.View>
      </View>
    </Portal>
  );
}

type Callbacks = {
  close: () => void;
};

type Cancels = {
  cancel: () => void;
};

interface ModalProps {
  zIndex?: number;
  isVisible?: boolean;
  title: string;
  content: string | ReactNode;
  confirmText: string;
  cancelText: string;
  onConfirm: (callbacks: Callbacks) => void;
  onCancel?: (cancels: Cancels) => void;
  onClose?: () => void;
}

export function Modal(props: ModalProps) {
  return (
    <BaseModal
      onClose={props.onClose}
      showMask={true}
      isVisible={props.isVisible}
      zIndex={props.zIndex}
    >
      <View style={st.$title}>
        <Text style={st.$titleText}>{props.title}</Text>
      </View>
      <View style={st.$content}>
        {typeof props.content === 'string' ? (
          <Text style={st.$contentText}>{props.content}</Text>
        ) : (
          props.content
        )}
      </View>
      <PrimaryButton
        width={205}
        height={36}
        style={st.$button}
        textStyle={st.$buttonText}
        onPress={() => {
          props.onConfirm({ close: props.onClose || (() => {}) });
        }}
      >
        {props.confirmText}
      </PrimaryButton>
      <TouchableOpacity onPress={props.onCancel || props.onClose}>
        <Text style={st.$cancelText}>{props.cancelText}</Text>
      </TouchableOpacity>
    </BaseModal>
  );

  function handleMaskPress() {}
}

export const ModalSingleton = {
  showModal(props: ModalProps) {},
  hideModal() {}
};

export function ModalGlobal() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<ReactNode>(null);
  const [confirmText, setConfirmText] = useState('');
  const [cancelText, setCancelText] = useState('');
  const [zIndex, setZIndex] = useState<number | undefined>();
  const confirmCallbackRef = useRef<(cb: Callbacks) => void>();
  const cancelCallbackRef = useRef<(cb: Cancels) => void>();

  useEffect(() => {
    const register = () => {
      ModalSingleton.showModal = ({
        title,
        content,
        confirmText,
        onConfirm,
        onCancel,
        cancelText,
        zIndex
      }) => {
        setModalVisible(true);
        setTitle(title);
        setContent(content);
        setConfirmText(confirmText);
        cancelCallbackRef.current = onCancel;
        confirmCallbackRef.current = onConfirm;
        setCancelText(cancelText);
        setZIndex(zIndex);
      };

      ModalSingleton.hideModal = () => {
        setModalVisible(false);
      };
    };
    register();
  }, []);
  return (
    <Modal
      title={title}
      content={content}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={payload => {
        if (confirmCallbackRef.current) {
          confirmCallbackRef.current(payload);
        }
      }}
      onCancel={num => {
        if (cancelCallbackRef.current) {
          cancelCallbackRef.current(num);
        }
        setModalVisible(false);
      }}
      onClose={() => {
        setModalVisible(false);
      }}
      isVisible={isModalVisible}
      // @linyueqiang 待整理zindex
      zIndex={zIndex}
    />
  );
}

const st = StyleSheet.create({
  $maskStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.4) // 先写死了
  },
  $wrap: {
    padding: 20,
    paddingBottom: 12,
    width: 245,
    minHeight: 208,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  $title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    color: StyleSheet.currentColors.titleGray
  },
  $titleText: {
    textAlign: 'center',
    fontSize: dp2px(14),
    fontWeight: '500',
    color: StyleSheet.currentColors.titleGray
  },
  $content: {
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 20,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54)
  },
  $contentText: {
    fontSize: 13,
    lineHeight: 20,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54),
    width: '100%'
  },
  $cancelText: {
    textAlign: 'center',
    fontSize: 13,
    color: StyleSheet.hex(StyleSheet.currentColors.black, 0.54),
    lineHeight: 20,
    marginTop: 12
  },
  $button: {
    width: 205,
    height: 36,
    borderRadius: 500
  },
  $buttonText: {
    width: 205,
    fontSize: 15,
    fontWeight: '600'
  }
});

export const showModal = (props: ModalProps) => ModalSingleton.showModal(props);
export const hideModal = () => ModalSingleton.hideModal();
