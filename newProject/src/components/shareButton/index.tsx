// todo 不同场景的分享，信息应该外部维护 先copy
import { router } from 'expo-router';
import { FC } from 'react';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ErrorRes } from '@/src/api/websocket/stream_connect';
import { useAppStore } from '@/src/store/app';
import { DetailInfo, useDetailStore } from '@/src/store/detail';
import { InteractionType, useHistoryStore } from '@/src/store/histroy';
import { useProfileStore } from '@/src/store/profile';
import { getThemeColor } from '@/src/theme/colors/common';
import { Theme } from '@/src/theme/colors/type';
import {
  ShareImageType,
  ShareInfo,
  ShareTemplateName,
  UserProfile
} from '@/src/types';
import { StyleSheet } from '@/src/utils';
import { reportClick, reportExpo } from '@/src/utils/report';
import { showConfirm } from '@Components/confirm';
import { Icon } from '@Components/icons/icon';
import { Image } from '@Components/image';
import { hideShare, showShare } from '@Components/share';
import { showToast } from '@Components/toast';
import { logWarn } from '@Utils/error-log';
import { hideLoading, showLoading } from '../loading';
import { BasicChannelItem } from '../share/basicChannelItem';
import { DeleteIcon, ReportIcon, ShareIcon } from '@/assets/image/svg';

interface ShareButtonProps {
  authorInfo?: UserProfile;
  shareInfo: ShareInfo;
  detailId: string;
  theme?: Theme;
  shareTemplateName?: ShareTemplateName;
  // 暂不考虑通用性：（
  allowShareImage?: boolean;
  disabled?: boolean;
}

const ShareButton: FC<ShareButtonProps> = ({
  theme = Theme.LIGHT,
  detailId,
  shareInfo,
  authorInfo,
  shareTemplateName = ShareTemplateName.detail,
  allowShareImage = true,
  disabled = false
}) => {
  const [isVisible, setVisible] = useState(false);

  const themeConfig = getThemeColor(theme);

  function onPress() {
    reportClick('share_button', {
      contentid: detailId,
      status: disabled ? 'disable' : 'normal'
    });
    reportExpo('share_component', { contentid: detailId, share_scene: '1' });

    if (disabled) {
      showToast('有些东西只能自己看哟～');
      return;
    }

    if (!shareInfo) return;

    const isMine =
      authorInfo?.uid !== undefined &&
      authorInfo?.uid === useAppStore.getState().user?.uid;
    let loading = false; // todo 统一点击控制
    showShare({
      shareInfo,
      allowShareImage,
      extra: JSON.stringify(authorInfo || {}),
      type: ShareImageType.common,
      theme,
      shareTemplateName: shareTemplateName,
      extraOperations: isMine
        ? [
            {
              text: '删除',
              icon: theme => (
                <BasicChannelItem theme={theme} style={{ padding: 11 }}>
                  <DeleteIcon
                    width={24}
                    height={24}
                    color={themeConfig.fontColor}
                  />
                </BasicChannelItem>
              ),
              onPress: () => {
                if (loading) return;
                showConfirm({
                  title: '确认删除内容?',
                  content: '内容相关评论和回复将会同时被删除',
                  confirmText: '确认',
                  cancelText: '取消',
                  onConfirm: ({ close }) => {
                    reportClick('detail_delete', { contentid: detailId });
                    showLoading();
                    loading = true;
                    useDetailStore
                      .getState()
                      .deleteDetail(detailId)
                      .then(() => {
                        showToast('删除成功~');
                        hideShare();
                        close();
                        router.back();
                        loading = false;
                        hideLoading();
                        useHistoryStore
                          .getState()
                          .update(InteractionType.POST, detailId, {
                            deleted: true
                          });
                      })
                      .catch((e: ErrorRes) => {
                        loading = false;
                        hideLoading();
                        showToast('删除失败，请重试~');
                        logWarn('deleteDetail', JSON.stringify(e));
                      });
                  }
                });
              }
            }
          ]
        : [
            {
              text: '举报',
              icon: theme => (
                <BasicChannelItem theme={theme} style={{ padding: 11 }}>
                  <ReportIcon
                    width={24}
                    height={24}
                    color={themeConfig.fontColor}
                  />
                </BasicChannelItem>
              ),
              onPress: () => {
                if (loading) return;
                showConfirm({
                  title: '确认举报内容?',
                  confirmText: '确认',
                  cancelText: '取消',
                  onConfirm: ({ close }) => {
                    reportClick('detail_report', { contentid: detailId });
                    showToast('感谢您的热心反馈，我们将尽快进行举报确认');
                    close();
                    hideShare();
                  }
                });
              }
            }
          ]
    });
  }

  return (
    <>
      <Pressable onPress={onPress}>
        <ShareIcon
          color={disabled ? themeConfig.fontColor3 : themeConfig.fontColor}
          width={24}
          height={24}
        />
      </Pressable>

      {/* <Channel
        shareValues={''}
        // shareValues={JSON.stringify(shareInfo)}
        isShow={isVisible}
        onCancel={onCancel}
      ></Channel> */}
    </>
  );
};

export { ShareButton };

// const st = StyleSheet.create({
//   $isNone:{
//     display:'none'
//   }
// })
