import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { getCommonHeaders, uploadAvatarImg } from '@/src/api';
import { hideLoading, showLoading } from '@/src/components';
import { Icon, Screen, showToast } from '@/src/components';
import { showMessage } from '@/src/components/v2/message';
import { useAppStore } from '@/src/store/app';
import { getChannel } from '@/src/store/message';
import { colors } from '@/src/theme';
import { savePicture } from '@/src/utils/savePicture';
import { StyleSheet } from '@Utils/StyleSheet';
import { logWarn } from '@Utils/error-log';

const MOCK_IMG = require('@Assets/mock/img1.jpg');

export default function AvatarEdit() {
  const [user, updateUser] = useAppStore(state => [
    state.user,
    state.updateUser
  ]);

  // 保存图片
  const handleSaveImage = async () => {
    showLoading('头像保存中...');
    const saveUrl = user?.avatar || Image.resolveAssetSource(MOCK_IMG)?.uri;
    try {
      await savePicture(saveUrl);
      showToast('保存成功！');
    } catch (e) {
      logWarn('[save image err]', e);
      showToast('保存失败！');
    } finally {
      hideLoading();
    }
  };

  // 更新用户信息
  const updateUserInfo = async (image_id: string) => {
    try {
      await updateUser({ avatarImageId: image_id });
      showToast('更新成功~');
      router.back();
    } catch (e) {
      logWarn('[update userinfo error]', e);
      showToast('更新失败！');
    }
  };

  // 上传头像并更新用户信息
  const uploadAvatarAndUpdateUser = async (uri: string) => {
    try {
      showLoading('头像上传中...');
      const res = await uploadAvatarImg(uri);

      if (res) {
        await updateUserInfo(res?.image_id);
      }
    } catch (e) {
      showToast('上传失败！');
      logWarn('[upload avatar err]', e);
    } finally {
      hideLoading();
    }
  };

  // 选择头像图片
  const handlePickImage = async () => {
    const header = await getCommonHeaders();
    const getChannelString = header['oasis-channel'];
    const isHuawei =
      getChannelString === 'huaiwei' || getChannelString === 'huawei';

    // 过审加入弹窗
    isHuawei
      ? showMessage(
          '相机权限使用说明',
          '请允许使用相机权限，以方便实现设置、更换头像、完成扫描二维码等功能'
        )
      : undefined;

    setTimeout(async () => {
      // 请求相册权限
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== ImagePicker.PermissionStatus.GRANTED) {
          showToast('没有相册访问权限!');
          return;
        }
      }
      // 启动相册
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
      });
      // 上传图片
      if (!result.canceled) {
        console.log('start upload ------------>', result.assets[0].uri);
        const uri = result.assets[0].uri;
        uploadAvatarAndUpdateUser(uri);
      }
    }, 500);
  };

  // 拍照
  const handleTakePhoto = async () => {
    const header = await getCommonHeaders();
    const getChannelString = header['oasis-channel'];
    const isHuawei =
      getChannelString === 'huaiwei' || getChannelString === 'huawei';

    // 过审加入弹窗
    isHuawei
      ? showMessage(
          '相机权限使用说明',
          '请允许使用相机权限，以方便实现设置、更换头像、完成扫描二维码等功能'
        )
      : undefined;

    setTimeout(async () => {
      // 请求相机权限
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== ImagePicker.PermissionStatus.GRANTED) {
          showToast('没有摄像头权限!');
          return;
        }
      }
      // 启动相机
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5
      });
      // 上传图片
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        uploadAvatarAndUpdateUser(uri);
      }
    }, 500);
  };

  return (
    <Screen
      title="头像预览"
      screenStyle={{
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}
      theme="dark"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={st.$avatar}>
          <Animated.Image
            source={user?.avatar ? { uri: user?.avatar } : MOCK_IMG}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      <View style={st.$bottomArea}>
        <TouchableHighlight onPress={handleSaveImage} activeOpacity={0.6}>
          <View style={st.$button}>
            <Text style={st.$buttonText}>保存头像</Text>
            <Icon icon="download" />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={handlePickImage} activeOpacity={0.6}>
          <View style={st.$button}>
            <Text style={st.$buttonText}>从相册中选择</Text>
            <Icon icon="image_pick" />
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={handleTakePhoto} activeOpacity={0.6}>
          <View style={[st.$button, { borderWidth: 0 }]}>
            <Text style={st.$buttonText}>拍摄头像</Text>
            <Icon icon="camera" />
          </View>
        </TouchableHighlight>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  $avatar: {
    ...StyleSheet.circleStyle,
    width: 315,
    height: 315,
    overflow: 'hidden'
  },

  $bottomArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    marginHorizontal: 30,
    borderRadius: 8,
    overflow: 'hidden'
  },

  $button: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    width: 315,
    height: 58,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomColor: StyleSheet.hex(StyleSheet.currentColors.white, 0.08),
    borderWidth: 0.5
  },
  $buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600'
  }
});
