import { ErrorRes } from './websocket/stream_connect';

// 业务通用报错码
enum ErrorCode {
  security = 10005
}
export const checkSecurity = (e: ErrorRes) => {
  return e && e.code === ErrorCode.security;
};

// 选择必要的查询参数
export type PickPbQueryParams<T> = Omit<
  T,
  | 'equals'
  | 'clone'
  | 'fromBinary'
  | 'fromJson'
  | 'fromJsonString'
  | 'toBinary'
  | 'toJson'
  | 'toJsonString'
  | 'getType'
>;
