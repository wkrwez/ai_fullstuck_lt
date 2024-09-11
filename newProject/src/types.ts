import { ReactNode } from 'react';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { Theme } from '@/src/theme/colors/type';
import { IconProps, IconTypes } from '@Components/icons';
import {
  AllCardsResponse,
  SearchRsp,
  UserCreatedCardsResponse,
  UserLikedCardsResponse
} from '@step.ai/proto-gen/raccoon/query/query_pb';
import { ShareCompPreset } from './components/share/typings';

/** 后端的公共数据结构定义 */
export * from '@step.ai/proto-gen/raccoon/common/types_pb';
export * from '@step.ai/proto-gen/raccoon/common/profile_pb';
export * from '@step.ai/proto-gen/raccoon/common/showcase_pb';
export * from '@step.ai/proto-gen/raccoon/common/stat_pb';
// export * from '@step.ai/proto-gen/raccoon/common/subscribe_pb';
export * from '@step.ai/proto-gen/raccoon/common/utils_pb';

// export * from '@step.ai/proto-gen/raccoon/common/nullservice.proto';

// 游戏类型
export type GameTypes = 'makePhoto'; // todo 舌战 战斗

export enum TaskState {
  initial = 'initial', // 初始状态
  pending = 'pending', // 生成中
  completed = 'completed' // 生成结束
}

// 分享图模板名称
export enum ShareTemplateName {
  detail = 'lipu_detail_share_image_info_prod', // 图文详情页
  world = 'lipu_world_share_image_info_prod' // 平行世界
}

export interface TaskItem<T> {
  // 一个任务 结构化数据
  state: TaskState;
  data?: T;
  error?: ErrorRes; // 前后端所有接口的定义 {code: xx, reason: xx}
}

export interface RoleItemType {
  id: string;
  key: string;
  icon: string;
  name: string;
  preview: string;
  ip: number;
  material?: string; // todo
}

export type RoleDataMap = {
  // @ts-ignore 暂时先 后面改成服务端配置不存在这个问题
  [key in string]: RoleItemType;
};

export enum ImageState {
  initial = 'initial', // 初始状态
  pending = 'pending', // 未加载到图片
  generated = 'generated', // 请求到了
  censored = 'censored' // 审核通过
}

export interface ImageItem {
  url?: string;
  state?: ImageState;
  photoId?: string;
  protoId?: string;
}

export type ListResponse =
  | AllCardsResponse
  | UserCreatedCardsResponse
  | UserLikedCardsResponse
  | SearchRsp;

export enum AuthorRole {
  User = 'user',
  Assistant = 'assistant'
}

export enum Prefer {
  None = 1,
  Like = 2,
  Dislike = 3
}

export enum ShareImageType {
  common = 'common',
  image = 'image'
}

export interface OperationsType {
  icon?: IconTypes | ((theme: Theme) => ReactNode);
  text: string;
  onPress: () => void;
  iconProps?: IconProps;
  reportKey?: string;
}

export interface ShareInfo {
  title: string;
  description: string;
  images: string[];
  imageIndex: number;
  url: string;
}

export interface ShareInfoProps {
  // 分享结构体
  shareInfo: ShareInfo;
  // 分享需要的额外信息 json string
  extra?: string;
  // 分享类型
  type: ShareImageType;
  // 额外操作节点
  extraOperations?: OperationsType[];
  // 是否提供「分享图」功能 暂不考虑通用性：（
  allowShareImage?: boolean;
  // 使用主题
  theme?: Theme;
  // 分享图模板
  shareTemplateName: ShareTemplateName;
  // 分享预设渠道
  channelPreset?: ShareCompPreset;
}
