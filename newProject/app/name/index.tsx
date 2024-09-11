import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Icon, Screen, Text, showToast } from '@/src/components';
import { useAppStore } from '@/src/store/app';
import { CommonColor } from '@/src/theme/colors/common';
import { StyleSheet } from '@Utils/StyleSheet';
import {
  UpdateUserInfoReq,
  UserProfile
} from '@step.ai/proto-gen/raccoon/uinfo/uinfo_pb';

interface EditButtonProps {
  disabled: boolean;
  name: string;
}
const $editButtonStyle: TextStyle = {
  color: StyleSheet.currentColors.brand1,
  fontSize: 16,
  fontWeight: '500'
};
const $inputStyle: TextStyle = {
  width: '100%',
  height: 50,
  paddingLeft: 16,
  paddingRight: 40,
  borderRadius: 8,
  backgroundColor: '#F5F5F5',
  fontSize: 14,
  fontWeight: '500',
  color: StyleSheet.currentColors.black
};
function EditButton(props: EditButtonProps) {
  const nameRef = useRef('');
  useEffect(() => {
    nameRef.current = props.name;
  }, [props.name]);
  if (props.disabled) {
    return <Text style={[$editButtonStyle, { opacity: 0.5 }]}>保存</Text>;
  }
  return (
    <TouchableOpacity onPress={onUpdate}>
      <Text style={$editButtonStyle}>保存</Text>
    </TouchableOpacity>
  );

  function onUpdate() {
    useAppStore
      .getState()
      .updateUser({ name: nameRef.current })
      .then(() => {
        showToast('更新成功~');
        router.back();
      })
      .catch(e => {
        console.log(e);
        showToast('更新失败！');
      });
  }
}
export default function Name() {
  const [value, setValue] = useState('');
  const disabled = useMemo(() => {
    return !value.length || value.length > 20;
  }, [value]);

  useEffect(() => {
    setValue(useAppStore.getState().user?.name || '');
  }, []);

  return (
    <Screen
      title="编辑名字"
      headerStyle={{ margin: 0, padding: 0 }}
      headerRight={() => <EditButton disabled={disabled} name={value} />}
      screenStyle={{
        backgroundColor: CommonColor.white
      }}
    >
      <View style={{ position: 'relative', padding: 16 }}>
        <TextInput
          allowFontScaling={false}
          style={$inputStyle}
          autoFocus
          value={value}
          onChangeText={setValue}
        ></TextInput>
        <TouchableOpacity
          style={{ position: 'absolute', top: 34, right: 32 }}
          onPress={() => {
            setValue('');
          }}
        >
          <Icon icon="input_clear" size={18}></Icon>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
