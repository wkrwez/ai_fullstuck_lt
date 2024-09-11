import { router } from 'expo-router';
import { MutableRefObject } from 'react';
import { GetImagegenProto } from '@/src/api/makephotov2';
import { useMakePhotoStoreV2 } from '@/src/store/makePhotoV2';
import { PageState } from '@/src/store/makePhotoV2';

export const onTakePhoto = async (
  data: {
    photoId?: string;
    source: string;
    keyword?: string;
  },
  resetLoading?: () => void
) => {
  const { photoId, source, keyword } = data || {};
  const { pageState, changePageState, resetTakePhoto, syncData, reset } =
    useMakePhotoStoreV2.getState();
  if (photoId) {
    const { proto } = (await GetImagegenProto({ photoId })) || {};
    if (!proto) return;
    const { prompt, protoId, roles, style } = proto;
    syncData({
      prompt,
      protoId,
      roles,
      style
    });
    changePageState(PageState.diy);
  } else {
    reset();
    changePageState(PageState.roleselect);
  }
  if (pageState === PageState.preview) {
    resetTakePhoto();
    resetLoading?.();
  }
  router.push({
    pathname: '/make-photo/',
    params: {
      from: source,
      ...(keyword ? { keyword } : {})
    }
  });
};
