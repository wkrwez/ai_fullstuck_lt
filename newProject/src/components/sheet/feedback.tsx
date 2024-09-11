import { FC, ReactNode, useState } from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/src/components/text';
import { colorsUI } from '@/src/theme';
import { Button } from '@Components/button';
import { showToast } from '@Components/toast';
import { SheetModal } from './SheetModal';

export interface IDislikeFeedbackModalProps {
  title?: string | ReactNode;
  visible: boolean;
  setVisible: (visible: IDislikeFeedbackModalProps['visible']) => void;
  onSubmit: (value: string) => Promise<boolean>;
}
const DislikeFeedbackModal: FC<IDislikeFeedbackModalProps> = props => {
  const { title, visible, setVisible, onSubmit } = props;
  const [selectedArr, setSelectArr] = useState<string[]>([]);
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const onClickSubmit = () => {
    setLoading(true);
    const result = JSON.stringify([
      ...selectedArr,
      ...(textValue ? [textValue] : [])
    ]);
    onSubmit(result)
      .then(result => {
        if (result) {
          setVisible(false);
          window.setTimeout(() => {
            showToast('反馈成功', 1500);
          }, 500);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const buttonConfig: Array<Array<{ text: string; preset: string }>> = [
    [
      { text: '语句不通', preset: 'outline' },
      { text: '逻辑混乱', preset: 'outline' }
    ],
    [
      { text: '过于复杂', preset: 'outline' },
      { text: '重复输出内容', preset: 'outline' }
    ]
  ];

  return (
    <SheetModal
      isVisible={visible}
      onClose={() => {
        setVisible(false);
      }}
      title={
        title ?? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Text
              size="lg"
              style={{
                color: colorsUI.Text.default.title,
                fontWeight: '500'
              }}
              numberOfLines={1}
            >
              😖 选择不喜欢的理由
            </Text>
          </View>
        )
      }
      keyboardAvoidingViewProps={{
        keyboardVerticalOffset: -1 * insets.bottom + 10
      }}
    >
      <View style={{ gap: 10 }}>
        {buttonConfig.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{ display: 'flex', flexDirection: 'row', gap: 10 }}
          >
            {row.map(button => (
              <Button
                key={button.text}
                style={
                  selectedArr?.includes(button.text)
                    ? $buttonActiveStyle
                    : $buttonStyle
                }
                preset={'outline'}
                onPress={() => {
                  setSelectArr(prev => {
                    return prev?.includes(button.text)
                      ? prev?.filter(item => item !== button.text)
                      : [...(prev ?? []), button.text];
                  });
                }}
              >
                <Text
                  style={
                    selectedArr?.includes(button.text)
                      ? $textActiveStyle
                      : $textStyle
                  }
                >
                  {button.text}
                </Text>
              </Button>
            ))}
          </View>
        ))}
        <TextInput
          allowFontScaling={false}
          style={$textInputStyle}
          placeholderTextColor={colorsUI.Text.default.subtlest}
          placeholder="请填写不喜欢的原因"
          multiline
          value={textValue}
          onChangeText={setTextValue}
        ></TextInput>
        <Button
          preset="primary"
          onPress={onClickSubmit}
          disabled={!selectedArr?.length && !textValue}
          loading={loading}
        >
          提交
        </Button>
      </View>
    </SheetModal>
  );
};
const $textInputStyle: TextStyle = {
  height: 110,
  borderColor: colorsUI.Border.default.default1,
  borderWidth: 0.5,
  borderRadius: 8,
  fontSize: 14,
  paddingHorizontal: 12,
  paddingTop: 12,
  marginBottom: 10
};

const $buttonActiveStyle: ViewStyle = {
  height: 45,
  borderWidth: 0.5,
  borderColor: colorsUI.Border.brand.default,
  backgroundColor: colorsUI.Background.blue.default,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
};

const $buttonStyle: ViewStyle = {
  height: 45,
  borderWidth: 0.5,
  borderColor: colorsUI.Border.default.default1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1
};

const $textStyle: TextStyle = {
  color: colorsUI.Text.default.title,
  fontSize: 14,
  height: 24,
  lineHeight: 24,
  display: 'flex',
  fontWeight: '500'
};

const $textActiveStyle: TextStyle = {
  color: colorsUI.Text.default.selected,
  fontSize: 14,
  height: 24,
  lineHeight: 24,
  display: 'flex',
  fontWeight: '500'
};

export { DislikeFeedbackModal };
