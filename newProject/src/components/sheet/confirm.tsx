import { FC, ReactNode, useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { spacing } from '@/src/theme';
import { Button, ButtonProps } from '@Components/button';
import { SheetModal } from './SheetModal';
import { SheetModalProps } from './type';

export interface IConfirmSheetModalProps extends SheetModalProps {
  title: string | ReactNode;
  content?: ReactNode;
  cancelButtonProps?: ButtonProps;
  confirmButtonProps?: ButtonProps;
  onCancel?: (props: { close: () => void }) => void;
  onConfirm?: (props: { close: () => void }) => void;
  confirmBtnStyle?: ViewStyle;
}
export const ConfirmSheetModal: FC<IConfirmSheetModalProps> = props => {
  const {
    // children,
    cancelButtonProps,
    onCancel,
    onConfirm,
    confirmButtonProps,
    content,
    ...rest
  } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);

  return (
    <SheetModal {...rest}>
      <View
        style={{
          backgroundColor: '#ffffff',
          padding: spacing.lg,
          paddingBottom: 0,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderWidth: 1,
          borderColor: '#eeeeee'
        }}
      >
        {content}
        <View
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
            {...cancelButtonProps}
            onPress={async () => {
              if (onCancel) await onCancel({ close: rest.onClose });
              else rest.onClose();
            }}
          />
          <Button
            preset="primary"
            text="确认"
            style={{ flex: 1, marginLeft: spacing.xs }}
            {...confirmButtonProps}
            loading={confirmLoading}
            onPress={() => {
              if (onConfirm) {
                const result = onConfirm({ close: rest.onClose }) as unknown;
                if (result instanceof Promise) {
                  setConfirmLoading(true);
                  result.finally(() => setConfirmLoading(false));
                  return;
                }
              }
              rest.onClose();
            }}
          />
        </View>
      </View>
    </SheetModal>
  );
};
