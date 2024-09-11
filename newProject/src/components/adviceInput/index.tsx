import { useDebounceFn } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { isIos } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Loading } from '@Components/promptLoading';
import { StyleSheet } from '@Utils/StyleSheet';
import { showToast } from '../toast';

const $inputWrap: ViewStyle = {
  paddingHorizontal: 12,
  paddingVertical: 10,
  position: 'absolute',
  gap: 12,
  backgroundColor: '#fff',
  width: '100%',
  bottom: 0,
  left: 0
};
const $inputStyle: TextStyle = {
  flex: 1,
  paddingLeft: 18,
  color: StyleSheet.currentColors.black,
  fontSize: 16,
  fontWeight: '500'
};

const $inputTag: ViewStyle = {
  ...StyleSheet.rowStyle,
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 500,
  borderWidth: 0.75,
  borderColor: 'rgba(0, 0, 0, 0.07)',
  gap: 4
};

const $inputTagText: TextStyle = {
  color: StyleSheet.currentColors.black,
  fontWeight: '500',
  fontSize: 14
};

interface InputTagProps {
  text: string;
  onSelect: (text: string) => void;
}
function InputTag(props: InputTagProps) {
  return (
    <TouchableOpacity style={$inputTag} onPress={onPress}>
      <Text style={$inputTagText}>{props.text}</Text>
      <Icon icon="up_arrow" size={10} />
    </TouchableOpacity>
  );

  function onPress() {
    props.onSelect(props.text);
  }
}

export type AdviceItem = {
  text: string;
};
interface AdviceInputProps {
  visible: boolean;
  value: string;
  maxLength?: number;
  adviceList: AdviceItem[];
  getAdvice: () => Promise<void>;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onSelect: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
}
export function AdviceInput(props: AdviceInputProps) {
  const {
    visible = false,
    adviceList,
    maxLength = 20,
    getAdvice,
    onSubmit,
    onSelect,
    value,
    onChange,
    onClose
  } = props;

  const inputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);
  const handleSelect = (text: string) => {
    if (text) {
      onSelect(text);
    }
  };
  const handleSubmit = () => {
    if (value) {
      onSubmit(value);
    }
  };

  const { run: loadAdvice } = useDebounceFn(
    async () => {
      try {
        await getAdvice();
      } finally {
        setLoading(false);
      }
    },
    { wait: 300 }
  );

  const onMomentumScrollEnd = () => {
    if (loading) return;
    setLoading(true);
    loadAdvice();
  };

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (!adviceList.length) {
      getAdvice();
    }
    inputRef.current?.blur();
    setTimeout(
      () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      Platform.OS === 'ios' ? 30 : 300
    );
  }, [visible]);

  return (
    <Modal visible={visible} transparent>
      <KeyboardAvoidingView
        behavior={isIos ? 'height' : undefined}
        style={[
          StyleSheet.absoluteFill,
          {
            zIndex: 100
          }
        ]}
      >
        <>
          <Pressable
            style={[StyleSheet.absoluteFill]}
            onPress={onClose}
          ></Pressable>
          <View style={[$inputWrap]}>
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              keyboardShouldPersistTaps="always"
            >
              <View style={[StyleSheet.rowStyle, { gap: 8 }]}>
                {adviceList?.map((item, index) => (
                  <InputTag
                    key={item.text + index}
                    text={item.text}
                    onSelect={handleSelect}
                  />
                ))}
                {loading && <Loading style={{ opacity: 0.5 }} />}
              </View>
            </ScrollView>
            <View
              style={{
                borderColor: StyleSheet.hex(
                  StyleSheet.currentColors.black,
                  0.07
                ),
                borderWidth: 0.5,
                shadowColor: '#0000001A',
                shadowOffset: {
                  width: 3,
                  height: 3
                },
                borderRadius: 30,
                shadowRadius: 20,
                height: 44,
                width: '100%',
                flexDirection: 'row'
              }}
            >
              <TextInput
                style={$inputStyle}
                allowFontScaling={false}
                returnKeyType="send"
                numberOfLines={1}
                enablesReturnKeyAutomatically
                ref={inputRef}
                value={value}
                onChangeText={text => {
                  // if (text.length <= maxLength) {
                  onChange(text);
                  // } else {
                  // 处理超长文本
                  // onChange(text.slice(0, maxLength));
                  // }
                }}
                placeholder={props.placeholder || '请输入…'}
                onSubmitEditing={() => handleSubmit()}
                // onKeyPress={({ nativeEvent: { key } }) => {
                //   if (key !== 'Backspace' && value.length >= maxLength) {
                //     showToast(`文字已达到上限${maxLength}字`);
                //   }
                // }}
                maxLength={maxLength}
              ></TextInput>

              {value && (
                <TouchableOpacity onPressIn={() => handleSubmit()}>
                  <View
                    style={{
                      height: '100%',
                      aspectRatio: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Icon icon="makephoto_submit" size={24} />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      </KeyboardAvoidingView>
    </Modal>
  );
}
