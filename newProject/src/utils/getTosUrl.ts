import { WaterMarkType, getWaterMark, isImagexUrl } from '@Utils/getWaterMark';

/** 预置的图片尺寸，基于 375 计算比例 */
export const IMAGE_SIZE = {
  /** 1 */
  size1: 360 * 3,
  /** 1/2 */
  size2: 180 * 3,
  // /** 1/3 */
  size3: 120 * 3,
  /** 1/4 */
  size4: 90 * 3,
  /** 1/6 */
  size6: 60 * 3,
  /** 1/10 */
  size10: 36 * 3
} as const;

export type ImageSizeType = keyof typeof IMAGE_SIZE;

type ImageProps = {
  type?: 'webp' | 'png' | 'jpg';
  size: ImageSizeType;
  watermarker?: WaterMarkType;
  useTos?: boolean;
};

export function formatTosUrl(url: string, props?: ImageProps) {
  if (url.indexOf('http') === -1) return url;
  let { type = 'webp', size = 'size1' } = props || {};
  const width = IMAGE_SIZE[size];
  // 有url参数走url逻辑
  if (url.indexOf('?') !== -1) {
    const query = `x-tos-process=image/resize,w_${width}/format,${type}`;
    const slug = url.indexOf('?') !== -1 ? '&' : '?';
    return url + slug + query;
  }
  if (isImagexUrl(url) && props?.watermarker) {
    const query = getWaterMark(props?.watermarker);
    return url + query;
  }
  if (isImagexUrl(url) && !props?.useTos) {
    const query = `~tplv-gtvilk3tio-lipu-v1:${width}:q100.${type}`;
    return url + query;
  }
  const query = `x-tos-process=image/resize,w_${width}/format,${type}`;
  const slug = url.indexOf('?') !== -1 ? '&' : '?';
  return url + slug + query;
}
