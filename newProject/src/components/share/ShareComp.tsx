import { useDebounceFn } from 'ahooks';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { ShareCallback } from '@/src/api/share';
import { useCreditStore } from '@/src/store/credit';
import { Theme } from '@/src/theme/colors/type';
import { StyleSheet } from '@/src/utils';
import { logWarn } from '@/src/utils/error-log';
import { getWaterMark } from '@/src/utils/getWaterMark';
import { hideLoading, showLoading } from '../loading';
import { showToast } from '../toast';
import { RewardTaskType } from '@/proto-registry/src/web/raccoon/reward/common_pb';
import { useShallow } from 'zustand/react/shallow';
import { ChannelItem } from './ChannelItem';
import { shareCompPresets } from './channelConfig';
import {
  ChannelConfig,
  GetShareInfoError,
  ShareCompPreset,
  ShareCompProps,
  ShareType
} from './typings';
import { onCopyLink, onSaveImage, onShareChannel } from './utils';

export function ShareComp({
  align = 'left',
  style: $customContainerStyle,
  preset,
  extraShareItems,
  theme = Theme.LIGHT,
  getShareInfo,
  waterMarkType,
  reportParams,
  onSuccess
}: ShareCompProps) {
  const channels = useMemo(() => {
    const list = (preset && shareCompPresets[preset]) || [];
    return list.concat(extraShareItems || []);
  }, [preset, extraShareItems]);

  const debounceShare = async (item: ChannelConfig) => {
    // return
    showLoading();

    // 积分 update share
    if (preset !== ShareCompPreset.EMOJI_IMAGE) {
      ShareCallback();
    }

    try {
      const shareInfo = await getShareInfo();
      if (!shareInfo || shareInfo instanceof Error) {
        throw shareInfo || new Error('no_share_info');
      }
      // 分享回调比较不可控，此处关闭loading
      hideLoading();

      await onShareChannel(
        item,
        shareInfo,
        {
          waterMarktype: waterMarkType
        },
        reportParams
      );

      onSuccess?.(item.type);

      // 延迟分享结果
      if (preset !== ShareCompPreset.EMOJI_IMAGE) {
        setTimeout(() => {
          // 只在成功时弹出toast，sharecallback在触发点击分享行为时触发
          useCreditStore
            .getState()
            .updateCreditTriggerType(RewardTaskType.SHARE);
        }, 2500);
      }
    } catch (error) {
      useCreditStore.getState().updateCreditTriggerType(RewardTaskType.UNKNOWN);

      if (!error || !(error as GetShareInfoError).disableDefaultToast) {
        showToast('分享失败，请重试');
      }
      logWarn('onClickShareFail', error);
    } finally {
      // todo @linyueqiang 看看这么写有没有问题
      hideLoading();
    }
  };

  const { run } = useDebounceFn(debounceShare, {
    wait: 500
  });

  const onClickShare = async (item: ChannelConfig) => {
    run(item);
  };

  const onClickSave = async (item: ChannelConfig) => {
    showLoading();

    try {
      const shareInfo = await getShareInfo();
      if (!shareInfo || shareInfo instanceof Error) {
        throw shareInfo || new Error('no_share_info');
      }

      const wmk = getWaterMark(waterMarkType);

      await onSaveImage(shareInfo, wmk, reportParams);

      hideLoading();
      showToast('保存成功');
      onSuccess?.(item.type);
    } catch (error) {
      hideLoading();
      if (!error || !(error as GetShareInfoError).disableDefaultToast) {
        showToast('图片保存失败，请重试~');
      }
      logWarn('onClickSaveFail', error);
    }
  };

  async function onClickChannelCopyLink() {
    try {
      const shareInfo = await getShareInfo();
      if (!shareInfo || shareInfo instanceof Error) {
        throw shareInfo || new Error('no_share_info');
      }

      await onCopyLink(shareInfo, reportParams);
      showToast('复制成功');
      onSuccess?.(ShareType.copy);
    } catch (e) {
      if (!e || !(e as GetShareInfoError).disableDefaultToast) {
        showToast('复制失败，请重试~');
      }
    }
  }

  if (!channels.length) {
    return null;
  }

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={$customContainerStyle}
      contentContainerStyle={[
        {
          flexGrow: 1,
          justifyContent: align === 'center' ? 'center' : 'flex-start'
        },
        StyleSheet.rowStyle
      ]}
    >
      {channels.map((item, index) => (
        <ChannelItem
          {...item}
          theme={theme}
          key={item.text}
          isLast={index === channels.length - 1}
          onPress={() => {
            if (item.onPress) {
              item.onPress();
            } else if (item.type) {
              switch (item.type) {
                case ShareType.save:
                case ShareType.saveEmoji:
                  return onClickSave(item);
                case ShareType.copy:
                  return onClickChannelCopyLink();
                default:
                  return onClickShare(item);
              }
            }
          }}
        />
      ))}
    </ScrollView>
  );
}
