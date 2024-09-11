import { ImageContentFit } from 'expo-image';
import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { Image } from '@/src/components';
import { ImageSizeType } from '@/src/utils/getTosUrl';
import { useImgPreview } from '../_hooks/img-preview.hook';

export interface PreloadImgOperation {
  setImgLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}
interface PreloadImgProps {
  url: string;
  size: Pick<ViewStyle, 'width' | 'height'>;
  boxStyle?: StyleProp<ViewStyle>;
  tosSize?: ImageSizeType;
  contentFit?: ImageContentFit;
  onImgLoad?: (loaded: true) => void;
  onPreviewImgLoad?: (loaded: true) => void;
}

const PreloadImg = forwardRef<PreloadImgOperation, PreloadImgProps>(
  (
    {
      url,
      size: $size,
      tosSize = 'size10',
      boxStyle = {},
      onImgLoad,
      contentFit = 'cover',
      onPreviewImgLoad
    },
    ref
  ) => {
    const { entering, exiting, isImgLoaded, setIsImgLoaded } = useImgPreview();

    useImperativeHandle(ref, () => ({
      setImgLoaded: setIsImgLoaded
    }));

    return (
      <View style={[{ position: 'relative' }, boxStyle, $size]}>
        <Image
          source={{ uri: url }}
          onLoad={() => {
            console.log('----onLoad----');
            setIsImgLoaded(true);
            onPreviewImgLoad && onPreviewImgLoad(true);
            onImgLoad && onImgLoad(true);
          }}
          contentFit={contentFit}
          style={[$size]}
        />
        {!isImgLoaded && (
          <Animated.View
            entering={entering}
            exiting={exiting}
            style={[
              {
                position: 'absolute',
                zIndex: 10
              },
              $size
            ]}
          >
            <Image
              tosSize={tosSize}
              source={url}
              contentFit={contentFit}
              style={{ width: '100%', height: '100%' }}
              onLoad={() => {
                console.log('----onPreviewLoad----');
                onPreviewImgLoad && onPreviewImgLoad(true);
              }}
            />
          </Animated.View>
        )}
      </View>
    );
  }
);

export default PreloadImg;
