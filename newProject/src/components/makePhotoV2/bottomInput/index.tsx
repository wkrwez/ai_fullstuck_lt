import { useEffect, useMemo, useRef, useState } from 'react';
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
import { showToast } from '@/src/components';
import { useSafeAreaInsetsStyle } from '@/src/hooks/useSafeAreaInsetsStyle';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { isIos } from '@/src/utils';
import { Icon } from '@Components/icons';
import { Loading } from '@Components/promptLoading';
import { StyleSheet } from '@Utils/StyleSheet';
import { PromptType } from '../constant';
import { useShallow } from 'zustand/react/shallow';

const $inputWrap: ViewStyle = {
  // paddingLeft: 10,
  // paddingTop: 18,
  // paddingBottom: 0,
  // paddingRight: 10,
  padding: 12,
  position: 'absolute',
  backgroundColor: '#fff',
  width: '100%',
  // height: 300,
  bottom: 0,
  left: 0
};
const $inputStyle: TextStyle = {
  paddingTop: 18,
  paddingBottom: 18,
  paddingLeft: 24,
  paddingRight: 54,
  borderRadius: 30,
  color: StyleSheet.currentColors.black,
  fontSize: 16,
  fontWeight: '500',
  borderWidth: 0.5,
  borderColor: '#E0E0E0',
  shadowColor: '#0000001A',
  shadowOffset: {
    width: 3,
    height: 3
  },
  shadowRadius: 20
};

const $buttonStyle: ViewStyle = {
  position: 'absolute',
  top: 24,
  right: 16,
  backgroundColor: '#83A9C4',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 20,
  paddingRight: 20,
  borderRadius: 10
};

const $inputTag: ViewStyle = {
  ...StyleSheet.rowStyle,
  paddingHorizontal: 16,
  paddingVertical: 8,
  // paddingTop: 10,
  // paddingBottom: 10,
  // paddingLeft: 7,
  // paddingRight: 7,
  borderRadius: 500,
  borderWidth: 0.75,
  borderColor: StyleSheet.hex(StyleSheet.currentColors.black, 0.07),
  gap: 4
};

const $iputTagText: TextStyle = {
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
      <Text style={$iputTagText}>{props.text}</Text>
      <Icon icon="up_arrow" size={10} />
    </TouchableOpacity>
  );

  function onPress() {
    props.onSelect(props.text);
  }
}

const PLACE_TEXT = {
  [PromptType.expression]: '#表情',
  [PromptType.action]: '#动作',
  [PromptType.cloth]: '#服饰',
  [PromptType.scene]: '#场景',
  [PromptType.addition]: '#自由发挥'
};
interface BottomInputProps {
  onSubmit: (value: string) => void;
  onClose: () => void;
}
export function BottomInput(props: BottomInputProps) {
  const $containerInsets = useSafeAreaInsetsStyle(['top', 'bottom']);
  const inputRef = useRef<TextInput>(null);
  const loadingRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { cachePrompts, inputType } = useMakePhotoStoreV2(
    useShallow(state => ({
      cachePrompts: state.cachePrompts,
      inputType: state.inputType
    }))
  );

  const recList = useMemo(() => {
    console.log('recList', inputType, cachePrompts);
    if (!inputType) return [];
    return cachePrompts[inputType];
  }, [inputType && cachePrompts[inputType]]);

  useEffect(() => {
    const defaultInputText = useMakePhotoStoreV2.getState().defaultInputText;
    if (defaultInputText) {
      setText(defaultInputText);
    }
    setTimeout(
      () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      Platform.OS === 'ios' ? 30 : 300
    );
  }, []);

  //   return null;
  return (
    <Modal visible={true} transparent>
      <KeyboardAvoidingView
        behavior={isIos ? 'height' : 'padding'}
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
            onPress={() => {
              props.onClose();
            }}
          ></Pressable>
          <View
            style={[
              { position: 'relative' },
              $inputWrap
              // { paddingBottom: $containerInsets.paddingBottom }
            ]}
          >
            <ScrollView
              horizontal={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              keyboardShouldPersistTaps="always"
            >
              <View style={[StyleSheet.rowStyle, { padding: 7, gap: 8 }]}>
                {recList?.map(item => (
                  <InputTag
                    key={item}
                    text={item}
                    onSelect={t => {
                      // setText(text + t);
                      onSubmit(t);
                    }}
                  />
                ))}
                {loading && <Loading style={{ opacity: 0.5 }} />}
              </View>
            </ScrollView>
            <TextInput
              style={$inputStyle}
              allowFontScaling={false}
              returnKeyType="send"
              numberOfLines={1}
              enablesReturnKeyAutomatically
              ref={inputRef}
              value={text}
              onChangeText={text => {
                setText(text);
              }}
              placeholder={PLACE_TEXT[inputType || PromptType.addition]}
              onSubmitEditing={() => onSubmit()}
            ></TextInput>
            {text && (
              <TouchableOpacity onPressIn={() => onSubmit()}>
                <Icon
                  icon="makephoto_submit"
                  size={24}
                  style={{ position: 'absolute', bottom: 16, right: 20 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      </KeyboardAvoidingView>
    </Modal>
  );

  function onSubmit(inputText?: string) {
    if (!inputType) return;
    const t = inputText || text;
    if (!t.length) {
      showToast('请输入补充文本');
      return;
    }
    inputRef.current?.blur();
    const {
      additionPrompts,
      additionPrompts2,
      selectedRoleIndex,
      defaultInputText
    } = useMakePhotoStoreV2.getState();
    const currentAdditionPrompts =
      selectedRoleIndex === 0 ? additionPrompts : additionPrompts2;
    if (
      inputType === PromptType.addition &&
      currentAdditionPrompts.length >= 5 &&
      !defaultInputText
    ) {
      showToast('最多添加5个细节~');
      return;
    }

    useMakePhotoStoreV2.getState().addPrompt(inputType, {
      type: 'custom',
      text: t,
      remove: defaultInputText
    });
    props.onClose();
    // props.onSubmit(text);
    // const val = inputRef.current.v;
  }

  function onMomentumScrollEnd() {
    if (!inputType) return;
    if (debounceRef.current) {
      return;
    }
    debounceRef.current = setTimeout(() => {
      debounceRef.current = undefined;
    }, 300);
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    useMakePhotoStoreV2
      .getState()
      .getPrompt(inputType)
      .then(() => {
        loadingRef.current = false;
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        loadingRef.current = false;
        setLoading(false);
      });
  }
}
