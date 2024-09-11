import 'fast-text-encoding';
import mime from 'mime';
import { Platform } from 'react-native';
import { Resource } from '@/proto-registry/src/web/raccoon/resource/resource_connect';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { getNonPassportCommonHeaders as getOasisCommonHeaders } from '@step.ai/api-module';
import { deviceId } from '@step.ai/app-info-module';
import {
  APIEnvConst,
  APIInfoProvider,
  AsyncHeadersProvider,
  LogLevel,
  buildCommonHeaderProvider,
  withCommonInterceptors
} from '@step.ai/connect-api-common';
import { PassportService } from '@step.ai/proto-gen/proto/api/passport/v1/service_connect';
import { Query } from '@step.ai/proto-gen/raccoon/query/query_connect';
import { Upload } from '@step.ai/proto-gen/raccoon/upload/upload_connect';
import { lipuAPIEnv } from './env';

// const PASSPORT_APPID = '10200';
const PASSPORT_APPID = '10400'; // lipu

const baseUrl = lipuAPIEnv.currentApiBaseURL();

const apiInfoProvider: APIInfoProvider = {
  deviceId() {
    return deviceId();
  }
};

const passportTransport = createConnectTransport({
  baseUrl: APIEnvConst.urlPlaceholder,
  interceptors: interceptors('/passport'),
  credentials: 'same-origin'
});

const extraHeaderProvider: AsyncHeadersProvider = async () => {
  return await getOasisCommonHeaders();
};

function interceptors(subpath: string) {
  return withCommonInterceptors({
    env: lipuAPIEnv,
    appId: PASSPORT_APPID,
    apiSubPath: subpath,
    platform: Platform.OS,
    passportServiceSubPath: '/passport',
    logLevel: LogLevel.INFO,
    info: apiInfoProvider,
    extraHeaders: extraHeaderProvider
  });
}

export const getCommonHeaders = buildCommonHeaderProvider({
  env: lipuAPIEnv,
  appId: PASSPORT_APPID,
  platform: Platform.OS,
  infoProvider: apiInfoProvider,
  passportServiceSubPath: '/passport',
  extraHeaders: extraHeaderProvider
});

export const passportCleanUp: (() => void)[] = [];

export const passportClient = createPromiseClient(
  PassportService,
  passportTransport
);

const collectionTransport = createConnectTransport({
  baseUrl: APIEnvConst.urlPlaceholder,
  interceptors: interceptors(''),
  credentials: 'same-origin'
});
// home feed service
export const feedClient = createPromiseClient(Query, collectionTransport);

const subscribeBrandTransport = createConnectTransport({
  baseUrl: APIEnvConst.urlPlaceholder,
  interceptors: interceptors(''),
  credentials: 'same-origin'
});

/**
 * 埋点feed 运营位 疲劳度
 */
export const feedAFTransport = createConnectTransport({
  baseUrl: APIEnvConst.urlPlaceholder,
  interceptors: interceptors(''),
  credentials: 'same-origin'
});
export const feedAFClient = createPromiseClient(Resource, feedAFTransport);

/**
 * 上传服务
 */
export const uploadTransport = createConnectTransport({
  baseUrl: APIEnvConst.urlPlaceholder,
  interceptors: interceptors(''),
  credentials: 'same-origin'
});
export const uploadClient = createPromiseClient(Upload, uploadTransport);

/**
 * 头像上传
 * */

// 头像上传路径
const avatarUploadUrl = baseUrl + '/step.raccoon.upload.Upload/UploadAvatar';

// 头像上传函数
type UploadAvatarResponse = {
  image_id: string;
};
export const uploadAvatarImg = async (uri: string) => {
  const imageName: string = uri.split('/').pop() as string;
  const headers = await getCommonHeaders();
  console.log('headers', headers);

  const formData = new FormData();
  formData.append(
    'avatar',
    {
      uri: uri,
      name: imageName,
      type: mime.getType(imageName)
    } as any,
    imageName
  );

  const response = await fetch(avatarUploadUrl, {
    headers,
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const resJson = await response.json();
    return resJson as UploadAvatarResponse;
  } else {
    throw await response.json();
  }
};

/**
 * 表情包上传
 * */

// 上传路径
const emojiUploadUrl = baseUrl + '/step.raccoon.upload.Upload/UploadEmoji';

// 上传函数
export type UploadEmojiResponse = {
  image_id: string;
  image_url: string;
};
export const uploadEmojiImg = async (uri: string) => {
  const imageName: string = uri.split('/').pop() as string;
  const headers = await getCommonHeaders();
  console.log('headers', headers);

  const formData = new FormData();
  formData.append(
    'emoji',
    {
      uri: uri,
      name: imageName,
      type: mime.getType(imageName)
    } as any,
    imageName
  );

  const response = await fetch(emojiUploadUrl, {
    headers,
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const resJson = await response.json();
    return resJson as UploadEmojiResponse;
  } else {
    throw await response.json();
  }
};

// 分享图上传
const shareUploadUrl = baseUrl + '/step.raccoon.upload.Upload/UploadShare';
// 上传函数
export type UploadShareResponse = {
  image: {
    id: string;
    url: string;
  };
};
export const uploadShareImg = async (uri: string) => {
  const imageName: string = uri.split('/').pop() as string;
  const headers = await getCommonHeaders();
  console.log('headers', headers);

  const formData = new FormData();
  formData.append(
    'share',
    {
      uri: uri,
      name: imageName,
      type: mime.getType(imageName)
    } as any,
    imageName
  );

  const response = await fetch(shareUploadUrl, {
    headers,
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const resJson = await response.json();
    return resJson as UploadShareResponse;
  } else {
    throw await response.json();
  }
};
