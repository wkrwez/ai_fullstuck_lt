import { ImageSourcePropType } from 'react-native';


/** 预置的图片尺寸，基于 375 计算比例 */
export const IMAGE_SIZE = {
  /** 1 */
  size1: 375,
  /** 1/2 */
  size2: 187.5,
  /** 1/3 */
  size3: 125,
  /** 1/4 */
  size4: 93.75,
  /** 1/6 */
  size6: 62.5,
  /** 1/10 */
  size10: 37.5,
} as const;

type ImageSizeType = (typeof IMAGE_SIZE)[keyof typeof IMAGE_SIZE];

/** 获取图片地址，新的 CDN 逻辑，一般都用这个 */
export function getImageUrlFromCDNUri(uri: string, size?: ImageSizeType) {
  const preffix = uri.includes('?') ? '&' : '?';
  return (
    uri +
    preffix +
    (size ? `x-tos-process=image/resize,w_${(size || 0) * 4}` : '')
  ); //默认4倍图
}

