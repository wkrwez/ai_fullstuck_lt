import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { PermissionsAndroid, Platform } from 'react-native';
import { getWaterMark, isImagexUrl } from '@Utils/getWaterMark';
import { uuid } from '@Utils/uuid';
import { getCommonHeaders } from '../api';
import { showMessage } from '../components/v2/message';
import { getChannel } from '@step.ai/app-info-module';

// wt1.png?x-tos-process=image/resize,p_50
// const WATERMARK_PARAM = '~tplv-gtvilk3tio-lipu-watermarker-v3.png';
// const WATERMARK_PARAMAI = '~tplv-gtvilk3tio-lipu-watermarker-v4.png';
// export async function hasAndroidPermission() {
//   const getCheckPermissionPromise = () => {
//     // if (Platform.Version >= 33) {
//     //   return Promise.all([
//     //     PermissionsAndroid.check(
//     //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//     //     ),
//     //     PermissionsAndroid.check(
//     //       PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
//     //     )
//     //   ]).then(
//     //     ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
//     //       hasReadMediaImagesPermission && hasReadMediaVideoPermission
//     //   );
//     // } else {
//     return PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//     );
//     // }
//   };

//   const hasPermission = await getCheckPermissionPromise();
//   if (hasPermission) {
//     return true;
//   }
//   const getRequestPermissionPromise = () => {
//     // if (Platform.Version >= 33) {
//     //   return PermissionsAndroid.requestMultiple([
//     //     PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//     //     PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
//     //   ]).then(
//     //     statuses =>
//     //       statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
//     //         PermissionsAndroid.RESULTS.GRANTED &&
//     //       statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
//     //         PermissionsAndroid.RESULTS.GRANTED
//     //   );
//     // } else {
//     // return PermissionsAndroid.request(
//     //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//     // ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
//     return MediaLibrary.requestPermissionsAsync();
//     // }
//   };

//   return await getRequestPermissionPromise();
// }

export async function savePicture(url: string, useWaterMarker?: boolean) {
  const markTemp = useWaterMarker ? getWaterMark() : undefined;

  return saveImageWithWmk(url, markTemp);
}

export async function saveImageWithWmk(url: string, wmk?: string) {
  const getChannelString = getChannel();
  const isHuawei =
    getChannelString === 'huaiwei' || getChannelString === 'huawei';

  isHuawei
    ? showMessage(
        '照片权限说明',
        '请允许添加照片，以便将应用内的图片保存到您的相册中'
      )
    : undefined;

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      if (
        Platform.OS === 'android' &&
        !(await MediaLibrary.requestPermissionsAsync())
      ) {
        return reject({ code: 1, reason: '权限不足' });
      }
      const dir = FileSystem.cacheDirectory || '';

      const key = uuid();

      if (!url) {
        return reject({ code: 1, reason: 'url缺失' });
      }

      const saveUrl = isImagexUrl(url) && wmk ? url + wmk : url;
      const cacheUrl = dir + key + '.png';
      // todo url拼接
      resolve(
        FileSystem.downloadAsync(saveUrl, cacheUrl).then(
          ({ uri: localUri }) => {
            return MediaLibrary.saveToLibraryAsync(localUri).then(res => {
              FileSystem.deleteAsync(cacheUrl);
              return res;
            });
          }
        )
      );
    }, 500);
  });
}
