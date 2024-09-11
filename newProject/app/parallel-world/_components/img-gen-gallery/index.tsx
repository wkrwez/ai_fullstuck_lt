import { Ref, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Icon } from '@/src/components';
import { colors } from '@/src/theme';
import { createStyle } from '@/src/utils';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';
import GalleryPagination from './gallery-pagination';

const { width: screenW } = Dimensions.get('window');

const imgW = screenW - 100 * 2;
const imgH = (imgW / 3) * 4;

interface ImageSize {
  imageWidth: number;
  imageHeight: number;
}

const ReloadBtn = ({
  imageWidth,
  imageHeight,
  loadMore
}: ImageSize & {
  loadMore?: () => void;
}) => (
  <Pressable
    onPress={loadMore}
    style={[
      {
        width: imageWidth / 3 + 12,
        top: imageHeight * 0.05,
        height: imageHeight * 0.9
      },
      reloadStyle.$btn
    ]}
  >
    <Icon icon="reload" />
    <View>
      {'重新生成'.split('').map(w => (
        <Text key={w} style={reloadStyle.$font}>
          {w}
        </Text>
      ))}
    </View>
  </Pressable>
);

const SideMask = ({
  imageWidth,
  imageHeight,
  isLeft = true
}: ImageSize & {
  isLeft: boolean;
}) => (
  <LinearGradient
    colors={
      isLeft
        ? ['rgba(22, 28, 38, 0.8)', 'rgba(22, 28, 38, 0)']
        : ['rgba(22, 28, 38, 0)', 'rgba(22, 28, 38, 0.8)']
    }
    start={{ x: 0, y: 1 }}
    end={{ x: 1, y: 1 }}
    style={[
      {
        width: imageWidth / 3,
        top: imageHeight * 0.05,
        height: imageHeight * 0.9
      },
      isLeft
        ? {
            left: 0,
            position: 'absolute'
          }
        : {
            right: 0,
            position: 'absolute'
          }
    ]}
  />
);

interface RenderImage<T> {
  (
    info: CarouselRenderItemInfo<T>,
    imgSize: { width: number; height: number }
  ): React.ReactElement;
}

interface ImgGenGalleryProps<T> extends Partial<ImageSize> {
  data: T[];
  renderImage: RenderImage<T>;
  renderThumbnail?: (d: T, index: number) => React.ReactElement;
  loadMore?: () => void;
}

function RawImgGenGallery<T>(
  {
    data,
    renderImage,
    renderThumbnail,
    loadMore,
    imageWidth = imgW,
    imageHeight = imgH
  }: ImgGenGalleryProps<T>,
  ref: Ref<{ galleryInstance: ICarouselInstance | null }>
) {
  const carouselRef = useRef<ICarouselInstance>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isEnd, setIsEnd] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  const handleScrollBegin = () => {
    setIsEnd(false);
    setIsFirst(false);
  };

  useImperativeHandle(ref, () => ({ galleryInstance: carouselRef.current }), [
    carouselRef.current
  ]);

  const handleScrollEnd = (index: number) => {
    if (index === data.length - 1) {
      setIsEnd(true);
    }
    if (index === 0) {
      setIsFirst(true);
    }
  };

  return (
    <View
      style={{ alignItems: 'center', paddingBottom: 16, position: 'relative' }}
    >
      <Carousel
        width={imageWidth + 100}
        height={imageHeight}
        ref={carouselRef}
        data={data}
        loop={false}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxAdjacentItemScale: 0.9
        }}
        style={{
          overflow: 'visible'
        }}
        onSnapToItem={index => {
          setActiveIndex(index);
        }}
        onScrollBegin={handleScrollBegin}
        onScrollEnd={handleScrollEnd}
        renderItem={info =>
          renderImage(info, { width: imageWidth, height: imageHeight })
        }
      />
      <GalleryPagination
        data={data}
        activeIndex={activeIndex}
        renderItem={renderThumbnail}
        onPageChange={(_, i) => {
          setActiveIndex(i);
          carouselRef.current?.scrollTo({ index: i, animated: true });
        }}
      />
      {isEnd && loadMore && (
        <ReloadBtn
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          loadMore={loadMore}
        />
      )}
      {!isFirst && (
        <SideMask imageHeight={imageHeight} imageWidth={imageWidth} isLeft />
      )}
      {!isEnd && (
        <SideMask
          imageHeight={imageHeight}
          imageWidth={imageWidth}
          isLeft={false}
        />
      )}
    </View>
  );
}

const reloadStyle = createStyle({
  $btn: {
    backgroundColor: '#29394C',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  $font: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white
  }
});

const ImgGenGallery = forwardRef(RawImgGenGallery) as <T>(
  props: ImgGenGalleryProps<T> & {
    ref?: Ref<{ galleryInstance: ICarouselInstance | null }>;
  }
) => ReturnType<typeof RawImgGenGallery>;

export default ImgGenGallery;
