import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { Theme } from '@/src/theme/colors/type';
import { OperationsType, ShareInfo } from '@/src/types';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { IconProps, IconTypes } from '../icons';
import { ShareAction } from '@step.ai/share-module';

export enum ShareType {
  wx = 'wx',
  pyq = 'pyq',
  qq = 'qq',
  qzone = 'qzone',
  xhs = 'xhs',
  douyin = 'douyin',
  save = 'save',
  // 处理逻辑同 ShareType.save 仅定制 icon
  saveEmoji = 'saveEmoji',
  copy = 'copy',
  shareimage = 'shareimage',
  douyinChat = 'douyinChat'
}

export enum ShareMethod {
  // 自定义连接
  LINK_OR_CARD = 1,
  // 单图+水印
  ONE_IMAGE_WITH_WATERMARK = 2,
  // 多图+水印
  MULTI_IMAGE_WITH_WATERMARK = 3,
  // 分享图
  SHARE_IMAGE = 4
}

export enum ValidShareAbility {
  LINK = 'link',
  ONE_IMAGE = 'one_image',
  MULTI_IMAGE = 'multi_image'
}

export interface ChannelConfig {
  type?: ShareType;
  icon?: IconTypes | ((theme: Theme) => ReactNode);
  iconProps?: IconProps;
  channel?: ShareAction;
  text?: string;
  reportKey?: string;
  validShareAbility?: ValidShareAbility[];
  onPress?: () => void;
}

export enum ShareCompPreset {
  EMOJI_IMAGE = 'emoji_share',
  CONTENT_OPERATIONS = 'content_operations',
  CONTENT_SHARE = 'content_share',
  CONTENT_GEN_SHARE_IMAGE = 'content_gen_share_image',
  CONTENT_ACTIVITY = 'content_activity'
}

export class GetShareInfoError extends Error {
  disableDefaultToast?: boolean;
  constructor(msg?: string, config?: { disableDefaultToast?: boolean }) {
    super(msg);
    this.name = 'GetShareInfoError';
    this.disableDefaultToast = config?.disableDefaultToast;
  }
}

// 先只支持分享图片
export interface ShareCompProps {
  // 获取 shareInfo 数据
  getShareInfo: () =>
    | Promise<ShareInfo | GetShareInfoError | undefined>
    | ShareInfo
    | GetShareInfoError
    | undefined;
  // 水印
  waterMarkType?: WaterMarkType;
  // 预设分享组件组
  preset?: ShareCompPreset;
  // 额外分享组件
  extraShareItems?: ChannelConfig[];
  // 颜色主题
  theme?: Theme;
  // 样式
  style?: ViewStyle;
  // 排布方式
  align?: 'left' | 'center';
  // 埋点参数
  reportParams?: Record<string, string | number | boolean>;
  // 成功回调
  onSuccess?: (type?: ShareType) => void;
}
