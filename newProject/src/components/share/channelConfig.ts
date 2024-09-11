import { IconTypes } from '../icons';
import { ShareAction } from '@step.ai/share-module';
import {
  ChannelConfig,
  ShareCompPreset,
  ShareMethod,
  ShareType,
  ValidShareAbility
} from './typings';

const ICON_WX = require('@Assets/share/wx.png');
const ICON_PYQ = require('@Assets/share/pyq.png');
const ICON_QQ = require('@Assets/share/qq.png');
const ICON_QZONE = require('@Assets/share/qzone.png');
const ICON_XHS = require('@Assets/share/xhs.png');
const ICON_DOUYIN = require('@Assets/share/douyin.png');
const ICON_SAVE_EMOJI = require('@Assets/share/saveEmoji.png');

export const channels: Record<ShareType, ChannelConfig & { icon?: IconTypes }> =
  {
    [ShareType.wx]: {
      type: ShareType.wx,
      channel: ShareAction.WECHAT,
      icon: ICON_WX,
      text: '微信好友',
      reportKey: '1',
      validShareAbility: [ValidShareAbility.LINK, ValidShareAbility.ONE_IMAGE]
    },
    [ShareType.pyq]: {
      type: ShareType.pyq,
      channel: ShareAction.WECHAT_TIMELINE,
      icon: ICON_PYQ,
      text: '朋友圈',
      reportKey: '2',
      validShareAbility: [ValidShareAbility.LINK, ValidShareAbility.ONE_IMAGE]
    },
    [ShareType.qq]: {
      type: ShareType.qq,
      channel: ShareAction.QQ,
      icon: ICON_QQ,
      text: 'QQ好友',
      reportKey: '3',
      validShareAbility: [ValidShareAbility.LINK, ValidShareAbility.ONE_IMAGE]
    },
    [ShareType.qzone]: {
      type: ShareType.qzone,
      channel: ShareAction.QQ_ZONE,
      icon: ICON_QZONE,
      text: 'QQ空间',
      reportKey: '4',
      validShareAbility: [ValidShareAbility.LINK, ValidShareAbility.ONE_IMAGE]
    },
    [ShareType.xhs]: {
      type: ShareType.xhs,
      icon: ICON_XHS,
      text: '小红书',
      channel: ShareAction.XIAOHONGSHU,
      reportKey: '5',
      validShareAbility: []
    },
    [ShareType.douyin]: {
      type: ShareType.douyin,
      channel: ShareAction.DOUYIN,
      icon: ICON_DOUYIN,
      text: '抖音',
      reportKey: '6',
      validShareAbility: [
        ValidShareAbility.ONE_IMAGE,
        ValidShareAbility.MULTI_IMAGE
      ]
    },
    [ShareType.save]: {
      type: ShareType.save,
      text: '保存图片',
      reportKey: '7'
    },
    [ShareType.saveEmoji]: {
      type: ShareType.saveEmoji,
      text: '保存图片',
      icon: ICON_SAVE_EMOJI,
      reportKey: '7'
    },
    [ShareType.copy]: {
      type: ShareType.copy,
      text: '复制链接',
      reportKey: '8'
    },
    [ShareType.shareimage]: {
      type: ShareType.shareimage,
      text: '分享图',
      reportKey: '9'
    },
    [ShareType.douyinChat]: {
      type: ShareType.douyinChat,
      channel: ShareAction.DOUYIN_SHARE,
      icon: ICON_DOUYIN,
      text: '抖音好友',
      reportKey: '12',
      validShareAbility: [ValidShareAbility.ONE_IMAGE]
    }
  };

export const shareCompPresets: Record<
  ShareCompPreset,
  ChannelConfig[] | undefined
> = {
  [ShareCompPreset.EMOJI_IMAGE]: [
    channels[ShareType.saveEmoji],
    channels[ShareType.wx],
    channels[ShareType.qq],
    channels[ShareType.douyinChat]
  ],
  [ShareCompPreset.CONTENT_OPERATIONS]: [
    channels[ShareType.save],
    channels[ShareType.copy]
  ],
  [ShareCompPreset.CONTENT_SHARE]: [
    channels.wx,
    channels.pyq,
    channels.qq,
    channels.qzone,
    channels.douyin
  ],
  [ShareCompPreset.CONTENT_GEN_SHARE_IMAGE]: [
    channels.save,
    channels.wx,
    channels.pyq,
    channels.qq,
    channels.qzone,
    channels.douyin
  ],
  [ShareCompPreset.CONTENT_ACTIVITY]: [
    channels.wx,
    channels.pyq,
    channels.qq,
    channels.qzone,
    channels.copy
  ]
};
