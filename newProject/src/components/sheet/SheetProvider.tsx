//封装成和Modal一样的接口
import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Keyboard, View } from 'react-native';
import { spacing } from '@/src/theme';
import { Button } from '@Components/button';
import { startListeningRoutingRequest } from '@step.ai/navigator-module';
import { SheetModal } from './SheetModal';
import { ConfirmSheetConfig, SheetConfig, SheetContextProps } from './type';

export const SheetContext = createContext<SheetContextProps | undefined>(
  undefined
);

export const SheetProvider = ({ children }: { children: ReactNode }) => {
  const [sheetConfig, setSheetConfig] = useState<
    SheetConfig & { isVisible: boolean; sheetContent: React.ReactNode | null }
  >({
    isVisible: false,
    title: '',
    titleStyle: {},
    titleBarStyle: {},
    content: () => <></>,
    sheetContent: null,
    keyboardAvoidingViewProps: undefined,
    childrenPadding: true
  });

  const close: () => void = useCallback(() => {
    Keyboard.dismiss();
    setSheetConfig({
      isVisible: false,
      title: '',
      titleStyle: {},
      content: () => <></>,
      sheetContent: null,
      keyboardAvoidingViewProps: undefined
    });
  }, []);

  // 完全自定义痰喘
  const showSheet: (config: SheetConfig) => void = useCallback(
    config => {
      setSheetConfig({
        content: () => <></>,
        isVisible: true,
        titleStyle: config.titleStyle || {},
        titleBarStyle: config.titleBarStyle || {},
        title: config.title,
        closeBtn: config.closeBtn,
        maskClosable: config.maskClosable ?? true,
        sheetContent: config.content({ close }),
        keyboardAvoidingViewProps: config.keyboardAvoidingViewProps,
        childrenPadding: config.childrenPadding
      });
    },
    [close]
  );
  // // Example:
  // showConfirmSheet({
  //   title: '放弃编辑?',
  //   content: () => {
  //     return <Text>您的修改将会丢失</Text>;
  //   },
  //   onConfirm(close) {
  //     close(); //关闭半屏
  //   },
  // });
  const showConfirmSheet: (config: ConfirmSheetConfig) => void = useCallback(
    config => {
      showSheet({
        ...config,
        content: (...args) => {
          return (
            <>
              {config.content(...args)}
              <View
                key={0}
                style={{
                  flexDirection: 'row',
                  marginTop: spacing.lg,
                  marginBottom: spacing.sm,
                  justifyContent: 'space-between'
                }}
              >
                <Button
                  text="取消"
                  style={{ flex: 1, marginRight: spacing.xs }}
                  {...config.cancelButtonProps}
                  onPress={async () => {
                    if (config.onCancel) await config.onCancel({ close });
                    else close();
                  }}
                />
                <Button
                  preset="primary"
                  text="确认"
                  style={{ flex: 1, marginLeft: spacing.xs }}
                  {...config.confirmButtonProps}
                  onPress={async () => {
                    if (config.onConfirm) await config.onConfirm({ close });
                    else close();
                  }}
                />
              </View>
            </>
          );
        }
      });
    },
    [close]
  );

  const value = useMemo(() => {
    return { showConfirmSheet, showSheet };
  }, [showSheet, showConfirmSheet]);

  useEffect(() => {
    startListeningRoutingRequest();
  }, []);

  return (
    <SheetContext.Provider value={value}>
      {children}
      <SheetModal
        isVisible={sheetConfig.isVisible}
        onClose={close}
        title={sheetConfig.title}
        closeBtn={sheetConfig.closeBtn}
        titleStyle={sheetConfig.titleStyle}
        titleBarStyle={sheetConfig.titleBarStyle}
        maskClosable={sheetConfig.maskClosable}
        keyboardAvoidingViewProps={sheetConfig.keyboardAvoidingViewProps}
        childrenPadding={sheetConfig.childrenPadding}
      >
        {sheetConfig.sheetContent}
      </SheetModal>
    </SheetContext.Provider>
  );
};
