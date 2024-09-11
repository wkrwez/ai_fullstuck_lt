import { useEffect, useState } from 'react';
import { ShareImageType, ShareInfoProps } from '@/src/types';
import { Channel } from './Channel';
import { ShareGenImage } from './ShareGenImage';

export const ShareSingleton = {
  showShare: (payload: ShareInfoProps) => {},
  hideShare: () => {}
};

export const ShareModalGlobal = () => {
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<ShareInfoProps | null>();
  useEffect(() => {
    const registerShare = () => {
      ShareSingleton.showShare = payload => {
        if (payload) {
          setVisible(true);
          setParams(payload);
        }
      };
      ShareSingleton.hideShare = () => {
        setVisible(false);
        setParams(null);
      };
    };
    registerShare();
  }, []);
  if (!params) return;

  // 图片分享
  if (params.type === ShareImageType.image) {
    return (
      <ShareGenImage
        theme={params.theme}
        shareInfo={params}
        isShow={visible}
        onCancel={() => {
          setVisible(false);
        }}
      ></ShareGenImage>
    );
  }

  // 链接分享
  return (
    <Channel
      theme={params.theme}
      isShow={visible}
      onCancel={() => {
        setVisible(false);
      }}
      shareInfo={params}
    />
  );
};

export const showShare = (payload: ShareInfoProps) =>
  ShareSingleton.showShare(payload);

export const hideShare = () => ShareSingleton.hideShare();
