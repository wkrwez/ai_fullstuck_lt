import { useNavigation } from 'expo-router';
import { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { hideLoading, showLoading, showToast } from '@/src/components';
import { useAppStore } from '@/src/store/app';
import { showConfirm } from '@Components/confirm';
import { Screen } from '@Components/screen';
// import { useNavigation } from 'expo-router';
// import { UserMode } from "@step.ai/proto-gen/proto/user/v1/user_pb";
import { SettingGroup, SettingItem } from '@Components/setting';
import { Text } from '@Components/text';
import { StyleSheet } from '@Utils/StyleSheet';
import { CommonActions } from '@react-navigation/native';

const $settingGroup: ViewStyle = {
  borderRadius: 16,
  overflow: 'hidden',
  margin: 16,
  marginTop: 0
};

const Account = () => {
  const [signOutConfirVisible, setSignOutConfirmVisible] = useState(false);
  const { user, signOut } = useAppStore.getState();
  const navigation = useNavigation();

  // const onPressDeleteAccount = () => {
  //   setSignOutConfirmVisible(true);
  // };
  return (
    <Screen title="账号与安全" screenStyle={{ backgroundColor: '#f4f4f4' }}>
      <View style={{ flex: 1, marginTop: 16 }}>
        <SettingGroup>
          <SettingItem
            title="手机号"
            leftIcon={''}
            rightContent={
              <Text
                style={{
                  color: StyleSheet.hex(StyleSheet.currentColors.black, 0.4),
                  fontSize: 14,
                  fontWeight: '500'
                }}
              >
                {user?.mobile}
                {/* {userName} */}
              </Text>
            }
            rightIcon=""
          ></SettingItem>
        </SettingGroup>
        <SettingGroup>
          <SettingItem
            title="账号注销"
            leftIcon={''}
            onPress={onPressDeleteAccount}
          ></SettingItem>
        </SettingGroup>
      </View>
      {/* <Button
        textStyle={{ color: colorsUI.Text.danger.default }}
        style={{ marginHorizontal: 24 }}
        onPress={onPressDeleteAccount}
      >
        删除账号
      </Button> */}
    </Screen>
  );

  function onPressDeleteAccount() {
    showConfirm({
      title: '确认删除账号?',
      content:
        '删除账号将解除手机号绑定并删除您的数据，删除后不可恢复！请再次确认',
      confirmText: '确认删除',
      cancelText: '取消',
      onConfirm: ({ close }) => {
        showLoading();
        signOut()
          .then(() => {
            // router.replace('/feed/');
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'feed/index' }]
              })
            );
            hideLoading();
            close();
          })
          .catch(() => {
            showToast('删除失败');
            hideLoading();
          });
      }
    });
  }
};
export default Account;
