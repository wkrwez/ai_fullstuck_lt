import {
  Image as ExpoImage,
  ImageLoadEventData,
  ImageProps,
  ImageStyle
} from 'expo-image';
import React from 'react';
import {
  ImageResolvedAssetSource,
  ImageSourcePropType,
  Image as RNImage
} from 'react-native';
import { logWarn } from '@/src/utils/error-log';
import { ImageSizeType, formatTosUrl } from '@/src/utils/getTosUrl';

export {
  ImageStyle,
  ImageProps,
  ImageSourcePropType,
  ImageResolvedAssetSource
};

type ImageWithTosProps = ImageProps & { tosSize?: ImageSizeType };
export class Image extends React.PureComponent<ImageWithTosProps> {
  constructor(props: ImageWithTosProps) {
    super(props);
  }

  /**
   * Preloads images at the given urls that can be later used in the image view.
   * Preloaded images are always cached on the disk, so make sure to use
   * `disk` (default) or `memory-disk` cache policy.
   */
  static prefetch(urls: string | string[]): void {
    return ExpoImage.prefetch(urls);
  }

  /**
   * Asynchronously clears all images stored in memory.
   * @platform android
   * @platform ios
   * @return A promise resolving to `true` when the operation succeeds.
   * It may resolve to `false` on Android when the activity is no longer available.
   * Resolves to `false` on Web.
   */
  static async clearMemoryCache(): Promise<boolean> {
    return await ExpoImage.clearMemoryCache();
  }

  /**
   * Asynchronously clears all images from the disk cache.
   * @platform android
   * @platform ios
   * @return A promise resolving to `true` when the operation succeeds.
   * It may resolve to `false` on Android when the activity is no longer available.
   * Resolves to `false` on Web.
   */
  static async clearDiskCache(): Promise<boolean> {
    return await ExpoImage.clearDiskCache();
  }

  /**
   * Gets the size of an image.
   * @param uri The location of the image.
   * @param success The function that is called when the size is read.
   * @param failure The function that is called when there is an error getting the
   * image size.
   */
  static getSize(
    uri: string,
    success: (width: number, height: number) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    failure?: (error: any) => void
  ): void {
    RNImage.getSize(uri, success, failure);
  }

  render() {
    const { transition = 150, tosSize, source, onLoad, ...rest } = this.props;
    let realSource = source;
    if (tosSize && typeof source === 'string' && canAppendTosProcess(source)) {
      realSource = formatTosUrl(source, { size: tosSize });
    }
    //临时处理，请注意走查
    if (
      typeof realSource === 'string' &&
      realSource.indexOf('x-tos') === -1 &&
      realSource.indexOf('~') === -1 &&
      realSource
    ) {
      console.warn(realSource, 'TOS 漏网之鱼');
    }

    // const time = Date.now();

    return (
      <ExpoImage
        cachePolicy="memory-disk"
        source={realSource}
        {...rest}
        onLoad={v => {
          this.props?.onLoad && this.props?.onLoad(v);
        }}
        onError={e => {
          logWarn('imageLoadError', e, 'RN.manual', false, { url: realSource });
        }}
        transition={transition}
      />
    );
  }
}

export function resolveAssetSource(
  source: ImageSourcePropType
): ImageResolvedAssetSource {
  return RNImage.resolveAssetSource(source);
}

const canAppendTosProcess = (url: string): boolean => {
  return url.indexOf('x-tos-process=') === -1 && url.indexOf('http') === 0;
};
