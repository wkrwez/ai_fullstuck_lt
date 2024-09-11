import { createSocketConnect } from '../websocket/connect';
import { Empty } from '@bufbuild/protobuf';
import { UserInfo } from '@step.ai/proto-gen/raccoon/uinfo/uinfo_connect';
import { UpdateUserInfoReq } from '@step.ai/proto-gen/raccoon/uinfo/uinfo_pb';

export const profileClient = createSocketConnect('UserInfo', UserInfo);

export const getProfile = () => {
  return profileClient.getUserInfo({} as Empty);
};

export const updateProfile = (payload: UpdateUserInfoReq) => {
  return profileClient.updateUserInfo(payload);
};

export const closeAccount = () => {
  return profileClient.closeAccount({});
};
