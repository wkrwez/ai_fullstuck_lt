import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  View
} from 'react-native';
import { showToast } from '@/src/components';
import { selectState } from '@/src/store/_utils';
import { useParallelWorldConsumerStore } from '@/src/store/parallel-world-consumer';
import { colors } from '@/src/theme';
import { isIos } from '@/src/utils';
import { StyleSheet, createStyle } from '@Utils/StyleSheet';
import { parallelWorldColors } from '../../_constants';
import { abstractActStoryText, getAllActItemsText } from '../gen-card';
import InfoCard from '../info-card';
import {
  ActDialog,
  ActItem,
  ActStory,
  WorldAct
} from '@/proto-registry/src/web/raccoon/world/common_pb';
import { ActType } from '@/proto-registry/src/web/raccoon/world/common_pb';
import { useShallow } from 'zustand/react/shallow';

const TextEditModal = ({ isVisible }: { isVisible: boolean }) => {
  const { textEditAct, changeEditableActs, closeTextEditModal, editableActs } =
    useParallelWorldConsumerStore(
      useShallow(state =>
        selectState(state, [
          'textEditAct',
          'changeEditableActs',
          'closeTextEditModal',
          'editableActs'
        ])
      )
    );

  // 创建一个 ref 数组来存储所有 TextInput 的引用
  const textInputRefs = useRef<TextInput[]>([]);

  // 将引用添加到 ref 数组
  const addToRef = (ref: TextInput) => {
    if (ref && !textInputRefs.current.includes(ref)) {
      textInputRefs.current.push(ref);
    }
  };

  // 定义一个方法来让特定的 TextInput 获得焦点
  const focusTextInput = (index: number) => {
    textInputRefs.current[index]?.focus();
  };

  // 编辑逻辑
  const [inEditItems, setInEditItems] = useState<(ActItem | null)[]>([]);

  const handleTextChange = (text: string, index: number) => {
    let newInEditItems = [...inEditItems];
    if (
      newInEditItems[index]?.item.case === 'story' ||
      newInEditItems[index]?.item.case === 'dialog'
    ) {
      if (text === '') {
        if (newInEditItems.length > 1) {
          console.log('0');
          setInEditItems(newInEditItems.filter((_, i) => i !== index));
          focusTextInput(index - 1);
        } else {
          newInEditItems[index] = produce(
            { ...newInEditItems[index] },
            draft => {
              draft.type = ActType.Story;
              draft.item.case = 'story';
              draft.item.value.text = '';
            }
          );
          setInEditItems(newInEditItems);
        }
      } else {
        newInEditItems[index] = produce({ ...newInEditItems[index] }, draft => {
          draft.item.value.text = text;
        });

        setInEditItems(newInEditItems);
      }
    }
  };

  // 提交编辑
  const submitTextChange = () => {
    const newActs = editableActs.map(act => {
      if (act?.actIndex === textEditAct?.actIndex) {
        return {
          ...textEditAct,
          actItems: [...inEditItems]
        };
      } else {
        return act;
      }
    }) as WorldAct[];
    changeEditableActs(newActs);
  };

  const handleClose = () => {
    closeTextEditModal();
    submitTextChange();
  };

  useEffect(() => {
    setInEditItems([...(textEditAct?.actItems ?? [])] ?? []);
  }, [textEditAct?.actItems]);

  return (
    <Modal visible={isVisible} onRequestClose={handleClose} transparent>
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
          <View
            onTouchStart={handleClose}
            style={modalStyle.$placeholder}
          ></View>
          <InfoCard
            cardStyle={{ backgroundColor: colors.white }}
            isBgPicVisible={false}
          >
            <View style={modalStyle.$inputWrap}>
              {inEditItems.map((item, index) => {
                if (
                  item?.item.case === 'dialog' ||
                  item?.item.case === 'story'
                ) {
                  return (
                    <TextInput
                      allowFontScaling={false}
                      key={index}
                      multiline={true}
                      ref={ref => addToRef(ref as TextInput)}
                      style={[
                        modalStyle.$input,
                        item?.item.case === 'dialog'
                          ? { color: parallelWorldColors.fontGlow }
                          : {}
                      ]}
                      onLayout={() => {
                        if (
                          textInputRefs.current?.length &&
                          index === inEditItems.length - 1
                        ) {
                          if (Platform.OS === 'ios') {
                            focusTextInput(index);
                          } else {
                            setTimeout(() => {
                              focusTextInput(index);
                            });
                          }
                        }
                      }}
                      // onKeyPress={({ nativeEvent: { key } }) => {
                      //   const allText = getAllActItemsText(
                      //     inEditItems as ActItem[],
                      //     '\n'
                      //   );

                      //   if (key !== 'Backspace' && allText.length >= 80) {
                      //     showToast('文字已达到上限80字');
                      //   }
                      // }}
                      value={item.item?.value?.text}
                      scrollEnabled={false}
                      onChangeText={text => {
                        const storyText = abstractActStoryText(
                          inEditItems as ActItem[]
                        );
                        const lines = text.split('\n');

                        const isAddText =
                          text.length >
                          (
                            inEditItems[index]?.item?.value as
                              | ActStory
                              | ActDialog
                          ).text.length;

                        if (storyText.length > 80 && isAddText) {
                          showToast('文字已达到上限80字');
                        } else if (
                          inEditItems.length + lines.length > 10 &&
                          isAddText
                        ) {
                          showToast('行数过多！');
                        } else {
                          handleTextChange(text, index);
                        }
                      }}
                      returnKeyLabel="确定"
                      enablesReturnKeyAutomatically
                      maxLength={80}
                    />
                  );
                }
              })}
            </View>
          </InfoCard>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default TextEditModal;

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
    paddingHorizontal: 16
  },
  $input: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black
  }
});
