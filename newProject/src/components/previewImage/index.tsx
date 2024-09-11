import { ReactNode, useState } from 'react';
import { Pressable } from 'react-native';
import { ImageItem } from '@/src/types';
import { Image, ImageStyle } from '@Components/image';
import {
  PreviewImageProps as PreviewImageModalProps,
  showPreviewImages
} from '@Components/previewImageModal';

interface PreviewImageProps extends PreviewImageModalProps {
  style: ImageStyle;
  source: string;
}
export function PreviewImage(props: PreviewImageProps) {
  const { style, source, ...rest } = props;
  return (
    <Pressable
      onPress={() => {
        showPreviewImages(rest);
      }}
    >
      <Image style={props.style} source={props.source} tosSize="size2" />
    </Pressable>
  );
}
