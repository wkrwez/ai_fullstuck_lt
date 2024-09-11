import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { PressView } from '@/src/components/confirm/Press';
import { DEFAULT_SHEET_ZINDEX } from '@/src/constants';
import { darkSceneColor, lightSceneColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import { Image } from '@Components/image';
import { StyleSheet } from '@Utils/StyleSheet';
import { Portal } from '@gorhom/portal';

type Callbacks = {
  close: () => void;
};
// 定义props类型
interface ConfirmProps {
  theme?: Theme;
  isVisible?: boolean;
  title: string;
  image?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (callbacks: Callbacks) => void;
  onClose?: () => void;
  content?: React.ReactNode | string; // 允许传入任何React节点作为内容
  cancelTextStyle?: TextStyle;
  confirmTextStyle?: TextStyle;
  maskClose?: boolean; // 允许点击 mask 关闭
  modalStyle?: ViewStyle;
}

// 自定义弹窗组件
export function Confirm(props: ConfirmProps) {
  const [innerVisible, setInnerVisible] = useState(false);

  const themeConfig =
    props.theme === Theme.DARK ? darkSceneColor : lightSceneColor;

  useEffect(() => {
    if (props.isVisible) {
      setInnerVisible(true);
    } else {
      setInnerVisible(false);
    }
  }, [props.isVisible]);

  if (!innerVisible) {
    return null;
  }

  /** 按压 mask */
  const pressMask = () => {
    props.maskClose && props?.onClose?.();
  };

  return (
    <Portal>
      <View
        style={[
          StyleSheet.absoluteFill,
          { zIndex: DEFAULT_SHEET_ZINDEX + 4 },
          $confirmContainer
        ]}
      >
        <Pressable
          onPress={() => pressMask()}
          style={[
            StyleSheet.absoluteFill,
            { zIndex: DEFAULT_SHEET_ZINDEX + 5 },
            $confirmContainer
          ]}
        >
          <PressView>
            <View
              style={[
                $confirmModal,
                { backgroundColor: themeConfig.bg },
                props?.modalStyle || {}
              ]}
            >
              {/* 插图区域 */}
              {props.image && (
                <Image
                  style={{
                    width: 120,
                    height: 120,
                    position: 'absolute',
                    top: -36
                  }}
                  resizeMode={'cover'}
                  source={props.image}
                ></Image>
              )}

              {/*内容区域 */}
              <View
                style={[$modalContent, { marginTop: props.image ? 72 : 0 }]}
              >
                {props.title ? (
                  <Text
                    style={[
                      $confirmTitle,
                      {
                        color: themeConfig.fontColor
                      }
                    ]}
                  >
                    {props.title}
                  </Text>
                ) : null}
                {props.content ? (
                  typeof props.content === 'string' ? (
                    <Text
                      style={[
                        $confirmContent,
                        {
                          color: themeConfig.fontColor3
                        }
                      ]}
                    >
                      {props.content}
                    </Text>
                  ) : (
                    props.content
                  )
                ) : null}
              </View>

              {/* 按钮区域 */}
              <View
                style={[
                  StyleSheet.rowStyle,
                  $pressableOne,
                  {
                    justifyContent: 'space-between',
                    borderColor: themeConfig.border
                  }
                ]}
              >
                {/* todo 临时兼容，要改 */}
                {props.confirmText !== '' && (
                  <Pressable
                    style={[
                      $frontBtn,
                      { borderColor: themeConfig.border, flex: 1 }
                    ]}
                    onPress={() => {
                      if (props.onConfirm) {
                        props.onConfirm({ close: props.onClose || (() => {}) });
                      } else {
                        props.onClose && props.onClose();
                      }
                    }}
                  >
                    <Text
                      style={[
                        $buttonText,
                        { color: themeConfig.warningColor },
                        props.confirmTextStyle
                      ]}
                    >
                      {props.confirmText || '确定'}
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    console.log('onClose------->', props?.onClose);

                    props?.onClose?.();
                  }}
                  style={{ flex: 1 }}
                >
                  <Text
                    style={[
                      $buttonText,
                      { color: themeConfig.fontColor },
                      props.cancelTextStyle
                    ]}
                  >
                    {props.cancelText || '取消'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </PressView>
        </Pressable>
      </View>
    </Portal>
  );
}

export const CustomModalSingleton = {
  showConfirm(props: ConfirmProps) {},
  showImageConfirm(props: ConfirmProps) {},
  hideConfirm() {}
};

export const showConfirm = (props: ConfirmProps) =>
  CustomModalSingleton.showConfirm(props);
export const hideConfirm = () => CustomModalSingleton.hideConfirm();
export const showImageConfirm = (props: ConfirmProps) =>
  CustomModalSingleton.showImageConfirm(props);

export function ConfirmGlobal() {
  const [isVisible, setIsVisable] = useState(false);
  const [title, setTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmTextStyle, setConfirmTextStyle] = useState<TextStyle>({});
  const [cancelText, setCancelText] = useState('');
  const [cancelTextStyle, setCancelTextStyle] = useState<TextStyle>({});
  const [modalStyle, setModalStyle] = useState<ViewStyle>({});

  const [image, setImage] = useState('');
  const [maskClick, setMaskClick] = useState(false);
  const [theme, setTheme] = useState(Theme.LIGHT);
  const [content, setContent] = useState<ReactNode | string>('');
  const confirmCallback = useRef<(cb: Callbacks) => void>();
  const closeCallback = useRef<() => void>();

  useEffect(() => {
    const register = () => {
      CustomModalSingleton.showConfirm = ({
        title,
        content,
        confirmText,
        confirmTextStyle,
        cancelText,
        cancelTextStyle,
        onConfirm,
        onClose,
        theme,
        maskClose,
        modalStyle
      }) => {
        setIsVisable(true);
        setTitle(title || '');
        setContent(content || '');
        setConfirmText(confirmText || '');
        setCancelText(cancelText || '');
        setCancelTextStyle(cancelTextStyle || {});
        setConfirmTextStyle(confirmTextStyle || {});
        setModalStyle(modalStyle || {});

        // 清空图片
        setImage('');
        confirmCallback.current = onConfirm;
        closeCallback.current = onClose;
        setTheme(theme || Theme.LIGHT);
        maskClose && setMaskClick(true);
      };

      CustomModalSingleton.hideConfirm = () => {
        setIsVisable(false);
      };

      CustomModalSingleton.showImageConfirm = ({
        title,
        content,
        confirmText,
        confirmTextStyle,
        cancelText,
        cancelTextStyle,
        image,
        onConfirm
      }) => {
        setIsVisable(true);
        setTitle(title || '');
        setContent(content || '');
        setConfirmText(confirmText || '');
        setCancelText(cancelText || '');
        setCancelTextStyle(cancelTextStyle || {});
        setConfirmTextStyle(confirmTextStyle || {});
        setImage(image || '');
        confirmCallback.current = onConfirm;
        setTheme(theme || Theme.LIGHT);
      };
    };
    register();
  }, []);

  return (
    <Confirm
      content={content}
      title={title || ''}
      onConfirm={payload => {
        if (confirmCallback.current) {
          confirmCallback.current(payload);
        }
      }}
      image={image}
      confirmText={confirmText}
      cancelText={cancelText}
      cancelTextStyle={cancelTextStyle}
      confirmTextStyle={confirmTextStyle}
      isVisible={isVisible}
      onClose={() => {
        closeCallback?.current && closeCallback.current();
        setIsVisable(false);
      }}
      theme={theme}
      maskClose={maskClick}
      modalStyle={modalStyle}
    />
  );
}

const $confirmContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.2)'
};

const $confirmModal: ViewStyle = {
  width: 244,
  borderRadius: 15,
  alignItems: 'center',
  position: 'relative'
};

const $modalContent: ViewStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 30,
  paddingBottom: 24,
  width: '100%',
  position: 'relative'
};

const $confirmTitle: TextStyle = {
  textAlign: 'center',
  fontSize: 14,
  fontWeight: '600'
};

const $confirmContent: TextStyle = {
  textAlign: 'center',
  fontSize: 13,
  marginTop: 8,
  justifyContent: 'center',
  alignItems: 'center'
};

const $buttonText: TextStyle = {
  height: 44,
  lineHeight: 44,
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center'
};

const $frontBtn: ViewStyle = {
  borderRightWidth: 1
};

const $isNone: ViewStyle = {
  display: 'none'
};

// 单个按钮
const $pressableOne: ViewStyle = {
  height: 44,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopWidth: 0.5
};
