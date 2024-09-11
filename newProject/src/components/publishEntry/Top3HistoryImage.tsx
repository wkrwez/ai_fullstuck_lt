import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { usePublishStore } from '@/src/store/publish';
import { Image, ImageStyle } from '@Components/image';

const PUBLISH_IMAGE_BACKUP = [
  require('@Assets/image/entry/entry-backup1.png'),
  require('@Assets/image/entry/entry-backup2.png'),
  require('@Assets/image/entry/entry-backup3.png')
];

interface Top3HistoryImageProps {
  onImageReady?: (albumHasImage: boolean) => void;
}

export function Top3HistoryImage({ onImageReady }: Top3HistoryImageProps) {
  const { albumPhotos } = usePublishStore();

  const top3Photos = useMemo(() => {
    const images = albumPhotos.slice(0, 3).map(item => item.url) as string[];
    onImageReady?.(Boolean(albumPhotos.length));

    if (images.length < 3) {
      images.push(...PUBLISH_IMAGE_BACKUP.slice(0, 3 - images.length));
    }
    return images;
  }, [albumPhotos]);

  return (
    <View style={$containerStyle}>
      {top3Photos.map((item, index) => (
        <Image
          key={index}
          style={[$imageCommon, imageStyleList[index]]}
          source={item}
          tosSize="size10"
        />
      ))}
    </View>
  );
}

const $containerStyle: ViewStyle = {
  width: 60,
  height: 60
};

const $imageCommon: ImageStyle = {
  position: 'absolute',
  width: 34,
  height: 44,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: 'white',
  backgroundColor: 'white',
  left: 11,
  top: 6
};

const $image0: ImageStyle = {
  zIndex: 3
};

const $image1: ImageStyle = {
  zIndex: 2,
  transform: [{ scale: 0.8 }, { rotate: '-20deg' }, { translateX: -10 }]
};

const $image2: ImageStyle = {
  zIndex: 1,
  transform: [{ scale: 0.8 }, { rotate: '20deg' }, { translateX: 10 }]
};

const imageStyleList = [$image0, $image1, $image2];
