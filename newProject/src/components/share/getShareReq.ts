import { ShareImageType, ShareInfo } from '@/src/types';
import { formatTosUrl } from '@/src/utils/getTosUrl';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { ShareRequest } from '@step.ai/share-module';

export function getShareReq(
  shareInfo: ShareInfo,
  mode: ShareImageType,
  watermarker?: WaterMarkType
) {
  const shareReq = new ShareRequest();
  const { title, description, images, imageIndex, url } = shareInfo;
  shareReq.title = title;
  shareReq.description = description;

  if (mode === ShareImageType.common) {
    shareReq.link = url;
    shareReq.imageUrl = formatTosUrl(images[shareInfo.imageIndex - 1], {
      size: 'size4',
      type: 'jpg'
      // useTos: true
    });
  } else {
    const image = images[imageIndex - 1];
    shareReq.imageUrl = formatTosUrl(image, {
      size: 'size1',
      type: 'jpg',
      watermarker
    });

    shareReq.imageUrls = images.map(image => {
      return formatTosUrl(image, {
        size: 'size1',
        type: 'jpg',
        watermarker
        // useTos: true
      });
    });
  }
  return shareReq;
}
