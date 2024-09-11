import * as Clipboard from 'expo-clipboard';
import qs from 'qs';
import { ShareImageType, ShareInfo } from '@/src/types';
import { logWarn } from '@/src/utils/error-log';
import { WaterMarkType } from '@/src/utils/getWaterMark';
import { reportClick } from '@/src/utils/report';
import { saveImageWithWmk } from '@/src/utils/savePicture';
import { performShareAction } from '@step.ai/share-module';
import { channels } from './channelConfig';
import { getShareReq } from './getShareReq';
import {
  ChannelConfig,
  ShareMethod,
  ShareType,
  ValidShareAbility
} from './typings';

function getShareMethod(shareInfo: ShareInfo, item: ChannelConfig) {
  if (
    shareInfo.url &&
    item.type &&
    channels[item.type].validShareAbility?.includes(ValidShareAbility.LINK)
  ) {
    return {
      shareMethod: ShareMethod.LINK_OR_CARD,
      type: ShareImageType.common
    };
  } else if (
    shareInfo.images.length &&
    item.type &&
    channels[item.type].validShareAbility?.includes(
      ValidShareAbility.MULTI_IMAGE
    )
  ) {
    return {
      shareMethod: ShareMethod.ONE_IMAGE_WITH_WATERMARK,
      type: ShareImageType.image
    };
  } else {
    return {
      shareMethod: ShareMethod.ONE_IMAGE_WITH_WATERMARK,
      type: ShareImageType.image
    };
  }
}

export async function onShareChannel(
  item: ChannelConfig,
  shareInfo: ShareInfo,
  config?: {
    waterMarktype?: WaterMarkType;
  },
  reportParams?: Record<string, string | number | boolean>
) {
  const { shareMethod, type } = getShareMethod(shareInfo, item);
  reportClick('share_component', {
    share_method: shareMethod,
    share_component: item.reportKey,
    ...reportParams
  });

  const shareReq = getShareReq(
    shareInfo,
    type || ShareImageType.image,
    config?.waterMarktype || WaterMarkType.AIGC
  );

  if (shareReq.link) {
    shareReq.link = addCommonParams(shareReq.link, {
      utm_type: item.reportKey
    });
  }

  if (typeof item.channel === 'undefined' || !shareReq) {
    const error = new Error('noShareConfig');
    logWarn('shareChannelError', error);
    throw error;
  }

  try {
    const isSuccess = await performShareAction(item.channel, shareReq);
    if (isSuccess) {
      reportClick(
        'share_component',
        {
          share_result: isSuccess,
          share_platform: item.reportKey,
          share_title: shareReq.title,
          share_text: shareReq.description,
          share_method: shareMethod,
          ...reportParams
        },
        'success'
      );
    } else {
      throw new Error('performShareActionFail');
    }
  } catch (error) {
    logWarn('shareChannelError', error);
    throw error;
  }
}

export async function onSaveImage(
  shareInfo: ShareInfo,
  wmk?: string,
  reportParams?: Record<string, string | number | boolean>
) {
  reportClick('share_component', {
    ...reportParams,
    share_component: '7'
  });

  const imageUrl = shareInfo.images[shareInfo.imageIndex - 1 || 0];
  if (!imageUrl) {
    const error = new Error('noShareImage');

    logWarn('saveImageError', error);
    throw error;
  }

  try {
    await saveImageWithWmk(imageUrl, wmk);

    reportClick(
      'save_image',
      {
        ...reportParams,
        share_component: '7',
        imageUrl
      },
      'success'
    );
  } catch (error) {
    reportClick(
      'save_image',
      {
        ...reportParams,
        share_component: '7',
        imageUrl
      },
      'fail'
    );

    logWarn('saveImageError', error);
    throw error;
  }
}

export async function onCopyLink(
  shareInfo: ShareInfo,
  reportParams?: Record<string, string | number | boolean>
) {
  const reportKey = channels[ShareType.copy].reportKey;
  // const source = channels[ShareType.copy].type;

  reportClick('share_component', {
    ...reportParams,
    share_component: reportKey
  });

  try {
    if (!shareInfo.url) {
      throw new Error('noShareUrl');
    }

    const url = addCommonParams(shareInfo.url, { utm_type: reportKey });
    await Clipboard.setStringAsync(url);
  } catch (e) {
    logWarn('copyLinkError', e);
  }
}

export function addCommonParams(
  url: string,
  params?: Record<string, string | boolean | number | undefined>
) {
  if (!url || !params) {
    return url;
  }

  const [urlString, query] = url.split('?');

  const newParams = {
    ...qs.parse(query),
    ...params
  };

  return `${urlString}?${qs.stringify(newParams)}`;
}
